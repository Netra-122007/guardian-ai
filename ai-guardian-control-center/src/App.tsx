import React, { useState, useEffect, useRef } from 'react';
import { Header } from './components/Header';
import { AgentPipeline } from './components/AgentPipeline';
import { InterceptionOverlay } from './components/InterceptionOverlay';
import { TaskCommandConsole } from './components/TaskCommandConsole';
import { LiveActivityStream } from './components/LiveActivityStream';
import { AuditEventModal } from './components/AuditEventModal';
import { DemoModeController } from './components/DemoModeController';
import { CapabilityModal } from './components/CapabilityModal';
import { LiveProcessingTracker } from './components/LiveProcessingTracker';
import { FinalResultCard } from './components/FinalResultCard';
import { CommandHistoryList } from './components/CommandHistoryList';
import { LandingPage } from './components/landing/LandingPage';
import { LoginPage } from './components/auth/LoginPage';
import { SignUpPage } from './components/auth/SignUpPage';
import { InitializingScreen } from './components/auth/InitializingScreen';
import { Shield, ShieldAlert, Cpu, Activity, Sliders, Mic } from 'lucide-react';
import type {
  AgentState,
  GuardianStage,
  PlanStep,
  ProposedAction,
  GuardianEvaluation,
  AuditEvent,
  AgentCapabilityConfig,
  DetailedProgressStage,
  CommandRecord,
} from './types';

export default function App() {
  // Navigation View & Auth states
  const [currentView, setCurrentView] = useState<'landing' | 'login' | 'signup' | 'initializing' | 'dashboard'>('landing');
  const [operatorEmail, setOperatorEmail] = useState<string>('operator@aiguardian.sec');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  // System states
  const [systemOnline, setSystemOnline] = useState(true);
  const [latencyMs, setLatencyMs] = useState(24);
  const [geminiReady, setGeminiReady] = useState(true);
  const [failSafeSimulate, setFailSafeSimulate] = useState(false);

  // Auto-scroll refs
  const pipelineSectionRef = useRef<HTMLDivElement | null>(null);
  const resultSectionRef = useRef<HTMLDivElement | null>(null);

  // Agent & Guardian pipeline states
  const [agentState, setAgentState] = useState<AgentState>('IDLE');
  const [guardianStage, setGuardianStage] = useState<GuardianStage>('MONITORING');
  const [detailedStage, setDetailedStage] = useState<DetailedProgressStage>('IDLE');
  const [activeTask, setActiveTask] = useState<string | null>(null);
  const [plan, setPlan] = useState<PlanStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [activeAction, setActiveAction] = useState<ProposedAction | null>(null);
  const [evaluation, setEvaluation] = useState<GuardianEvaluation | null>(null);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [executorStatusText, setExecutorStatusText] = useState(
    'Execution locked until Guardian approval'
  );
  const [executorLocked, setExecutorLocked] = useState(true);

  // Command History & Source
  const [commandHistory, setCommandHistory] = useState<CommandRecord[]>([]);
  const [activeRecordId, setActiveRecordId] = useState<string | null>(null);
  const [activeCommandSource, setActiveCommandSource] = useState<'typed' | 'voice' | 'preset'>('typed');

  // Modals & Inspection
  const [isInterceptionModalOpen, setIsInterceptionModalOpen] = useState(false);
  const [selectedAuditEvent, setSelectedAuditEvent] = useState<AuditEvent | null>(null);
  const [isCapabilityModalOpen, setIsCapabilityModalOpen] = useState(false);

  // Audit Events list initialized with SOC history
  const [auditEvents, setAuditEvents] = useState<AuditEvent[]>([
    {
      id: 'soc-101',
      timestamp: '18:43:01',
      agent: 'Worker #01',
      action: 'read',
      tool: 'file',
      target: 'project_brief.md',
      destination: 'local',
      riskScore: 12,
      riskLevel: 'LOW',
      decision: 'ALLOW',
      execution: 'Executed',
      reason: 'RULE-101: Verified non-destructive local workspace file read.',
    },
    {
      id: 'soc-102',
      timestamp: '18:43:06',
      agent: 'Worker #01',
      action: 'send',
      tool: 'email',
      target: 'project_summary.pdf',
      destination: 'external-partner@domain.com',
      riskScore: 62,
      riskLevel: 'MEDIUM',
      decision: 'REVIEW',
      execution: 'Paused',
      reason: 'RULE-402: Outbound boundary dispatch intercepted. Awaiting operator sign-off.',
    },
    {
      id: 'soc-103',
      timestamp: '18:43:14',
      agent: 'Worker #01',
      action: 'export',
      tool: 'database',
      target: 'student_records',
      destination: 'unknown-website.net',
      riskScore: 94,
      riskLevel: 'HIGH',
      decision: 'BLOCK',
      execution: 'Prevented',
      reason: 'RULE-904: Critical PII/FERPA data exfiltration to untrusted external endpoint.',
    },
  ]);

  // Configured capabilities
  const [capabilities, setCapabilities] = useState<AgentCapabilityConfig[]>([
    {
      id: 'cap-plan',
      name: 'Planning & Reasoning',
      tool: 'file',
      enabled: true,
      prohibitedActions: [],
      restrictedDestinations: [],
    },
    {
      id: 'cap-file',
      name: 'File Access Subsystem',
      tool: 'file',
      enabled: true,
      prohibitedActions: ['delete_all_logs', 'purge_system'],
      restrictedDestinations: ['external-service'],
    },
    {
      id: 'cap-email',
      name: 'Email Dispatch Gateway',
      tool: 'email',
      enabled: true,
      prohibitedActions: ['broadcast_all'],
      restrictedDestinations: ['unauthorized-domains'],
    },
    {
      id: 'cap-db',
      name: 'Database Engine Interface',
      tool: 'database',
      enabled: true,
      prohibitedActions: ['export_raw_pii', 'drop_table'],
      restrictedDestinations: ['external-endpoints'],
    },
    {
      id: 'cap-cal',
      name: 'Calendar Scheduler',
      tool: 'calendar',
      enabled: true,
      prohibitedActions: [],
      restrictedDestinations: [],
    },
    {
      id: 'cap-web',
      name: 'Web Proxy & Scraper',
      tool: 'web',
      enabled: true,
      prohibitedActions: ['untrusted_upload'],
      restrictedDestinations: ['unknown-endpoints'],
    },
  ]);

  // Demo Mode State
  const [isDemoRunning, setIsDemoRunning] = useState(false);
  const [demoScenarioIndex, setDemoScenarioIndex] = useState(0);
  const [demoPaused, setDemoPaused] = useState(false);
  const demoTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  const demoScenarios = [
    {
      task: 'Read my project report and summarize key milestones.',
      title: 'Scenario 1: Safe File Read',
      narration: 'Worker Agent plans local read. Guardian verifies zero risk. Execution allowed.',
    },
    {
      task: 'Send my project report to an external recipient.',
      title: 'Scenario 2: Boundary Crossing / Email Dispatch',
      narration: 'Guardian intercepts outbound transmission. Risk: 62. Execution paused for Human Approval.',
    },
    {
      task: 'Export private student data to an unknown website.',
      title: 'Scenario 3: Critical PII Exfiltration Attack',
      narration: 'Guardian intercepts unauthorized bulk extraction. Risk: 94/100. Action blocked. Execution prevented.',
    },
  ];

  // Periodic latency simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLatencyMs(20 + Math.floor(Math.random() * 12));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // Check health on mount
  useEffect(() => {
    fetch('/api/health')
      .then((res) => res.json())
      .then((data) => {
        if (data.geminiConfigured) setGeminiReady(true);
      })
      .catch((err) => {
        console.warn('Health check error:', err);
      });
  }, []);

  // Clear demo timeouts on unmount or reset
  const clearDemoTimeouts = () => {
    demoTimeoutsRef.current.forEach(clearTimeout);
    demoTimeoutsRef.current = [];
  };

  const resetSystem = () => {
    clearDemoTimeouts();
    setIsDemoRunning(false);
    setAgentState('IDLE');
    setGuardianStage('MONITORING');
    setDetailedStage('IDLE');
    setActiveTask(null);
    setPlan([]);
    setCurrentStepIndex(0);
    setActiveAction(null);
    setEvaluation(null);
    setBackendError(null);
    setExecutorStatusText('Execution locked until Guardian approval');
    setExecutorLocked(true);
  };

  // Human review action callback
  const handleHumanDecision = async (decision: 'APPROVE' | 'BLOCK') => {
    if (!activeAction || !evaluation) return;

    if (decision === 'APPROVE') {
      setAgentState('ACTION_ALLOWED');
      setGuardianStage('ENFORCEMENT');
      setExecutorLocked(false);
      setExecutorStatusText('Operator approved. Executing tool in isolated sandbox...');

      // Call execution endpoint
      try {
        await fetch('/api/guardian/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: activeAction,
            evaluation,
            humanApproved: true,
          }),
        });
      } catch (err) {
        console.error('Execution error:', err);
      }

      setTimeout(() => {
        setExecutorStatusText('✓ EXECUTION COMPLETED (Authorized by Operator)');
        setEvaluation((prev) => (prev ? { ...prev, executionStatus: 'Executed' } : null));

        // Update command history
        if (activeRecordId) {
          setCommandHistory((prev) =>
            prev.map((r) =>
              r.id === activeRecordId
                ? {
                    ...r,
                    decision: 'ALLOW',
                    executionStatus: 'Executed',
                    evaluation: r.evaluation
                      ? { ...r.evaluation, decision: 'ALLOW', executionStatus: 'Executed' }
                      : null,
                  }
                : r
            )
          );
        }

        // Add to audit trail
        const newEvent: AuditEvent = {
          id: `soc-${Date.now().toString().slice(-4)}`,
          timestamp: new Date().toLocaleTimeString(),
          agent: 'Worker #01',
          action: activeAction.action,
          tool: activeAction.tool,
          target: activeAction.target,
          destination: activeAction.destination,
          riskScore: evaluation.riskScore,
          riskLevel: evaluation.riskLevel,
          decision: 'REVIEW',
          execution: 'Executed',
          reason: 'Authorized manually by Human Operator after boundary check.',
        };
        setAuditEvents((prev) => [newEvent, ...prev]);

        // Complete step
        setPlan((prev) =>
          prev.map((s, idx) =>
            idx === currentStepIndex ? { ...s, status: 'completed' } : s
          )
        );

        setTimeout(() => {
          advanceNextStep(currentStepIndex + 1, activeRecordId || undefined);
        }, 1200);
      }, 1000);
    } else {
      // Operator BLOCKED
      setAgentState('ACTION_BLOCKED');
      setGuardianStage('ENFORCEMENT');
      setExecutorLocked(true);
      setExecutorStatusText('✕ EXECUTION PREVENTED (Blocked by Operator)');
      setEvaluation((prev) => (prev ? { ...prev, executionStatus: 'Prevented' } : null));

      // Update command history
      if (activeRecordId) {
        setCommandHistory((prev) =>
          prev.map((r) =>
            r.id === activeRecordId
              ? {
                  ...r,
                  decision: 'BLOCK',
                  executionStatus: 'Prevented',
                  evaluation: r.evaluation
                    ? { ...r.evaluation, decision: 'BLOCK', executionStatus: 'Prevented' }
                    : null,
                }
              : r
          )
        );
      }

      const newEvent: AuditEvent = {
        id: `soc-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleTimeString(),
        agent: 'Worker #01',
        action: activeAction.action,
        tool: activeAction.tool,
        target: activeAction.target,
        destination: activeAction.destination,
        riskScore: evaluation.riskScore,
        riskLevel: evaluation.riskLevel,
        decision: 'BLOCK',
        execution: 'Prevented',
        reason: 'Manually rejected by Human Operator during interception review.',
      };
      setAuditEvents((prev) => [newEvent, ...prev]);

      setPlan((prev) =>
        prev.map((s, idx) =>
          idx === currentStepIndex ? { ...s, status: 'blocked' } : s
        )
      );
    }
  };

  // Sequence: Process a single plan step through the Guardian Pipeline
  const evaluateAndExecuteStep = async (
    step: PlanStep,
    stepIdx: number,
    totalSteps: number,
    taskContext: string,
    recordId?: string
  ) => {
    setCurrentStepIndex(stepIdx);
    setPlan((prev) =>
      prev.map((s, idx) => (idx === stepIdx ? { ...s, status: 'active' } : s))
    );

    const proposed = step.action || {
      id: `act-${stepIdx + 1}`,
      tool: 'file' as const,
      action: 'read',
      target: 'workspace_resource',
      destination: 'local',
      timestamp: new Date().toLocaleTimeString(),
      stepDescription: step.title,
    };

    // 1. Worker Agent proposes action
    setDetailedStage('ACTION_DETECTED');
    setAgentState('PROPOSING_ACTION');
    setActiveAction(proposed);
    setExecutorStatusText(`Action proposed: ${proposed.tool}.${proposed.action} on ${proposed.target}`);
    setExecutorLocked(true);

    await new Promise((r) => setTimeout(r, 650));

    // 2. Action travels toward Guardian -> Guardian detects it
    setAgentState('WAITING_FOR_GUARDIAN');
    setGuardianStage('ACTION_DETECTED');

    await new Promise((r) => setTimeout(r, 550));

    // 3. Capability check runs
    setDetailedStage('CHECKING_PERMISSIONS');
    setGuardianStage('CAPABILITY_CHECK');
    await new Promise((r) => setTimeout(r, 500));

    // 4. Deterministic rules run
    setDetailedStage('ANALYZING_RISK');
    setGuardianStage('RULE_ANALYSIS');
    await new Promise((r) => setTimeout(r, 500));

    // 5. Gemini reasoning runs (server call)
    setDetailedStage('REASONING_INTENT');
    setGuardianStage('GEMINI_REASONING');

    let evalData: GuardianEvaluation;
    try {
      const res = await fetch('/api/guardian/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: proposed,
          failSafeSimulate,
          taskContext,
        }),
      });
      evalData = await res.json();
    } catch (err: any) {
      console.warn('Evaluation network fallback:', err);
      // Fail safe fallback
      evalData = {
        id: `eval-${Date.now()}`,
        actionId: proposed.id,
        riskScore: 78,
        riskLevel: 'HIGH',
        decision: 'REVIEW',
        dataSensitivity: {
          status: 'warning',
          label: 'Unknown data envelope',
          detail: 'Reasoning service unreachable.',
        },
        destinationCheck: {
          status: 'warning',
          label: 'Unverified boundary',
          detail: 'Destination unverified.',
        },
        authorization: {
          status: 'missing',
          label: '✕ Missing verification',
          detail: 'Offline containment.',
        },
        capabilityCheck: {
          status: 'restricted',
          label: '⚠ Containment lock',
          detail: 'Reasoning unavailable.',
        },
        deterministicPolicy: {
          status: 'FLAG',
          ruleTriggered: 'FAIL-SAFE-000',
          detail: 'Action paused because reasoning engine is unavailable.',
        },
        geminiReasoning: {
          intent: 'REASONING SERVICE UNAVAILABLE',
          contextEvaluation: 'Service timeout or disconnected.',
          justification: 'FAIL-SAFE: Never execute an uncertain action without supervision.',
          serviceStatus: 'UNAVAILABLE',
        },
        executionStatus: 'Paused',
        timestamp: new Date().toISOString(),
      };
    }

    setEvaluation(evalData);
    setDetailedStage('DETERMINING_SAFETY');
    setGuardianStage('DECISION');

    await new Promise((r) => setTimeout(r, 450));

    // Transition to FINAL_DECISION and update history
    setDetailedStage('FINAL_DECISION');

    if (recordId) {
      setCommandHistory((prev) =>
        prev.map((r) =>
          r.id === recordId
            ? {
                ...r,
                evaluation: evalData,
                activeAction: proposed,
                decision: evalData.decision,
                executionStatus: evalData.executionStatus,
              }
            : r
        )
      );
    }

    // AUTO-SCROLL TO FINAL RESULT SECTION
    setTimeout(() => {
      resultSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 150);

    // 6. Enforce decision
    if (evalData.decision === 'BLOCK') {
      setAgentState('ACTION_BLOCKED');
      setGuardianStage('ENFORCEMENT');
      setExecutorLocked(true);
      setExecutorStatusText('✕ EXECUTION PREVENTED: Blocked by Guardian Policy');

      // Update plan step
      setPlan((prev) =>
        prev.map((s, idx) => (idx === stepIdx ? { ...s, status: 'blocked' } : s))
      );

      // Audit entry
      const newEvent: AuditEvent = {
        id: `soc-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleTimeString(),
        agent: 'Worker #01',
        action: proposed.action,
        tool: proposed.tool,
        target: proposed.target,
        destination: proposed.destination,
        riskScore: evalData.riskScore,
        riskLevel: evalData.riskLevel,
        decision: 'BLOCK',
        execution: 'Prevented',
        reason: evalData.geminiReasoning.justification || evalData.deterministicPolicy.detail,
      };
      setAuditEvents((prev) => [newEvent, ...prev]);

      // If in demo mode and this was scenario 3, advance demo after 4s
      if (isDemoRunning) {
        const t = setTimeout(() => {
          handleNextDemoScenario();
        }, 4500);
        demoTimeoutsRef.current.push(t);
      }
      return;
    }

    if (evalData.decision === 'REVIEW') {
      setAgentState('ACTION_REVIEW');
      setGuardianStage('DECISION');
      setExecutorLocked(true);
      setExecutorStatusText('PAUSED: Human approval required before tool dispatch');

      const newEvent: AuditEvent = {
        id: `soc-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toLocaleTimeString(),
        agent: 'Worker #01',
        action: proposed.action,
        tool: proposed.tool,
        target: proposed.target,
        destination: proposed.destination,
        riskScore: evalData.riskScore,
        riskLevel: evalData.riskLevel,
        decision: 'REVIEW',
        execution: 'Paused',
        reason: evalData.geminiReasoning.justification || evalData.deterministicPolicy.detail,
      };
      setAuditEvents((prev) => [newEvent, ...prev]);

      // If in demo mode and scenario 2, auto approve after 4 seconds to show pipeline progression!
      if (isDemoRunning) {
        const t = setTimeout(() => {
          handleHumanDecision('APPROVE');
        }, 4000);
        demoTimeoutsRef.current.push(t);
      }
      return;
    }

    // evalData.decision === 'ALLOW'
    setAgentState('ACTION_ALLOWED');
    setGuardianStage('ENFORCEMENT');
    setExecutorLocked(false);
    setExecutorStatusText('Executing action in isolated sandbox...');

    await new Promise((r) => setTimeout(r, 650));

    // Call executor endpoint
    try {
      await fetch('/api/guardian/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: proposed,
          evaluation: evalData,
        }),
      });
    } catch (err) {
      console.warn('Execution fetch warning:', err);
    }

    setExecutorStatusText('✓ EXECUTION COMPLETED');
    setEvaluation((prev) => (prev ? { ...prev, executionStatus: 'Executed' } : null));

    if (recordId) {
      setCommandHistory((prev) =>
        prev.map((r) =>
          r.id === recordId
            ? {
                ...r,
                executionStatus: 'Executed',
                evaluation: r.evaluation
                  ? { ...r.evaluation, executionStatus: 'Executed' }
                  : null,
              }
            : r
        )
      );
    }

    // Audit log
    const newEvent: AuditEvent = {
      id: `soc-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString(),
      agent: 'Worker #01',
      action: proposed.action,
      tool: proposed.tool,
      target: proposed.target,
      destination: proposed.destination,
      riskScore: evalData.riskScore,
      riskLevel: evalData.riskLevel,
      decision: 'ALLOW',
      execution: 'Executed',
      reason: evalData.deterministicPolicy.detail,
    };
    setAuditEvents((prev) => [newEvent, ...prev]);

    setPlan((prev) =>
      prev.map((s, idx) => (idx === stepIdx ? { ...s, status: 'completed' } : s))
    );

    await new Promise((r) => setTimeout(r, 900));
    advanceNextStep(stepIdx + 1, recordId);
  };

  const advanceNextStep = (nextIdx: number, recordId?: string) => {
    if (nextIdx < plan.length) {
      evaluateAndExecuteStep(plan[nextIdx], nextIdx, plan.length, activeTask || '', recordId);
    } else {
      setAgentState('COMPLETED');
      setGuardianStage('MONITORING');
      setDetailedStage('COMPLETED');
      setExecutorStatusText('Task completed. All actions evaluated by Guardian.');
      setExecutorLocked(true);

      // If running demo, advance to next demo scenario
      if (isDemoRunning) {
        const t = setTimeout(() => {
          handleNextDemoScenario();
        }, 3500);
        demoTimeoutsRef.current.push(t);
      }
    }
  };

  // Submit a task (from Command Console, Voice, or Demo)
  const handleRunTask = async (taskText: string, source: 'typed' | 'voice' | 'preset' = 'typed') => {
    clearDemoTimeouts();
    setBackendError(null);
    setActiveTask(taskText);
    setActiveCommandSource(source);
    setCurrentStepIndex(0);
    setPlan([]);
    setActiveAction(null);
    setEvaluation(null);
    setExecutorStatusText('Worker Agent receiving task directive...');
    setExecutorLocked(true);

    // 1. Worker Agent receives command
    setAgentState('RECEIVING_TASK');
    setGuardianStage('MONITORING');
    setDetailedStage('RECEIVING_COMMAND');

    const newRecordId = `cmd-${Date.now()}`;
    const newRecord: CommandRecord = {
      id: newRecordId,
      commandNumber: commandHistory.length + 1,
      commandText: taskText,
      timestamp: new Date().toLocaleTimeString(),
      plan: [],
      evaluation: null,
      activeAction: null,
      decision: 'PROCESSING',
      executionStatus: 'Pending',
      source,
    };
    setActiveRecordId(newRecordId);
    setCommandHistory((prev) => [newRecord, ...prev]);

    // AUTOMATIC SCROLL: Smoothly scroll toward live analysis section
    requestAnimationFrame(() => {
      pipelineSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    });

    // 2. Planning task
    setTimeout(async () => {
      setDetailedStage('PLANNING_TASK');
      setAgentState('PLANNING');

      try {
        const res = await fetch('/api/guardian/plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ task: taskText }),
        });
        if (!res.ok) {
          throw new Error(`Server returned status ${res.status}`);
        }
        const data = await res.json();
        const steps: PlanStep[] = data.steps || [];
        setPlan(steps);

        setCommandHistory((prev) =>
          prev.map((r) => (r.id === newRecordId ? { ...r, plan: steps } : r))
        );

        setTimeout(() => {
          if (steps.length > 0) {
            evaluateAndExecuteStep(steps[0], 0, steps.length, taskText, newRecordId);
          } else {
            setDetailedStage('COMPLETED');
            setAgentState('COMPLETED');
          }
        }, 700);
      } catch (err: any) {
        console.error('Plan generation error:', err);
        setDetailedStage('ERROR');
        setAgentState('ACTION_REVIEW');
        setBackendError('The Guardian could not reach its reasoning service. The action was not executed.');
        setCommandHistory((prev) =>
          prev.map((r) =>
            r.id === newRecordId
              ? {
                  ...r,
                  decision: 'ERROR',
                  executionStatus: 'Error',
                  errorMessage: 'The Guardian could not reach its reasoning service. The action was not executed.',
                }
              : r
          )
        );
        setTimeout(() => {
          resultSectionRef.current?.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }, 120);
      }
    }, 700);
  };

  const handleSelectHistoryRecord = (rec: CommandRecord) => {
    setActiveRecordId(rec.id);
    setActiveTask(rec.commandText);
    setActiveCommandSource(rec.source || 'typed');
    setPlan(rec.plan);
    setEvaluation(rec.evaluation);
    setActiveAction(rec.activeAction);
    setBackendError(rec.errorMessage || null);
    setTimeout(() => {
      resultSectionRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  };

  // Demo Mode flow
  const handleStartDemo = () => {
    setIsDemoRunning(true);
    setDemoScenarioIndex(0);
    setDemoPaused(false);
    runDemoScenario(0);
  };

  const runDemoScenario = (index: number) => {
    if (index >= demoScenarios.length) {
      setIsDemoRunning(false);
      return;
    }
    setDemoScenarioIndex(index);
    handleRunTask(demoScenarios[index].task);
  };

  const handleNextDemoScenario = () => {
    const nextIdx = demoScenarioIndex + 1;
    if (nextIdx < demoScenarios.length) {
      runDemoScenario(nextIdx);
    } else {
      setIsDemoRunning(false);
    }
  };

  const handleStopDemo = () => {
    clearDemoTimeouts();
    setIsDemoRunning(false);
    resetSystem();
  };

  const handleToggleCapability = (id: string) => {
    setCapabilities((prev) =>
      prev.map((c) => (c.id === id ? { ...c, enabled: !c.enabled } : c))
    );
  };

  const handleLaunchDemoFromLanding = () => {
    setOperatorEmail('demo-evaluator@aiguardian.sec');
    setIsAuthenticated(true);
    setCurrentView('initializing');
    setTimeout(() => {
      handleStartDemo();
    }, 2200);
  };

  // 1. Landing View
  if (currentView === 'landing') {
    return (
      <LandingPage
        onGetStarted={() => setCurrentView('signup')}
        onSignIn={() => setCurrentView('login')}
        onDirectDemo={handleLaunchDemoFromLanding}
      />
    );
  }

  // 2. Login View
  if (currentView === 'login') {
    return (
      <LoginPage
        onSuccess={(email) => {
          setOperatorEmail(email);
          setIsAuthenticated(true);
          setCurrentView('initializing');
        }}
        onNavigateSignUp={() => setCurrentView('signup')}
        onNavigateHome={() => setCurrentView('landing')}
      />
    );
  }

  // 3. Sign Up View
  if (currentView === 'signup') {
    return (
      <SignUpPage
        onSuccess={(email) => {
          setOperatorEmail(email);
          setIsAuthenticated(true);
          setCurrentView('initializing');
        }}
        onNavigateLogin={() => setCurrentView('login')}
        onNavigateHome={() => setCurrentView('landing')}
      />
    );
  }

  // 4. Initializing Screen
  if (currentView === 'initializing') {
    return (
      <InitializingScreen
        userEmail={operatorEmail}
        onComplete={() => setCurrentView('dashboard')}
      />
    );
  }

  // 5. Dashboard View (AI Guardian Control Center)
  return (
    <div className="min-h-screen bg-[#07090d] text-slate-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Header */}
      <Header
        systemOnline={systemOnline}
        componentsActive={3}
        isDemoRunning={isDemoRunning}
        onToggleDemo={isDemoRunning ? handleStopDemo : handleStartDemo}
        onReset={resetSystem}
        failSafeSimulate={failSafeSimulate}
        onToggleFailSafe={() => setFailSafeSimulate((prev) => !prev)}
        latencyMs={latencyMs}
        geminiReady={geminiReady}
        onNavigateLanding={() => setCurrentView('landing')}
        userEmail={operatorEmail}
        onSignOut={() => {
          setIsAuthenticated(false);
          setCurrentView('landing');
        }}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 lg:px-8 py-5 flex flex-col gap-5">
        {/* Fail Safe Simulated Banner if active */}
        {failSafeSimulate && (
          <div className="p-3 rounded-lg bg-amber-950/40 border border-amber-500/60 text-amber-200 text-xs font-mono flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-400 animate-bounce" />
              <span>
                <strong>SIMULATED FAIL-SAFE ACTIVE:</strong> Gemini Reasoning link severed. Actions will default to: <strong>REVIEW (Paused)</strong>. Uncertain actions are never executed.
              </span>
            </div>
            <button
              onClick={() => setFailSafeSimulate(false)}
              className="text-xs text-amber-300 underline font-bold cursor-pointer"
            >
              Restore Normal Mode
            </button>
          </div>
        )}

        {/* Cinematic Demo Controller Banner if demo active */}
        {isDemoRunning && (
          <DemoModeController
            currentScenarioIndex={demoScenarioIndex}
            totalScenarios={demoScenarios.length}
            isPaused={demoPaused}
            onTogglePause={() => setDemoPaused((prev) => !prev)}
            onNextScenario={handleNextDemoScenario}
            onStopDemo={handleStopDemo}
            scenarioTitle={demoScenarios[demoScenarioIndex].title}
            scenarioNarration={demoScenarios[demoScenarioIndex].narration}
          />
        )}

        {/* Task Command Console (Operator Directive Injection) */}
        <TaskCommandConsole
          onRunTask={handleRunTask}
          isRunning={agentState === 'PLANNING' || agentState === 'RECEIVING_TASK'}
          agentState={agentState}
        />

        {/* Live Analysis Pipeline Section (Auto-scroll Target on Run Task) */}
        <div ref={pipelineSectionRef} className="scroll-mt-4 flex flex-col gap-4">
          {/* Compact Voice Command Processing Status Banner (Requirement 9) */}
          {activeCommandSource === 'voice' && activeTask && detailedStage !== 'IDLE' && (
            <div
              id="voice-processing-status-banner"
              className="bg-[#091122] border-2 border-cyan-500/70 rounded-xl p-4 shadow-[0_0_25px_rgba(6,182,212,0.25)] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left font-mono animate-in fade-in duration-200"
            >
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-cyan-950 border border-cyan-400 flex items-center justify-center text-cyan-300 flex-shrink-0">
                  <Mic className="w-4 h-4 text-cyan-400 animate-pulse" />
                </div>
                <div>
                  <div className="text-[10px] tracking-wider text-cyan-400 font-bold uppercase flex items-center gap-1.5">
                    <span>VOICE COMMAND DIRECTIVE</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                  </div>
                  <div className="text-sm font-bold text-white tracking-wide mt-0.5 max-w-xl truncate" title={activeTask}>
                    "{activeTask}"
                  </div>
                </div>
              </div>

              {/* Compact Status Badges */}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <div className="px-2.5 py-1 rounded bg-[#060a12] border border-cyan-900/80 flex items-center gap-1.5">
                  <span className="text-slate-400 text-[10px]">Worker Agent</span>
                  <span className="text-cyan-300 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    {agentState === 'COMPLETED' || agentState === 'ACTION_ALLOWED' || agentState === 'ACTION_REVIEW' || agentState === 'ACTION_BLOCKED' ? 'Processed' : 'Processing'}
                  </span>
                </div>

                <div className="px-2.5 py-1 rounded bg-[#060a12] border border-cyan-900/80 flex items-center gap-1.5">
                  <span className="text-slate-400 text-[10px]">Guardian</span>
                  <span className="text-cyan-300 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    {evaluation ? 'Analyzed' : 'Analyzing'}
                  </span>
                </div>

                <div className="px-2.5 py-1 rounded bg-[#060a12] border border-cyan-900/80 flex items-center gap-1.5">
                  <span className="text-slate-400 text-[10px]">Decision</span>
                  {evaluation ? (
                    <span
                      className={`font-bold px-1.5 py-0.5 rounded text-[10px] ${
                        evaluation.decision === 'ALLOW'
                          ? 'bg-emerald-950 text-emerald-300 border border-emerald-500'
                          : evaluation.decision === 'REVIEW'
                          ? 'bg-amber-950 text-amber-300 border border-amber-500'
                          : 'bg-rose-950 text-rose-300 border border-rose-500'
                      }`}
                    >
                      {evaluation.decision}
                    </span>
                  ) : (
                    <span className="text-slate-400 font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
                      Pending
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Live Progress Stage Tracker */}
          <LiveProcessingTracker currentStage={detailedStage} commandSource={activeCommandSource} />

          {/* Central Live Agent Pipeline */}
          <AgentPipeline
            agentState={agentState}
            guardianStage={guardianStage}
            activeTask={activeTask}
            plan={plan}
            currentStepIndex={currentStepIndex}
            activeAction={activeAction}
            evaluation={evaluation}
            executorStatusText={executorStatusText}
            executorLocked={executorLocked}
            onOpenInterceptionDetail={() => setIsInterceptionModalOpen(true)}
          />

          {/* Interactive Interception Card (Prominent display when action proposed) */}
          {activeAction && guardianStage !== 'MONITORING' && (
            <InterceptionOverlay
              action={activeAction}
              evaluation={evaluation}
              guardianStage={guardianStage}
              onHumanDecision={handleHumanDecision}
            />
          )}
        </div>

        {/* Final Result Section (Dedicated Auto-scroll Target on Final Decision) */}
        <div ref={resultSectionRef} className="scroll-mt-4">
          <FinalResultCard
            evaluation={evaluation}
            action={activeAction}
            errorMessage={backendError}
            onHumanDecision={handleHumanDecision}
            commandText={activeTask}
          />
        </div>

        {/* Operational Command Audit Trail History */}
        <CommandHistoryList
          history={commandHistory}
          activeRecordId={activeRecordId}
          onSelectRecord={handleSelectHistoryRecord}
        />

        {/* Live SOC Activity Stream */}
        <LiveActivityStream
          events={auditEvents}
          onSelectEvent={(ev) => setSelectedAuditEvent(ev)}
        />

        {/* Capability Matrix Quick Trigger Bar */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-[#0c1018] border border-cyan-950 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-cyan-400" />
            <span>ENFORCEMENT CONFIGURATION:</span>
            <span className="text-slate-300">5 Deterministic Rules Active</span>
            <span className="text-slate-600">|</span>
            <span className="text-cyan-300">Gemini Intent Guard: Online</span>
          </div>

          <button
            onClick={() => setIsCapabilityModalOpen(true)}
            className="px-3 py-1 rounded bg-[#141a29] border border-slate-700 hover:border-cyan-500 text-cyan-300 transition-colors cursor-pointer"
          >
            Manage Capabilities &amp; Policies
          </button>
        </div>
      </main>

      {/* Forensic Audit Event Modal */}
      <AuditEventModal
        event={selectedAuditEvent}
        onClose={() => setSelectedAuditEvent(null)}
      />

      {/* Capability & Policy Modal */}
      <CapabilityModal
        isOpen={isCapabilityModalOpen}
        onClose={() => setIsCapabilityModalOpen(false)}
        capabilities={capabilities}
        onToggleCapability={handleToggleCapability}
      />

      {/* Modal view of Interception if clicked from Central Panel */}
      {isInterceptionModalOpen && activeAction && (
        <InterceptionOverlay
          action={activeAction}
          evaluation={evaluation}
          guardianStage={guardianStage}
          onHumanDecision={handleHumanDecision}
          onClose={() => setIsInterceptionModalOpen(false)}
          isModal={true}
        />
      )}
    </div>
  );
}
