import { AuditData } from '@/types/audit';

interface ConfidenceWeightingProps {
  auditData: AuditData;
}

export function ConfidenceWeighting({ auditData }: ConfidenceWeightingProps) {
  const { agents, aggregateConfidence, threshold, passedThreshold } = auditData;

  const weightedDecisions = agents.map(agent => {
    const cValue = agent.passed ? 1 : 0.5;
    return agent.score * cValue;
  });

  const decisionVector = weightedDecisions.reduce((a, b) => a + b, 0);

  return (
    <div className="space-y-4 text-sm">
      {/* Formulas */}
      <section className="border border-border rounded p-3 bg-background font-mono text-xs space-y-3">
        <div>
          <p className="text-muted-foreground mb-1">Decision Vector:</p>
          <p>D = Σ sᵢ · Cᵢ = {agents.map((a, i) =>
            `${a.score.toFixed(2)}×${a.passed ? '1' : '0.5'}`
          ).join(' + ')} = <span className="font-semibold text-primary">{decisionVector.toFixed(3)}</span></p>
        </div>
        <div className="border-t border-border pt-2">
          <p className="text-muted-foreground mb-1">Aggregate Confidence:</p>
          <p>S = Σ sᵢ = {agents.map(a => a.score.toFixed(2)).join(' + ')} = <span className="font-semibold text-primary">{aggregateConfidence.toFixed(3)}</span></p>
        </div>
      </section>

      {/* Agent Weights — simple bars */}
      <section>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Agent Contribution Weights
        </h4>
        <div className="space-y-2">
          {agents.map((agent, i) => {
            const maxW = Math.max(...weightedDecisions);
            const pct = maxW > 0 ? (weightedDecisions[i] / maxW) * 100 : 0;
            return (
              <div key={i}>
                <div className="flex justify-between text-xs mb-0.5">
                  <span className="font-mono">{agent.name}</span>
                  <span className="font-mono text-muted-foreground">
                    {agent.score.toFixed(2)} × {agent.passed ? '1.0' : '0.5'} = {weightedDecisions[i].toFixed(3)}
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-sm"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Threshold */}
      <section>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
          Threshold Check
        </h4>
        <div className={`border rounded p-2 text-xs font-mono ${
          passedThreshold ? 'border-success/40 bg-success/5' : 'border-warning/40 bg-warning/5'
        }`}>
          <p>S = {aggregateConfidence.toFixed(3)} {passedThreshold ? '≥' : '<'} τ = {threshold.toFixed(3)}</p>
          <p className={`mt-1 font-semibold ${passedThreshold ? 'text-success' : 'text-warning'}`}>
            {passedThreshold ? 'Safe for release' : 'Additional auditing required'}
          </p>
        </div>
      </section>

      {/* Confidence bar with threshold marker */}
      <section>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
          Confidence vs Threshold
        </h4>
        <div className="relative w-full h-4 bg-muted rounded-sm overflow-visible">
          <div
            className={`h-full rounded-sm ${passedThreshold ? 'bg-success' : 'bg-warning'}`}
            style={{ width: `${Math.min(aggregateConfidence * 100, 100)}%` }}
          />
          {/* Threshold marker */}
          <div
            className="absolute top-0 h-full w-px bg-destructive"
            style={{ left: `${threshold * 100}%` }}
          />
          <div
            className="absolute -top-4 text-[9px] font-mono text-destructive"
            style={{ left: `${threshold * 100}%`, transform: 'translateX(-50%)' }}
          >
            τ={threshold}
          </div>
        </div>
        <div className="flex justify-between text-[10px] text-muted-foreground mt-0.5 font-mono">
          <span>0</span>
          <span>{(aggregateConfidence * 100).toFixed(1)}%</span>
          <span>100</span>
        </div>
      </section>
    </div>
  );
}
