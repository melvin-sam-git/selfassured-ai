import { AuditData } from '@/types/audit';

interface OutcomesPanelProps {
  auditData: AuditData;
}

export function OutcomesPanel({ auditData }: OutcomesPanelProps) {
  const { outcomes, iterations } = auditData;

  const metrics = [
    { label: 'Hallucination Reduction', value: outcomes.hallucinationReduction, color: 'bg-agent-fact' },
    { label: 'Factual Accuracy', value: outcomes.factualAccuracyImprovement, color: 'bg-agent-fact' },
    { label: 'Logical Coherence', value: outcomes.logicalCoherenceGain, color: 'bg-agent-reasoning' },
    { label: 'Safety Compliance', value: outcomes.policySafetyCompliance, color: 'bg-agent-safety' },
    { label: 'Overall Trustworthiness', value: outcomes.overallTrustworthiness, color: 'bg-primary' },
    { label: 'Correction Success', value: outcomes.correctionSuccessRate, color: 'bg-agent-confidence' },
  ];

  return (
    <div className="space-y-5 text-sm">
      {/* R₀ vs Rᶠ comparison */}
      <section className="grid grid-cols-2 gap-3">
        <div className="border border-border rounded-md p-3 bg-muted/30">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Initial (R₀)</p>
          <p className="text-2xl font-mono font-semibold text-foreground">
            {(iterations[0]?.confidence * 100 || 0).toFixed(0)}%
          </p>
        </div>
        <div className="border border-success/30 rounded-md p-3 bg-success/[0.04]">
          <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium mb-1">Final (Rᶠ)</p>
          <p className="text-2xl font-mono font-semibold text-success">
            {(auditData.finalConfidence * 100).toFixed(0)}%
          </p>
        </div>
      </section>

      {/* Metric bars with functional colors */}
      <section>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Evaluation Metrics
        </h4>
        <div className="space-y-3">
          {metrics.map((m, i) => (
            <div key={i}>
              <div className="flex justify-between text-xs mb-1">
                <span className="font-medium text-foreground">{m.label}</span>
                <span className="font-mono text-muted-foreground">{(m.value * 100).toFixed(1)}%</span>
              </div>
              <div className="w-full h-2 bg-muted rounded-sm overflow-hidden">
                <div className={`h-full rounded-sm ${m.color}/60`} style={{ width: `${m.value * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Metrics table */}
      <section>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Summary Table
        </h4>
        <div className="border border-border rounded-md overflow-hidden">
          <table className="w-full text-xs">
            <thead>
              <tr className="bg-muted/50 text-muted-foreground">
                <th className="text-left px-3 py-2 font-medium border-b border-border">Metric</th>
                <th className="text-right px-3 py-2 font-medium border-b border-border">Value</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((m, i) => (
                <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20">
                  <td className="px-3 py-2 text-foreground">{m.label}</td>
                  <td className="px-3 py-2 text-right font-mono font-semibold text-foreground">
                    {(m.value * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Iterations */}
      <section>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Correction Iterations
        </h4>
        <div className="flex gap-2 font-mono text-xs">
          {iterations.map((iter, i) => (
            <div
              key={i}
              className={`flex-1 rounded-md py-2 flex flex-col items-center ${
                i === iterations.length - 1
                  ? 'bg-primary/10 text-primary font-semibold border border-primary/30'
                  : 'bg-muted/50 text-muted-foreground border border-border'
              }`}
            >
              <span className="text-[10px]">R{i}</span>
              <span>{(iter.confidence * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
        <p className="text-[11px] text-muted-foreground mt-1.5">
          {iterations.length} iteration{iterations.length > 1 ? 's' : ''} to reach threshold
        </p>
      </section>
    </div>
  );
}
