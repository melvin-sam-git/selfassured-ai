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
    <div className="space-y-5 text-sm">
      {/* Formulas */}
      <section className="border border-border rounded-md p-4 bg-muted/30 font-mono text-xs space-y-3 leading-relaxed">
        <div>
          <p className="text-muted-foreground mb-1 text-[11px] font-sans font-medium uppercase tracking-wider">Decision Vector</p>
          <p>D = Σ sᵢ · Cᵢ = {agents.map((a) =>
            `${a.score.toFixed(2)}×${a.passed ? '1' : '0.5'}`
          ).join(' + ')} = <span className="font-semibold text-primary">{decisionVector.toFixed(3)}</span></p>
        </div>
        <div className="border-t border-border pt-3">
          <p className="text-muted-foreground mb-1 text-[11px] font-sans font-medium uppercase tracking-wider">Aggregate Confidence</p>
          <p>S = Σ sᵢ = {agents.map(a => a.score.toFixed(2)).join(' + ')} = <span className="font-semibold text-primary">{aggregateConfidence.toFixed(3)}</span></p>
        </div>
      </section>

      {/* Agent Weights */}
      <section>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Agent Contribution Weights
        </h4>
        <div className="space-y-3">
          {agents.map((agent, i) => {
            const maxW = Math.max(...weightedDecisions);
            const pct = maxW > 0 ? (weightedDecisions[i] / maxW) * 100 : 0;
            return (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="font-medium text-foreground">{agent.name}</span>
                  <span className="font-mono text-muted-foreground">
                    {agent.score.toFixed(2)} × {agent.passed ? '1.0' : '0.5'} = {weightedDecisions[i].toFixed(3)}
                  </span>
                </div>
                <div className="w-full h-2 bg-muted rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-primary/70 rounded-sm"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Threshold Check */}
      <section>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Threshold Check
        </h4>
        <div className={`border rounded-md p-3 text-xs font-mono ${
          passedThreshold
            ? 'border-success/30 bg-success/[0.06]'
            : 'border-warning/30 bg-warning/[0.06]'
        }`}>
          <p>S = {aggregateConfidence.toFixed(3)} {passedThreshold ? '≥' : '<'} τ = {threshold.toFixed(3)}</p>
          <p className={`mt-1.5 font-semibold font-sans ${passedThreshold ? 'text-success' : 'text-warning'}`}>
            {passedThreshold ? 'Safe for release' : 'Additional auditing required'}
          </p>
        </div>
      </section>

      {/* Confidence bar with threshold marker */}
      <section>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Confidence vs Threshold
        </h4>
        <div className="relative w-full h-5 bg-muted rounded-sm overflow-visible">
          <div
            className={`h-full rounded-sm ${passedThreshold ? 'bg-success/60' : 'bg-warning/60'}`}
            style={{ width: `${Math.min(aggregateConfidence * 100, 100)}%` }}
          />
          {/* Threshold marker */}
          <div
            className="absolute top-0 h-full w-0.5 bg-destructive"
            style={{ left: `${threshold * 100}%` }}
          />
          <div
            className="absolute -top-5 text-[10px] font-mono text-destructive font-semibold"
            style={{ left: `${threshold * 100}%`, transform: 'translateX(-50%)' }}
          >
            τ={threshold}
          </div>
        </div>
        <div className="flex justify-between text-[11px] text-muted-foreground mt-1 font-mono">
          <span>0%</span>
          <span className="font-semibold text-foreground">{(aggregateConfidence * 100).toFixed(1)}%</span>
          <span>100%</span>
        </div>
      </section>
    </div>
  );
}
