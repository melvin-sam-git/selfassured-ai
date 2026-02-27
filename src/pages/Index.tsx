import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 h-12 flex items-center justify-between">
          <span className="font-semibold text-sm text-foreground">Self-Auditing LLM Platform</span>
          <div className="flex items-center gap-3">
            <Link to="/login">
              <Button variant="ghost" size="sm" className="text-xs">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button size="sm" className="text-xs">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-12 max-w-3xl">
        <h1 className="text-xl font-semibold text-foreground mb-2">
          Multi-Agent Framework for Bias &amp; Hallucination Reduction
        </h1>
        <p className="text-sm text-muted-foreground mb-8">
          A research platform that transforms single LLM outputs into peer-reviewed, verified responses
          through a self-auditing multi-agent pipeline.
        </p>

        {/* Pipeline Overview */}
        <div className="border border-border rounded bg-card p-4 mb-8">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Pipeline Overview</h2>
          <div className="flex items-center gap-1 text-xs font-mono flex-wrap">
            {['Prompt', 'Draft (R₀)', 'Audit', 'Correct', 'Verify', 'Release (Rᶠ)'].map((step, i) => (
              <div key={step} className="flex items-center">
                <span className={`px-2 py-1 border rounded ${
                  i === 5 ? 'bg-primary text-primary-foreground border-primary' : 'border-border bg-background'
                }`}>
                  {step}
                </span>
                {i < 5 && <ArrowRight className="w-3 h-3 mx-1 text-muted-foreground" />}
              </div>
            ))}
          </div>
        </div>

        {/* Agents */}
        <div className="border border-border rounded bg-card p-4 mb-8">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Audit Agents</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-muted-foreground">
                <th className="pb-2 font-medium">Agent</th>
                <th className="pb-2 font-medium">Role</th>
              </tr>
            </thead>
            <tbody className="text-foreground">
              {[
                ['Fact-Checking', 'Detects hallucinated or incorrect claims'],
                ['Bias & Safety', 'Identifies harmful or unfair outputs'],
                ['Reasoning', 'Checks logical consistency'],
                ['Confidence', 'Estimates uncertainty and reliability'],
              ].map(([name, role]) => (
                <tr key={name} className="border-b border-border last:border-0">
                  <td className="py-2 font-mono text-xs">{name}</td>
                  <td className="py-2 text-muted-foreground text-xs">{role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Key formulas */}
        <div className="border border-border rounded bg-card p-4 mb-8">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">Core Formulas</h2>
          <div className="space-y-2 font-mono text-xs text-foreground">
            <p>R₀ = LLM(Q) — Initial draft generation</p>
            <p>D = Σ sᵢ · Cᵢ — Decision vector (confidence-weighted)</p>
            <p>S = Σ sᵢ — Aggregate confidence score</p>
            <p>R₁ = LLM(Q, R₀, D) — Iterative correction</p>
            <p>Release if Confidence(Rᶠ) ≥ τ (threshold = 0.7)</p>
          </div>
        </div>

        <div className="flex gap-3">
          <Link to="/signup">
            <Button size="sm">Create Account</Button>
          </Link>
          <Link to="/login">
            <Button variant="outline" size="sm">Sign In</Button>
          </Link>
        </div>
      </main>

      <footer className="border-t border-border py-4 px-6">
        <p className="text-xs text-muted-foreground text-center">
          Self-Auditing LLM — Multi-Agent Framework for Bias &amp; Hallucination Reduction
        </p>
      </footer>
    </div>
  );
}
