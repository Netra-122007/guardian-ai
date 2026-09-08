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
