import { AuditData } from '@/types/audit';

interface OutcomesPanelProps {
  auditData: AuditData;
}

export function OutcomesPanel({ auditData }: OutcomesPanelProps) {
  const { outcomes, iterations } = auditData;

  const metrics = [
    { label: 'Hallucination Reduction', value: outcomes.hallucinationReduction, formula: '(R₀_h − Rᶠ_h) / R₀_h' },
    { label: 'Factual Accuracy Improvement', value: outcomes.factualAccuracyImprovement, formula: '(Rᶠ_facts − R₀_facts) / total' },
    { label: 'Logical Coherence Gain', value: outcomes.logicalCoherenceGain, formula: 'Σ(reasoning_scores) / max' },
    { label: 'Safety Compliance', value: outcomes.policySafetyCompliance, formula: 'bias_agent.score × policy' },
    { label: 'Overall Trustworthiness', value: outcomes.overallTrustworthiness, formula: 'Σ(scores × weights) / Σ(w)' },
    { label: 'Correction Success Rate', value: outcomes.correctionSuccessRate, formula: 'resolved / identified' },
  ];

  return (
    <div className="space-y-4 text-sm">
      {/* R₀ vs Rᶠ comparison */}
      <section className="grid grid-cols-2 gap-2">
        <div className="border border-border rounded p-2">
          <p className="text-[10px] text-muted-foreground uppercase">Initial (R₀)</p>
          <p className="text-lg font-mono font-semibold text-foreground">
            {(iterations[0]?.confidence * 100 || 0).toFixed(0)}%
          </p>
        </div>
        <div className="border border-border rounded p-2">
          <p className="text-[10px] text-muted-foreground uppercase">Final (Rᶠ)</p>
          <p className="text-lg font-mono font-semibold text-success">
            {(auditData.finalConfidence * 100).toFixed(0)}%
          </p>
        </div>
      </section>

      {/* Metrics table */}
      <section>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Evaluation Metrics
        </h4>
        <table className="w-full text-xs border border-border rounded">
          <thead>
            <tr className="bg-muted text-muted-foreground">
              <th className="text-left p-2 font-medium border-b border-border">Metric</th>
              <th className="text-right p-2 font-medium border-b border-border">Value</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                <td className="p-2">
                  <span className="text-foreground">{m.label}</span>
                  <br />
                  <span className="text-[10px] font-mono text-muted-foreground">{m.formula}</span>
                </td>
                <td className="p-2 text-right font-mono font-semibold text-foreground">
                  {(m.value * 100).toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Metric bars */}
      <section>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Visual Summary
        </h4>
        <div className="space-y-1.5">
          {metrics.map((m, i) => (
            <div key={i}>
              <div className="flex justify-between text-[10px] mb-0.5">
                <span className="text-muted-foreground truncate mr-2">{m.label}</span>
                <span className="font-mono text-foreground">{(m.value * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-1.5 bg-muted rounded-sm overflow-hidden">
                <div className="h-full bg-primary rounded-sm" style={{ width: `${m.value * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Iterations */}
      <section>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
          Correction Iterations
        </h4>
        <div className="flex gap-1 font-mono text-xs">
          {iterations.map((iter, i) => (
            <div
              key={i}
              className={`flex-1 h-6 rounded-sm flex items-center justify-center text-[10px] ${
                i === iterations.length - 1
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {(iter.confidence * 100).toFixed(0)}%
            </div>
          ))}
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">
          {iterations.length} iteration{iterations.length > 1 ? 's' : ''} to reach threshold
        </p>
      </section>
    </div>
  );
}
