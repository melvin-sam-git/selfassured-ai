import { AuditData } from '@/types/audit';
import { Search, Shield, Brain, Activity, ArrowRight, CheckCircle, XCircle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AuditPanelProps {
  auditData: AuditData;
}

const agentIcons = {
  'fact-checking': Search,
  'bias-safety': Shield,
  'reasoning': Brain,
  'confidence': Activity,
};

const agentColors = {
  'fact-checking': 'agent-fact',
  'bias-safety': 'agent-bias',
  'reasoning': 'agent-reasoning',
  'confidence': 'agent-confidence',
};

export function AuditPanel({ auditData }: AuditPanelProps) {
  return (
    <div className="glass-card rounded-xl p-6 space-y-6 animate-fade-in">
      {/* Audit Flow Visualization */}
      <div className="flex items-center justify-between text-xs font-mono">
        {['Prompt', 'Draft', 'Audit', 'Fix', 'Verify', 'Final'].map((step, index) => (
          <div key={step} className="flex items-center">
            <div className={`px-3 py-1.5 rounded-lg ${
              index === 5 ? 'gradient-primary text-primary-foreground' : 'bg-secondary'
            }`}>
              {step}
            </div>
            {index < 5 && <ArrowRight className="w-4 h-4 mx-2 text-muted-foreground" />}
          </div>
        ))}
      </div>

      {/* Module 1: Initial Response */}
      <div className="space-y-2">
        <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-xs">1</span>
          Initial Response Generation
        </h4>
        <p className="text-xs text-muted-foreground font-mono">
          R₀ = LLM(Q) — Draft hypothesis generated
        </p>
        <div className="bg-secondary/50 rounded-lg p-3 text-sm max-h-32 overflow-y-auto">
          {auditData.initialResponse}
        </div>
      </div>

      {/* Module 2: Multi-Agent Auditing */}
      <div className="space-y-4">
        <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-xs">2</span>
          Multi-Agent Auditing Layer
        </h4>
        <p className="text-xs text-muted-foreground font-mono">
          Aᵢ = (Cᵢ, sᵢ) where Cᵢ = critique, sᵢ ∈ [0,1] = confidence
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {auditData.agents.map((agent, index) => {
            const Icon = agentIcons[agent.agentType];
            const colorClass = agentColors[agent.agentType];

            return (
              <div 
                key={index}
                className="border border-border rounded-lg p-4 space-y-3"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-lg bg-${colorClass}/20 flex items-center justify-center`}>
                      <Icon className={`w-4 h-4 text-${colorClass}`} />
                    </div>
                    <div>
                      <h5 className="font-medium text-sm">{agent.name}</h5>
                      <p className="text-xs text-muted-foreground">{agent.role}</p>
                    </div>
                  </div>
                  {agent.passed ? (
                    <CheckCircle className="w-5 h-5 text-success" />
                  ) : (
                    <XCircle className="w-5 h-5 text-destructive" />
                  )}
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span>Confidence Score (sᵢ)</span>
                    <span className="font-mono">{(agent.score * 100).toFixed(1)}%</span>
                  </div>
                  <Progress value={agent.score * 100} className="h-2" />
                </div>

                <p className="text-xs text-muted-foreground">{agent.critique}</p>

                <div className="space-y-1">
                  {agent.details.map((detail, i) => (
                    <p key={i} className="text-xs flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {detail}
                    </p>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Module 4: Iterative Corrections */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-xs">4</span>
          Iterative Correction Engine
        </h4>
        <p className="text-xs text-muted-foreground font-mono">
          R₁ = LLM(Q, R₀, D) → R₀ → R₁ → R₂ → ... → Rᶠ
        </p>

        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {auditData.iterations.map((iter, index) => (
            <div key={index} className="flex items-center">
              <div className={`px-3 py-2 rounded-lg ${
                index === auditData.iterations.length - 1 
                  ? 'gradient-primary text-primary-foreground' 
                  : 'bg-secondary'
              } flex-shrink-0`}>
                <div className="text-xs font-mono">R{index}</div>
                <div className="text-xs opacity-70">{(iter.confidence * 100).toFixed(0)}%</div>
              </div>
              {index < auditData.iterations.length - 1 && (
                <ArrowRight className="w-4 h-4 mx-2 text-muted-foreground flex-shrink-0" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Module 5: Final Validation */}
      <div className="space-y-3">
        <h4 className="text-sm font-semibold text-primary flex items-center gap-2">
          <span className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center text-xs">5</span>
          Final Validation
        </h4>
        <p className="text-xs text-muted-foreground font-mono">
          Confidence(Rᶠ) ≥ τ → Release to user
        </p>

        <div className="flex items-center justify-between p-4 rounded-lg border border-success/30 bg-success/5">
          <div>
            <p className="text-sm font-medium">Final Confidence Score</p>
            <p className="text-xs text-muted-foreground">
              Threshold τ = {(auditData.threshold * 100).toFixed(0)}%
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-success">
              {(auditData.finalConfidence * 100).toFixed(1)}%
            </p>
            <p className="text-xs text-success">
              {auditData.passedThreshold ? '✓ Passed' : '✗ Failed'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
