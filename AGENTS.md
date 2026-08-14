# AGENTS.md - AI Incident Copilot

## Project Overview
AI-powered incident management platform for small engineering teams. Automates log analysis, root cause detection, and postmortem generation.

**Tech Stack:** FastAPI (backend) + Next.js 14 (frontend) + Supabase (database)

## Project Structure
```
C:\projectwa\workshop/
├── backend/                 # FastAPI Python backend
│   ├── app/                 # Application code
│   ├── .env                 # Environment variables (DO NOT COMMIT)
│   ├── requirements.txt     # Python dependencies
│   └── Dockerfile
├── frontend/                # Next.js 14 frontend
│   ├── src/app/             # App router pages
│   ├── package.json         # Node dependencies
│   └── tsconfig.json
├── docker-compose.yml       # Database and services
├── setup.ps1                # One-command setup script
└── quick-start.ps1          # Quick start reference
```

## Development Commands

### Backend
```powershell
cd backend
.\venv\Scripts\Activate.ps1
uvicorn main:app --reload          # Start dev server
pytest                              # Run tests
```

### Frontend
```powershell
cd frontend
npm run dev                         # Start dev server (port 3000)
npm run build                       # Production build
npm run lint                        # ESLint check
```

### Database
```powershell
docker-compose up -d                # Start services
docker-compose down                 # Stop services
```

## Code Conventions

### Python (Backend)
- Follow PEP 8 style guide
- Use type hints for all function signatures
- Use Pydantic models for request/response validation
- Async/await for I/O operations
- Error handling with proper HTTP status codes

### TypeScript (Frontend)
- Strict TypeScript mode enabled
- Use functional components with React hooks
- Prefer server components unless interactivity needed
- Use Tailwind utility classes for styling
- File naming: kebab-case for files, PascalCase for components

## API Guidelines
- RESTful endpoints under `/api/`
- Use HTTP methods correctly (GET, POST, PUT, DELETE)
- Return consistent JSON response format
- Document all endpoints with FastAPI docstrings

## Environment Variables
Required in `backend/.env`:
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_KEY` - Supabase anon key
- `OPENAI_API_KEY` - OpenAI API key
- `ENVIRONMENT` - development/production
- `LOG_LEVEL` - INFO/DEBUG/ERROR

Scan feature (optional — defaults fine):
- `LLM_MODEL` - LLM model for scan deep-review (default gpt-4o-mini)
- `SCAN_TMP_DIR` - temp dir for scan clones (default ./.scan-tmp)
- `MAX_REPO_SIZE_MB` - post-clone walk abort cap in MB (default 50)
- `MAX_SCAN_FILES` - walker abort cap on file count (default 2000)
- `MAX_LLM_FILES` - files sent to LLM per scan (default 10)
- `MAX_LLM_FILE_CHARS` - per-file truncation for LLM (default 12000)
- `MAX_LLM_INPUT_CHARS` - total LLM input budget; rules-only abort beyond (default 600000)
- `SCAN_ALLOWED_HOSTS` - exact-match host allowlist for repo URLs (default github.com,gitlab.com,bitbucket.org)
- `SCAN_MAX_CONCURRENT` - in-process scan semaphore (default 2)

## Testing
- Backend: pytest in `backend/tests/`
- Run pytest from `backend/` with the venv active
- Frontend: Jest/React Testing Library (to be configured)

## Important Notes
- Never commit `.env` files or API keys
- Use the existing virtual environment in `backend/venv/`
- Database schema defined in `DATABASE_SCHEMA.md`
- Sample logs available in `sample-logs.txt` for testing
