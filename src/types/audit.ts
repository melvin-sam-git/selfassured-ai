export interface AgentAudit {
  agentType: 'fact-checking' | 'bias-safety' | 'reasoning' | 'confidence';
  name: string;
  role: string;
  critique: string;
  score: number; // 0-1 confidence score
  passed: boolean;
  details: string[];
}

export interface AuditData {
  // Module 1: Initial Response
  initialResponse: string;
  
  // Module 2: Multi-Agent Audits
  agents: AgentAudit[];
  
  // Module 3: Confidence Weighted Arbitration
  confidenceVector: number[];
  aggregateConfidence: number;
  threshold: number;
  passedThreshold: boolean;
  
  // Module 4: Iterative Corrections
  iterations: {
    iteration: number;
    response: string;
    confidence: number;
  }[];
  
  // Module 5: Final Validation
  finalResponse: string;
  finalConfidence: number;
  
  // Outcomes
  outcomes: {
    hallucinationReduction: number;
    factualAccuracyImprovement: number;
    logicalCoherenceGain: number;
    policySafetyCompliance: number;
    overallTrustworthiness: number;
    correctionSuccessRate: number;
  };
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  auditData?: AuditData;
  timestamp: Date;
  isStreaming?: boolean;
}
