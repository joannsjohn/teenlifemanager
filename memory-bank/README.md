# Memory Bank

This directory contains Cursor's Memory Bank - a comprehensive documentation system that captures the project's context, decisions, and progress.

## Purpose

Since Cursor's memory resets between sessions, the Memory Bank serves as the **single source of truth** about this project. Every file here helps Cursor understand the project and continue work effectively after a reset.

## File Structure

### Core Files (Required)

1. **projectbrief.md** - Foundation document
   - Core requirements and goals
   - Target audience
   - Success criteria
   - Project scope

2. **productContext.md** - Product understanding
   - Problems we're solving
   - How the solution works
   - User experience goals
   - User personas

3. **systemPatterns.md** - Technical architecture
   - System design decisions
   - Code organization patterns
   - Component relationships
   - Design patterns in use

4. **techContext.md** - Technology details
   - Tech stack and versions
   - Development setup
   - Dependencies and tools
   - Technical constraints

5. **activeContext.md** - Current work focus
   - What we're working on now
   - Recent changes
   - Next immediate steps
   - Active decisions

6. **progress.md** - Status tracking
   - What's completed
   - What's in progress
   - What's left to build
   - Known issues

## How to Use

### For Cursor
At the start of any session, read ALL memory bank files to understand:
- Where the project is
- What decisions have been made
- What to work on next

### For Updates
Update memory bank files when:
- Completing significant features
- Making architectural decisions
- Discovering new patterns
- User requests with "**update memory bank**"

### For New Context
Create additional files when needed for:
- Complex feature documentation
- Integration specifications
- API documentation
- Testing strategies

## Maintenance

The memory bank should be:
- ✅ **Accurate** - Reflects current state
- ✅ **Complete** - All important context captured
- ✅ **Clear** - Easy to understand after reset
- ✅ **Up-to-date** - Updated as project evolves

## Dependencies

Files build upon each other:
```
projectbrief.md
    ↓
├─→ productContext.md
├─→ systemPatterns.md
└─→ techContext.md
    ↓
activeContext.md
    ↓
progress.md
```

Read in order for best understanding!

---

**Last Updated**: October 20, 2025
**Project**: Teen Life Manager
**Status**: Foundation Phase Complete






