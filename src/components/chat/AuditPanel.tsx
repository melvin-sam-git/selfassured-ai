import { AuditData } from '@/types/audit';

interface AuditPanelProps {
  auditData: AuditData;
}

const agentColors: Record<string, { dot: string; bg: string; text: string }> = {
  'Fact-Checking': { dot: 'bg-agent-fact', bg: 'bg-agent-fact/10', text: 'text-agent-fact' },
  'Bias & Safety': { dot: 'bg-agent-safety', bg: 'bg-agent-safety/10', text: 'text-agent-safety' },
  'Reasoning': { dot: 'bg-agent-reasoning', bg: 'bg-agent-reasoning/10', text: 'text-agent-reasoning' },
  'Confidence': { dot: 'bg-agent-confidence', bg: 'bg-agent-confidence/10', text: 'text-agent-confidence' },
};

function getAgentColor(name: string) {
  return agentColors[name] || { dot: 'bg-muted-foreground', bg: 'bg-muted', text: 'text-muted-foreground' };
}

export function AuditPanel({ auditData }: AuditPanelProps) {
  return (
    <div className="space-y-5 text-sm">
      {/* Module 1: Initial Response */}
      <section>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Module 1 — Initial Draft (R₀)
        </h4>
        <div className="border border-border rounded-md p-3 text-xs font-mono bg-muted/50 max-h-28 overflow-y-auto leading-relaxed">
          {auditData.initialResponse}
        </div>
      </section>

      {/* Module 2: Agent Results */}
      <section>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          Module 2 — Agent Audit Results
        </h4>
        <div className="space-y-3">
          {auditData.agents.map((agent, i) => {
            const color = getAgentColor(agent.name);
            return (
              <div key={i} className="border border-border rounded-md overflow-hidden">
                {/* Agent header */}
                <div className="flex items-center justify-between px-3 py-2 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full ${color.dot}`} />
                    <span className="text-xs font-semibold text-foreground">{agent.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-muted-foreground">
                      {(agent.score * 100).toFixed(1)}%
                    </span>
                    <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm ${
                      agent.passed
                        ? 'bg-success/15 text-success'
                        : 'bg-destructive/15 text-destructive'
                    }`}>
                      {agent.passed ? 'PASS' : 'FAIL'}
                    </span>
                  </div>
                </div>
                {/* Critique */}
                <div className="px-3 py-2 text-xs text-muted-foreground leading-relaxed">
                  {agent.critique}
                  {agent.details.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5 text-[11px]">
                      {agent.details.map((d, j) => (
                        <li key={j} className="text-muted-foreground/80">• {d}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Module 4: Iterations */}
      <section>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Module 4 — Correction Iterations
        </h4>
        <div className="flex gap-2 font-mono text-xs">
          {auditData.iterations.map((iter, i) => (
            <div
              key={i}
              className={`px-3 py-2 border rounded-md text-center min-w-[48px] ${
                i === auditData.iterations.length - 1
                  ? 'border-primary bg-primary/10 text-primary font-semibold'
                  : 'border-border bg-muted/30 text-muted-foreground'
              }`}
            >
              <div className="text-[10px] text-muted-foreground mb-0.5">R{i}</div>
              <div>{(iter.confidence * 100).toFixed(0)}%</div>
            </div>
          ))}
        </div>
      </section>

      {/* Module 5: Final Validation */}
      <section>
        <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
          Module 5 — Final Validation
        </h4>
        <div className={`border rounded-md p-3 flex justify-between items-center text-xs ${
          auditData.passedThreshold
            ? 'border-success/30 bg-success/[0.06]'
            : 'border-destructive/30 bg-destructive/[0.06]'
        }`}>
          <div>
            <span className="text-muted-foreground">Threshold τ = </span>
            <span className="font-mono font-medium">{(auditData.threshold * 100).toFixed(0)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono font-semibold text-foreground">
              {(auditData.finalConfidence * 100).toFixed(1)}%
            </span>
            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-sm ${
              auditData.passedThreshold
                ? 'bg-success/15 text-success'
                : 'bg-destructive/15 text-destructive'
            }`}>
              {auditData.passedThreshold ? '✓ PASS' : '✗ FAIL'}
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
