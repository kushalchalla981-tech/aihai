# AI Incident Copilot - Quick Start Guide

## 🎯 Project Overview

**Goal:** Build an AI-powered incident management copilot for small software teams in 15 days.

**Value Proposition:**
- 90% cheaper than Datadog/PagerDuty ($20/month vs $500+/month)
- Automate postmortem creation (60 min → 10 min)
- Intelligent root cause analysis with LLMs
- 50% faster incident resolution

---

## 📚 Key Documents

1. **ai-incident-copilot-research.md** - Complete research report (read this first!)
2. **QUICK_START_GUIDE.md** - This file (quick reference)

---

## 🛠️ Tech Stack at a Glance

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | Next.js 14 + TypeScript | Dashboard, log viewer, postmortem editor |
| **Backend** | FastAPI + Python 3.11 | REST API, processing pipeline |
| **Database** | Supabase (PostgreSQL + pgvector) | Logs, incidents, vector search |
| **Log Parsing** | Drain3 | Extract templates from unstructured logs |
| **Anomaly Detection** | PyOD (Isolation Forest, LOF) | Detect unusual patterns |
| **Clustering** | HDBSCAN | Group similar logs |
| **Embeddings** | sentence-transformers | Semantic log search |
| **LLM** | OpenAI GPT-4 or Ollama | Root cause analysis, postmortems |
| **RAG** | LangChain + LlamaIndex | Context retrieval for LLM |
| **Deployment** | Docker, Vercel, Railway | Local dev + production |

---

## 🚀 15-Day Sprint Plan

### Week 1: Foundation
- **Days 1-2:** Project setup, database schema, Docker
- **Days 3-4:** Log ingestion, parsing (Drain3)
- **Days 5-6:** Anomaly detection (PyOD)
- **Day 7:** Vector search (pgvector)

### Week 2: Intelligence
- **Days 8-9:** LLM integration (RAG + root cause analysis)
- **Days 10-11:** Incident management UI
- **Day 12:** Deployment tracking
- **Day 13:** Postmortem generation

### Week 3: Polish
- **Day 14:** Testing with real logs
- **Day 15:** Demo prep, documentation

---

## 💡 Core Features (MVP)

### Must Have ✅
1. Log upload (file or API)
2. Automatic log parsing
3. Anomaly detection
4. LLM-powered incident summary
5. Timeline generation
6. Root cause hypothesis ranking
7. Postmortem draft generation
8. Basic dashboard

### Nice to Have (Post-MVP) 🔮
- Real-time streaming (Kafka)
- Slack/Discord integration
- Deployment webhooks
- Advanced visualizations
- Mobile app

---

## 🏗️ System Architecture (Simplified)

```
┌─────────────┐
│  Next.js UI │ ← User uploads logs, views incidents
└──────┬──────┘
       ↓
┌─────────────┐
│  FastAPI    │ ← REST endpoints, processing
└──────┬──────┘
       ↓
┌─────────────────────────────────┐
│  Processing Pipeline            │
│  1. Drain3 (parse logs)         │
│  2. PyOD (detect anomalies)     │
│  3. HDBSCAN (cluster logs)      │
│  4. Embeddings (vector search)  │
│  5. LLM (analyze + generate)    │
└──────┬──────────────────────────┘
       ↓
┌─────────────┐
│  Supabase   │ ← PostgreSQL + pgvector + Storage
└─────────────┘
```

---

## 📊 Key Algorithms

### 1. Log Parsing (Drain3)
```
"User 123 logged in" → Template: "User <*> logged in"
```
- Extracts patterns from unstructured logs
- Streaming capable, no training needed

### 2. Anomaly Detection (Isolation Forest)
```
Normal log volume: 100/min
Anomaly detected: 1000/min (spike!)
```
- Detects volume spikes, error rate changes
- Unsupervised learning

### 3. Vector Search (pgvector)
```
Query: "database connection timeout"
Similar logs: "db timeout", "connection failed", "postgres unreachable"
```
- Semantic similarity search
- Finds related incidents

### 4. Root Cause Analysis (LLM + RAG)
```
Input: Logs + Anomalies + Deployments
Output: Ranked hypotheses with confidence scores
```
- Chain-of-thought reasoning
- Evidence-based analysis

---

## 💰 Cost Breakdown

### MVP (Self-Hosted)
- Supabase Free: $0
- Vercel Free: $0
- Railway: $5/month
- OpenAI API: $15/month
- **Total: $20/month**

### Production (100 incidents/month)
- Supabase Pro: $25
- Vercel Pro: $20
- Railway: $20
- OpenAI API: $50
- **Total: $115/month**

**vs. Datadog: $500-1000/month (90% savings!)**

---

## 🎓 Learning Resources

### Must Read
1. [Drain3 Paper](https://jiemingzhu.github.io/pub/pjhe_icws2017.pdf) - Log parsing algorithm
2. [PyOD Docs](https://pyod.readthedocs.io/) - Anomaly detection
3. [LangChain RAG Tutorial](https://python.langchain.com/docs/use_cases/question_answering/)
4. [pgvector Guide](https://supabase.com/docs/guides/ai/vector-columns)

### Quick Tutorials
- **Drain3:** 30 min to understand log template extraction
- **PyOD:** 1 hour to run anomaly detection examples
- **LangChain:** 2 hours to build basic RAG pipeline
- **pgvector:** 1 hour to set up vector search

---

## 🔧 Development Setup (5 Minutes)

```bash
# 1. Clone repository
git clone <your-repo>
cd ai-incident-copilot

# 2. Set up environment
cp .env.example .env
# Edit .env with your Supabase and OpenAI keys

# 3. Start services
docker-compose up

# 4. Access
# Frontend: http://localhost:3000
# Backend: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

---

## 📈 Success Metrics

| Metric | Target | How to Measure |
|--------|--------|----------------|
| **MTTD** (Mean Time to Detect) | <5 min | Time from incident start to anomaly detection |
| **MTTU** (Mean Time to Understand) | <10 min | Time to generate root cause hypothesis |
| **MTTR** (Mean Time to Resolve) | 50% reduction | Compare before/after tool adoption |
| **Postmortem Time** | <15 min | Time to generate draft |
| **Root Cause Accuracy** | >70% | Human validation of top-3 hypotheses |

---

## 🚨 Common Pitfalls & Solutions

### Problem: LLM hallucinations
**Solution:** Always show evidence, require human review, use confidence scores

### Problem: Too many false positive anomalies
**Solution:** Tune contamination parameter, add feedback loop, use domain knowledge

### Problem: Slow vector search
**Solution:** Create proper indexes, limit result count, cache frequent queries

### Problem: High OpenAI costs
**Solution:** Use local Ollama for development, optimize prompts, cache results

---

## 🎯 Demo Script (Day 15)

1. **Upload logs** → Show parsing in action
2. **Detect anomalies** → Highlight spike in errors
3. **Create incident** → Auto-generate timeline
4. **View root causes** → Show ranked hypotheses with evidence
5. **Generate postmortem** → One-click draft creation
6. **Show cost savings** → Compare with Datadog pricing

**Key Message:** "From logs to postmortem in 10 minutes, at 1/10th the cost."

---

## 🤝 Team Roles (Suggested)

### Developer 1: Backend + AI/ML
- FastAPI setup
- Drain3, PyOD, HDBSCAN integration
- LLM prompts and RAG pipeline

### Developer 2: Frontend + UX
- Next.js dashboard
- Timeline visualization
- Postmortem editor

### Developer 3: Infrastructure + Integration
- Supabase setup
- Docker/deployment
- Webhook integrations
- Testing

**Tip:** Pair program on complex parts (LLM integration, vector search)

---

## 📞 Need Help?

1. Check **ai-incident-copilot-research.md** for detailed implementation
2. Review code examples in research doc
3. Test with sample logs first (nginx, application logs)
4. Start simple, iterate quickly

---

## 🎉 You've Got This!

This is a **technically impressive, high-impact project** that solves a real problem. Focus on:
- ✅ Core features first (log parsing → anomaly detection → LLM analysis)
- ✅ Working demo over perfect code
- ✅ Real logs for testing
- ✅ Clear value proposition

**Good luck with your 15-day workshop! 🚀**
