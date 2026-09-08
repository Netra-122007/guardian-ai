export type AgentState =
  | 'IDLE'
  | 'RECEIVING_TASK'
  | 'PLANNING'
  | 'PROPOSING_ACTION'
  | 'WAITING_FOR_GUARDIAN'
  | 'ACTION_ALLOWED'
  | 'ACTION_REVIEW'
  | 'ACTION_BLOCKED'
  | 'EXECUTING'
  | 'COMPLETED';

export type GuardianStage =
  | 'MONITORING'
  | 'ACTION_DETECTED'
  | 'CAPABILITY_CHECK'
  | 'RULE_ANALYSIS'
  | 'GEMINI_REASONING'
  | 'DECISION'
  | 'ENFORCEMENT';

export type DecisionType = 'ALLOW' | 'REVIEW' | 'BLOCK';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ToolType = 'file' | 'email' | 'database' | 'calendar' | 'web';

export interface ProposedAction {
  id: string;
  tool: ToolType;
  action: string;
  target: string;
  destination: string;
  payloadSnippet?: string;
  timestamp: string;
  stepDescription?: string;
}

export interface PlanStep {
  id: string;
  title: string;
  status: 'pending' | 'active' | 'completed' | 'blocked' | 'paused';
  action?: ProposedAction;
}

export interface SensitivityCheck {
  status: 'safe' | 'warning' | 'critical';
  label: string;
  detail: string;
}

export interface DestinationCheck {
  status: 'safe' | 'warning' | 'critical';
  label: string;
  detail: string;
}

export interface AuthCheck {
  status: 'verified' | 'missing' | 'elevated';
  label: string;
  detail: string;
}

export interface CapabilityCheck {
  status: 'permitted' | 'prohibited' | 'restricted';
  label: string;
  detail: string;
}

export interface PolicyCheck {
  status: 'ALLOW' | 'FLAG' | 'BLOCK';
  ruleTriggered: string;
  detail: string;
}

export interface GeminiReasoningResult {
  intent: string;
  contextEvaluation: string;
  justification: string;
  serviceStatus: 'ONLINE' | 'UNAVAILABLE' | 'SIMULATED_FAIL';
}

export interface GuardianEvaluation {
  id: string;
  actionId: string;
  riskScore: number;
  riskLevel: RiskLevel;
  decision: DecisionType;
  dataSensitivity: SensitivityCheck;
  destinationCheck: DestinationCheck;
  authorization: AuthCheck;
  capabilityCheck: CapabilityCheck;
  deterministicPolicy: PolicyCheck;
  geminiReasoning: GeminiReasoningResult;
  executionStatus: 'Executed' | 'Paused' | 'Prevented' | 'Pending';
  timestamp: string;
  humanReviewDecision?: 'APPROVE' | 'BLOCK';
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  agent: string;
  action: string;
  tool: ToolType;
  target: string;
  destination: string;
  riskScore: number;
  riskLevel: RiskLevel;
  decision: DecisionType;
  execution: 'Executed' | 'Paused' | 'Prevented';
  reason: string;
  evaluationId?: string;
}

export interface AgentCapabilityConfig {
  id: string;
  name: string;
  tool: ToolType;
  enabled: boolean;
  prohibitedActions: string[];
  restrictedDestinations: string[];
}

export type DetailedProgressStage =
  | 'IDLE'
  | 'RECEIVING_COMMAND'
  | 'PLANNING_TASK'
  | 'ACTION_DETECTED'
  | 'CHECKING_PERMISSIONS'
  | 'ANALYZING_RISK'
  | 'REASONING_INTENT'
  | 'DETERMINING_SAFETY'
  | 'FINAL_DECISION'
  | 'COMPLETED'
  | 'ERROR';

export interface CommandRecord {
  id: string;
  commandNumber: number;
  commandText: string;
  timestamp: string;
  plan: PlanStep[];
  evaluation: GuardianEvaluation | null;
  activeAction: ProposedAction | null;
  decision: DecisionType | 'PROCESSING' | 'ERROR';
  executionStatus: 'Executed' | 'Paused' | 'Prevented' | 'Pending' | 'Error';
  errorMessage?: string;
  source?: 'typed' | 'voice' | 'preset';
}
