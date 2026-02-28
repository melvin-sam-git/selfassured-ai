import { AuditData } from '@/types/audit';
import { CheckCircle, XCircle } from 'lucide-react';

interface AuditPanelProps {
  auditData: AuditData;
}

export function AuditPanel({ auditData }: AuditPanelProps) {
  return (
    <div className="space-y-4 text-sm">
      {/* Module 1: Initial Response */}
      <section>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
          Module 1 — Initial Draft (R₀)
        </h4>
        <div className="border border-border rounded p-2 text-xs font-mono bg-background max-h-24 overflow-y-auto">
          {auditData.initialResponse}
        </div>
      </section>

      {/* Module 2: Agent Results Table */}
      <section>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
          Module 2 — Multi-Agent Audit Results
        </h4>
        <table className="w-full text-xs border border-border rounded">
          <thead>
            <tr className="bg-muted text-muted-foreground">
              <th className="text-left p-2 font-medium border-b border-border">Agent</th>
              <th className="text-center p-2 font-medium border-b border-border">Pass</th>
              <th className="text-right p-2 font-medium border-b border-border">Score</th>
            </tr>
          </thead>
          <tbody>
            {auditData.agents.map((agent, i) => (
              <tr key={i} className="border-b border-border last:border-0">
                <td className="p-2 font-mono">{agent.name}</td>
                <td className="p-2 text-center">
                  {agent.passed ? (
                    <CheckCircle className="w-3.5 h-3.5 text-success inline-block" />
                  ) : (
                    <XCircle className="w-3.5 h-3.5 text-destructive inline-block" />
                  )}
                </td>
                <td className="p-2 text-right font-mono">{(agent.score * 100).toFixed(1)}%</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Critiques */}
        <div className="mt-2 space-y-2">
          {auditData.agents.map((agent, i) => (
            <div key={i} className="border border-border rounded p-2">
              <p className="text-[10px] font-semibold text-muted-foreground uppercase">{agent.name}</p>
              <p className="text-xs text-foreground mt-0.5">{agent.critique}</p>
              {agent.details.length > 0 && (
                <ul className="mt-1 space-y-0.5">
                  {agent.details.map((d, j) => (
                    <li key={j} className="text-[11px] text-muted-foreground">— {d}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Module 4: Iterations */}
      <section>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
          Module 4 — Correction Iterations
        </h4>
        <div className="flex gap-1 font-mono text-xs">
          {auditData.iterations.map((iter, i) => (
            <div
              key={i}
              className={`px-2 py-1 border rounded text-center ${
                i === auditData.iterations.length - 1
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border'
              }`}
            >
              <div>R{i}</div>
              <div className="text-[10px]">{(iter.confidence * 100).toFixed(0)}%</div>
            </div>
          ))}
        </div>
      </section>

      {/* Module 5: Final Validation */}
      <section>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
          Module 5 — Final Validation
        </h4>
        <div className={`border rounded p-2 flex justify-between items-center text-xs ${
          auditData.passedThreshold ? 'border-success/40 bg-success/5' : 'border-destructive/40 bg-destructive/5'
        }`}>
          <div>
            <span className="text-muted-foreground">Threshold τ = </span>
            <span className="font-mono">{(auditData.threshold * 100).toFixed(0)}%</span>
          </div>
          <div className="font-mono font-semibold">
            {(auditData.finalConfidence * 100).toFixed(1)}%
            <span className="ml-1 text-[10px]">
              {auditData.passedThreshold ? '✓ PASS' : '✗ FAIL'}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
