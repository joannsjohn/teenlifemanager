import 'express-async-errors';
import express, { Express } from 'express';
import cors from 'cors';
import { env } from './config/env';
import { errorHandler } from './middleware/error';

const app: Express = express();

// Middleware
app.use(cors({
  origin: env.corsOrigin,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is running',
    timestamp: new Date().toISOString(),
    environment: env.nodeEnv,
  });
});

// API routes
import authRoutes from './routes/auth.routes';
import eventRoutes from './routes/event.routes';
import volunteerRoutes from './routes/volunteer.routes';
import moodRoutes from './routes/mood.routes';

app.use('/api/auth', authRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/volunteer', volunteerRoutes);
app.use('/api/mood', moodRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = env.port;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${env.nodeEnv}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
});

export default app;

