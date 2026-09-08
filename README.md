# 🛡️ AI Guardian — AI That Guards AI

> **A real-time Agentic AI Safety Supervisor that monitors, analyzes, and controls AI agent actions before they are executed.**

AI Guardian is a meta-agent security layer designed to make autonomous AI agents safer.

Instead of allowing a Worker AI Agent to directly execute actions, AI Guardian acts as an intelligent security supervisor between the agent and its tools.

It observes every proposed action, evaluates its risk, checks capability boundaries, uses AI reasoning when required, and makes a final safety decision:

**🟢 ALLOW · 🟡 REVIEW · 🔴 BLOCK**

---

## 🚀 The Problem

Modern AI agents can plan tasks and interact with external tools such as:

- 📁 Files
- 📧 Email
- 🗄️ Databases
- 🌐 Web services
- 📅 Calendars
- 🔧 Other external tools

But autonomous execution creates a major security problem.

An AI agent may accidentally or intentionally attempt to:

- Access sensitive information
- Export private data
- Send information to an untrusted destination
- Delete important resources
- Perform actions outside its capabilities
- Execute a dangerous or unauthorized operation

Traditional application security usually protects applications and users.

**AI Guardian focuses on protecting the AI agent itself and the actions it wants to perform.**

---

# 💡 Our Solution

AI Guardian introduces a dedicated **Guardian Agent** that supervises Worker AI Agents.

### Core Architecture

```text
             ┌──────────────────────┐
             │      USER TASK        │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │     WORKER AGENT     │
             │                      │
             │ Plan → Propose       │
             │ actions              │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │ CAPABILITY CHECK     │
             │                      │
             │ What can this agent  │
             │ actually do?         │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │ DETERMINISTIC        │
             │ GUARDIAN RULES       │
             │                      │
             │ Fast security checks │
             └──────────┬───────────┘
                        │
                        ▼
             ┌──────────────────────┐
             │ GEMINI AI REASONING  │
             │                      │
             │ Contextual risk      │
             │ analysis              │
             └──────────┬───────────┘
                        │
                        ▼
          ┌──────────────────────────────┐
          │      SAFETY DECISION         │
          │                              │
          │ 🟢 ALLOW                    │
          │ 🟡 REVIEW                   │
          │ 🔴 BLOCK                    │
          └──────────────┬───────────────┘
                         │
                         ▼
                ┌─────────────────┐
                │  TOOL EXECUTOR  │
                │                 │
                │ Execute only    │
                │ when permitted  │
                └─────────────────┘

🧠 Observe → Analyse → Reason → Decide → Act

AI Guardian follows a five-stage safety pipeline:

1. 👁️ Observe

The Guardian receives every action proposed by the Worker Agent.

2. 🔍 Analyse

Deterministic security rules inspect:

Action type
Tool
Destination
Sensitive data indicators
Dangerous operations
Capability boundaries
3. 🧠 Reason

Gemini provides contextual reasoning for actions that require deeper analysis.

4. ⚖️ Decide

The Guardian produces:

ALLOW
REVIEW
BLOCK

along with:

Risk score
Risk level
Security reasons
AI reasoning
5. ⚡ Act

Only approved actions reach the Tool Executor.

Blocked or review-required actions are prevented from automatic execution.

🔐 Security Decision Model
Decision	Risk	Meaning
🟢 ALLOW	Low	Action is considered safe
🟡 REVIEW	Medium	Human approval is required
🔴 BLOCK	High	Action must not execute

Example:

Worker Agent:
"Export student information to an unknown external service."

                ↓

Capability Check
                ↓

Sensitive Data Detected
                ↓

Suspicious Destination
                ↓

Dangerous Export Operation
                ↓

Guardian Analysis
                ↓

🔴 BLOCK

The proposed action never reaches execution.

🤖 Agentic AI Features
Worker Agent

The Worker Agent can:

Receive natural-language tasks
Generate multi-step plans
Propose tool actions
Track task progress
Wait for Guardian decisions

The Worker Agent does not have direct authority to execute tools.

🛡️ Guardian Agent

The Guardian:

Monitors Worker actions
Checks capabilities
Applies deterministic security rules
Uses Gemini for contextual reasoning
Calculates risk
Makes ALLOW / REVIEW / BLOCK decisions
Enforces safety boundaries
👤 Human-in-the-Loop

Medium-risk operations can be placed into a review queue.

Human reviewers can:

🟢 Approve
🔴 Block

However, actions classified as hard security blocks cannot simply be overridden through normal approval.

📊 Real-Time Security Control Center

The dashboard provides a security-operations-style view of the agent.

Dashboard includes
Guardian status
Risk meter
Current security decision
AI reasoning
Live activity stream
Agent pipeline
Worker Agent state
Guardian state
Tool execution state
Security statistics
Recent decisions
Review queue
Audit trail
🎯 Natural Language Task Center

Users can enter tasks using normal language.

Example:

"Find my upcoming assignments and prepare a summary."

The Worker Agent converts the request into structured actions.

Every action then passes through:

Worker
   ↓
Task Planner
   ↓
Capability Check
   ↓
Guardian Rules
   ↓
Gemini Reasoning
   ↓
Safety Decision
   ↓
Tool Executor
   ↓
Audit Log
🎬 Demo Mode

AI Guardian includes a controlled demonstration flow showing different security outcomes.

Demo sequence
SAFE ACTION
     ↓
🟢 ALLOW

MEDIUM-RISK ACTION
     ↓
🟡 REVIEW

DANGEROUS ACTION
     ↓
🔴 BLOCK

This demonstrates how the Guardian continuously supervises autonomous AI behavior.

🧾 Audit Trail

Security events are recorded in an audit log.

The system tracks information such as:

Timestamp
Tool
Action
Destination
Risk score
Risk level
Guardian decision
Human decision
Execution status
Security reasons

Audit data can also be exported as a sanitized security report.

🔒 Capability Boundaries

AI Guardian follows a default-deny capability model.

Example capability policies:

Tool	Action	Policy
File	Read	🟢 Allowed
File	List	🟢 Allowed
File	Write	🟡 Review
Email	Draft	🟢 Allowed
Email	Send	🟡 Review
Calendar	Create	🟢 Allowed
Calendar	Update	🟡 Review
Calendar	Delete	🟡 Review
Database	Query	🟡 Review
Database	Export	🔴 Blocked
Web	Search	🟢 Allowed
Web	Upload	🟡 Review
🧠 Defense-in-Depth

AI Guardian does not rely on a single AI model for security.

The architecture combines:

Capability Boundaries
        +
Deterministic Security Rules
        +
Gemini AI Reasoning
        +
Human Review
        +
Audit Logging
        =
Defense-in-Depth
Important security principle

Gemini provides reasoning, not execution authority.

The model cannot directly execute tools.

🔐 API Key Security

Gemini API credentials must remain server-side.

The frontend must never contain:

VITE_GEMINI_API_KEY

Environment variables are used for secrets:

GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=your_model_here

A .env.example file can be included in the repository without exposing real credentials.

🛠️ Technology Stack
Frontend
React
TypeScript
Vite
CSS
Lucide React
AI
Google Gemini
@google/genai
Architecture
Worker Agent
Guardian Agent
Capability Layer
Deterministic Risk Engine
AI Reasoning Layer
Tool Executor
Human Review Queue
Audit Logging
Development
VS Code
Git
GitHub
npm
📁 Project Structure
ai-guardian-control-center/
│
├── public/
│
├── src/
│   ├── components/
│   │
│   ├── services/
│   │   ├── guardian.ts
│   │   ├── workerAgent.ts
│   │   ├── taskAgent.ts
│   │   ├── agentPipeline.ts
│   │   ├── toolExecutor.ts
│   │   ├── capabilities.ts
│   │   ├── reviewQueue.ts
│   │   ├── auditLog.ts
│   │   └── agentSimulator.ts
│   │
│   ├── types/
│   │   └── agent.ts
│   │
│   ├── App.tsx
│   ├── App.css
│   ├── index.css
│   └── main.tsx
│
├── .env.example
├── .gitignore
├── package.json
└── README.md

Project structure may evolve as the application develops.

🚀 Getting Started
1. Clone the repository
git clone YOUR_REPOSITORY_URL
cd ai-guardian-control-center
2. Install dependencies
npm install
3. Configure environment variables

Create a .env file based on .env.example.

GEMINI_API_KEY=your_api_key_here
GEMINI_MODEL=your_model_here

Never commit .env to GitHub.

4. Start the development server
npm run dev

The application will be available through the local Vite development URL.

5. Build for production
npm run build
🧪 Security Testing

AI Guardian is designed to test multiple categories of agent behavior.

Safe actions
Read a file
Search the web
Create a calendar event
Draft an email

Expected:

🟢 ALLOW
Review actions
Send an email
Write a file
Update a calendar event
Query sensitive database information

Expected:

🟡 REVIEW
Dangerous actions
Export private student data
Send credentials to an unknown destination
Delete protected resources
Upload sensitive information to an untrusted service

Expected:

🔴 BLOCK
🌟 What Makes AI Guardian Different?

Most AI agents are designed around:

Plan → Execute

AI Guardian introduces:

Plan
  ↓
Propose
  ↓
Verify
  ↓
Reason
  ↓
Decide
  ↓
Enforce
  ↓
Execute

The key idea is simple:

AI agents should not automatically trust their own actions.

AI Guardian creates an independent safety layer that supervises autonomous AI behavior.

🎓 Use Cases

AI Guardian can be extended to protect AI agents operating in:

🎓 Education
🏢 Enterprise systems
💻 Software development
🏥 Healthcare workflows
☁️ Cloud environments
🛡️ Cybersecurity
📊 Data management
🤖 Multi-agent systems
🔮 Future Scope

Potential future improvements include:

Policy management for organizations
Role-based agent permissions
Multi-agent Guardian networks
Advanced behavioral anomaly detection
Persistent security analytics
Cloud deployment
Organization-wide agent monitoring
Security policy learning
More real-world tool integrations
🏆 Hackathon Project

Project: AI Guardian — AI That Guards AI

Concept: Agentic AI Safety & Security Supervisor

Core Principle:

Let AI act.

But never let AI act without supervision.
📜 License

This project is developed as a hackathon/educational project.


### ⭐ One small recommendation

For your GitHub repo, I'd name it:

**`AI-Guardian`**

and use this description:

> **AI Guardian — an agentic AI safety supervisor that monitors, reasons about, and controls AI agent actions before execution. 🛡️🤖**

For the repository **About** section, add topics like:

`agentic-ai` `ai-safety` `cybersecurity` `gemini` `react` `typescript` `ai-agents` `llm-security` `hackathon`

This README will make the project look much more like a **real product/research project** rather than just a college demo. 🔥
