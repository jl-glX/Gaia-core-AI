# Gaia-core-AI

# AI-Ready TypeScript Infrastructure Starter

A clean, modular TypeScript starter for building AI applications. Focused on infrastructure with proper separation of concerns, validation, and safety guards.

## Tech Stack

- **Backend**: Node.js, Express, TypeScript
- **Frontend**: React 18, Vite, Tailwind CSS
- **Database**: SQLite with Kysely (optional)
- **Testing**: Vitest
- **Linting**: ESLint, Prettier

## Project Structure

### Backend (`/server`)

```
server/
├── index.ts              # Express app entry point
├── static-serve.ts       # Static file serving
├── middleware/           # Express middleware
│   ├── error-handler.ts
│   ├── request-validator.ts
│   └── rate-limiter.ts
├── routes/              # API endpoints
│   └── api.ts
├── controllers/         # Request handlers
│   └── health.ts
├── services/           # Business logic
│   └── logger.ts
├── providers/          # AI provider adapters
│   ├── types.ts
│   └── base-provider.ts
├── validators/         # Input validation
│   ├── prompt-validator.ts
│   └── schemas.ts
├── guards/            # Security & safety checks
│   ├── pii-guard.ts
│   ├── language-guard.ts
│   └── token-manager.ts
└── utils/            # Helper functions
    ├── sanitizers.ts
    └── chunker.ts
```

### Frontend (`/client`)

```
client/
├── src/
│   ├── pages/
│   │   └── dashboard/
│   │       ├── Dashboard.tsx
│   │       ├── InputPanel.tsx
│   │       ├── ResponseViewer.tsx
│   │       ├── SettingsPanel.tsx
│   │       └── LogsPanel.tsx
│   └── lib/
│       └── api.ts
```

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Runs:

- Frontend dev server: http://localhost:3000
- Backend API: http://localhost:3001

Use `npm start` to launch the backend, frontend, and Electron desktop shell together.

### Build

```bash
npm run build
```

### Code Quality

```bash
# Format code
npm run format

# Lint code
npm run lint

# Run tests
npm run test
```

### CI Pipeline

```bash
npm run ci
```

Checks formatting and linting, type-checks the frontend and backend, runs tests,
and builds both production bundles.

## Docker

```bash
docker build -t ai-starter .
docker run -p 4000:4000 ai-starter
```

## Features

### Backend Infrastructure

- **Modular Structure**: Routes, controllers, services separation
- **Middleware System**: Error handling, validation, rate limiting
- **Type Safety**: Full TypeScript with strict mode
- **Logging**: Structured logging service
- **Error Handling**: Centralized error handler
- **Validation**: Zod schema validation
- **Rate Limiting**: Express rate limit middleware

### AI-Ready Modules

- **Provider Adapter Pattern**: Pluggable AI provider architecture
- **Token Manager**: Track and validate token usage
- **Prompt Validator**: Validate prompt input structure
- **PII Guard**: Detect personally identifiable information
- **Language Guard**: Validate request language
- **Markdown Sanitizer**: Safe markdown handling
- **HTML Escaper**: Prevent XSS attacks
- **Safe Document Chunker**: Chunk documents for processing

### Frontend Dashboard

- Clean, minimal UI
- Textarea for prompt input
- Real-time response viewer
- Settings panel
- Activity logs panel
- Responsive design

## API Endpoints

### Health Check

```
GET /api/health
```

Response:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### Process Prompt

```
POST /api/process
Content-Type: application/json

{
  "prompt": "Your prompt here",
  "settings": {
    "temperature": 0.7,
    "maxTokens": 2000
  }
}
```

## Environment Variables

See `.env.example` for all available options.

## Scripts

- `npm run dev` - Start the web frontend and API
- `npm start` - Start the web frontend, API, and Electron
- `npm run build` - Build the frontend and server for production
- `npm run format` - Format code with Prettier
- `npm run lint` - Lint with ESLint
- `npm run test` - Run tests
- `npm run ci` - Run all checks and production builds

## Safety Features

- XSS protection via HTML escaping
- Restricted development CORS origin
- Rate limiting on API endpoints
- Input validation with Zod
- PII detection warnings
- Language validation
- Token quota management

## Notes

- This is infrastructure-focused, not a complete AI product
- No external AI APIs are configured by default; `/api/process` uses a transparent
  local placeholder provider until an adapter is added
- Implement specific AI providers in `/server/providers`
- Extend validators for your specific use case
- All code is ready for TypeScript strict mode

## License

MIT
