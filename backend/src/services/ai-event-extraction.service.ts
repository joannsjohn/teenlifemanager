import { GoogleGenerativeAI } from '@google/generative-ai';
import { env } from '../config/env';

export interface ExtractedEventSuggestion {
  title: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  dueTime?: string;
  category?: string;
  confidence: number;
  notes?: string;
}

export interface ExtractedEventResult {
  events: ExtractedEventSuggestion[];
  summary: string;
}

const client = env.geminiApiKey ? new GoogleGenerativeAI(env.geminiApiKey) : null;

export class AIEventExtractionService {
  static isConfigured(): boolean {
    return Boolean(client);
  }

  static async extractEventsFromText(text: string, userContext?: { timezone?: string; preference?: string }): Promise<ExtractedEventResult> {
    if (!client) {
      throw new Error('Gemini API key is not configured');
    }

    const model = client.getGenerativeModel({ model: env.geminiModel });

    const timezoneInstruction = userContext?.timezone ? `The user's timezone is ${userContext.timezone}.` : '';
    const preferenceInstruction = userContext?.preference ? `User preference: ${userContext.preference}.` : '';

    const prompt = `You are an assistant that extracts calendar-worthy events, deadlines, or tasks from unstructured text provided by a high school student.
${timezoneInstruction}
${preferenceInstruction}

Guidelines:
- Focus on actionable items with a specific date/time or deadline.
- Infer reasonable start/end times if missing (use school-friendly hours like 3pm-8pm) but mark them as approximated by adding a note in the "notes" field.
- Assign a short, student-friendly title (max 8 words).
- Provide a concise description if helpful.
- Pick a category from: "school", "study", "extracurricular", "personal", "volunteering", "other".
- Include a confidence score between 0 and 1.
- If no events are found, return an empty list.
- Summarize overall findings in plain language.

Return JSON ONLY in the following shape:
{
  "events": [
    {
      "title": string,
      "description": string?,
      "startTime": string?,
      "endTime": string?,
      "dueTime": string?,
      "category": string?,
      "confidence": number,
      "notes": string?
    }
  ],
  "summary": string
}

If dates are mentioned without year, assume they refer to the next upcoming date in the user's timezone (if provided). Text to analyze:
"""
${text}
"""`;

    const result = await model.generateContent({ contents: [{ role: 'user', parts: [{ text: prompt }] }] });
    const raw = result.response?.text();

    if (!raw) {
      throw new Error('Failed to parse AI response');
    }

    try {
      const cleaned = raw
        .replace(/^```json/i, '')
        .replace(/^```/, '')
        .replace(/```$/, '')
        .trim();

      const parsed = JSON.parse(cleaned) as ExtractedEventResult;
      if (!Array.isArray(parsed.events)) {
        parsed.events = [];
      }
      return parsed;
    } catch (error) {
      console.error('Failed to parse Gemini JSON response:', raw);
      throw new Error('Unexpected AI response format');
    }
  }
}
