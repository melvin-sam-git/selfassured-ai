import { AuditData } from '@/types/audit';
import { Scale, AlertTriangle } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface ConfidenceWeightingProps {
  auditData: AuditData;
}

export function ConfidenceWeighting({ auditData }: ConfidenceWeightingProps) {
  const { agents, aggregateConfidence, threshold, passedThreshold } = auditData;

  // Calculate D = Σsᵢ·Cᵢ (where Cᵢ is represented as 1 for pass, 0.5 for partial, 0 for fail)
  const weightedDecisions = agents.map(agent => {
    const cValue = agent.passed ? 1 : 0.5;
    return agent.score * cValue;
  });

  const decisionVector = weightedDecisions.reduce((a, b) => a + b, 0);

  return (
    <div className="glass-card rounded-xl p-6 space-y-6 animate-fade-in">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-agent-confidence/20 flex items-center justify-center">
          <Scale className="w-5 h-5 text-agent-confidence" />
        </div>
        <div>
          <h3 className="font-semibold">Confidence-Weighted Arbitration</h3>
          <p className="text-xs text-muted-foreground">
            Instead of treating all auditors equally, critiques are weighted by confidence
          </p>
        </div>
      </div>

      {/* Formula Explanation */}
      <div className="bg-secondary/50 rounded-lg p-4 font-mono text-sm space-y-4">
        <div className="space-y-2">
          <p className="text-primary font-semibold">Reliability Decision Vector:</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-lg">D = Σ sᵢ · Cᵢ</span>
            <span className="text-muted-foreground">=</span>
            {agents.map((agent, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-muted-foreground">+</span>}
                <span className="text-primary">{agent.score.toFixed(2)}</span>
                <span className="text-muted-foreground">×</span>
                <span className={agent.passed ? 'text-success' : 'text-warning'}>
                  {agent.passed ? '1' : '0.5'}
                </span>
              </span>
            ))}
          </div>
          <p className="text-lg text-primary">
            D = {decisionVector.toFixed(3)}
          </p>
        </div>

        <div className="border-t border-border pt-4 space-y-2">
          <p className="text-primary font-semibold">Aggregate Confidence Score:</p>
          <div className="flex items-center gap-2">
            <span className="text-lg">S = Σ sᵢ</span>
            <span className="text-muted-foreground">=</span>
            {agents.map((agent, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <span className="text-muted-foreground">+</span>}
                <span className="text-primary">{agent.score.toFixed(2)}</span>
              </span>
            ))}
          </div>
          <p className="text-lg text-primary">
            S = {aggregateConfidence.toFixed(3)}
          </p>
        </div>
      </div>

      {/* Individual Agent Weights */}
      <div className="space-y-4">
        <h4 className="font-medium text-sm">Agent Contribution Weights</h4>
        {agents.map((agent, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{agent.name}</span>
              <span className="font-mono">
                {agent.score.toFixed(2)} × {agent.passed ? '1.0' : '0.5'} = {weightedDecisions[index].toFixed(3)}
              </span>
            </div>
            <Progress 
              value={(weightedDecisions[index] / Math.max(...weightedDecisions)) * 100} 
              className="h-2"
            />
          </div>
        ))}
      </div>

      {/* Threshold Check */}
      <div className={`p-4 rounded-lg border ${
        passedThreshold 
          ? 'border-success/30 bg-success/5' 
          : 'border-warning/30 bg-warning/5'
      }`}>
        <div className="flex items-center gap-3">
          {!passedThreshold && <AlertTriangle className="w-5 h-5 text-warning" />}
          <div>
            <p className="font-medium text-sm">Confidence Threshold Trigger</p>
            <p className="text-xs text-muted-foreground font-mono">
              If S &lt; τ → Trigger deeper auditing rounds
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm">
            S = {aggregateConfidence.toFixed(3)} {passedThreshold ? '≥' : '<'} τ = {threshold.toFixed(3)}
          </span>
          <span className={`text-sm font-semibold ${passedThreshold ? 'text-success' : 'text-warning'}`}>
            {passedThreshold ? 'Safe for release' : 'Additional auditing required'}
          </span>
        </div>
      </div>

      {/* Key Innovation Note */}
      <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
        <p className="text-sm font-medium text-primary">Key Innovation</p>
        <p className="text-xs text-muted-foreground mt-1">
          Confidence-weighted arbitration prevents weak agents from dominating decisions. 
          This ensures that only high-confidence audits significantly influence the final output, 
          reducing the impact of uncertain or unreliable assessments.
        </p>
      </div>
    </div>
  );
}
