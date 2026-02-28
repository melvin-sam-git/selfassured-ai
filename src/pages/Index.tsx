import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, FlaskConical, Shield, Brain, BarChart3 } from 'lucide-react';

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FlaskConical className="w-4 h-4 text-primary" />
            <span className="font-semibold text-sm text-foreground">Self-Auditing LLM Platform</span>
          </div>
          <div className="flex items-center gap-2">
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
        <p className="text-sm text-muted-foreground mb-8 leading-relaxed max-w-2xl">
          A research platform that transforms single LLM outputs into peer-reviewed, verified responses
          through a self-auditing multi-agent pipeline.
        </p>

        {/* Pipeline Overview */}
        <div className="border border-border rounded-md bg-card p-5 mb-6">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Pipeline Overview</h2>
          <div className="flex items-center gap-1.5 text-xs font-mono flex-wrap">
            {['Prompt', 'Draft (R₀)', 'Audit', 'Correct', 'Verify', 'Release (Rᶠ)'].map((step, i) => (
              <div key={step} className="flex items-center">
                <span className={`px-3 py-1.5 border rounded-md ${
                  i === 5
                    ? 'bg-primary text-primary-foreground border-primary font-medium'
                    : 'border-border bg-muted/30 text-foreground'
                }`}>
                  {step}
                </span>
                {i < 5 && <ArrowRight className="w-3 h-3 mx-1.5 text-muted-foreground/50" />}
              </div>
            ))}
          </div>
        </div>

        {/* Agents */}
        <div className="border border-border rounded-md bg-card p-5 mb-6">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Audit Agents</h2>
          <div className="space-y-3">
            {[
              { name: 'Fact-Checking', role: 'Detects hallucinated or incorrect claims', icon: Brain, color: 'text-agent-fact', dot: 'bg-agent-fact' },
              { name: 'Bias & Safety', role: 'Identifies harmful or unfair outputs', icon: Shield, color: 'text-agent-safety', dot: 'bg-agent-safety' },
              { name: 'Reasoning', role: 'Checks logical consistency', icon: BarChart3, color: 'text-agent-reasoning', dot: 'bg-agent-reasoning' },
              { name: 'Confidence', role: 'Estimates uncertainty and reliability', icon: FlaskConical, color: 'text-agent-confidence', dot: 'bg-agent-confidence' },
            ].map(({ name, role, dot }) => (
              <div key={name} className="flex items-start gap-3 py-2">
                <span className={`w-2.5 h-2.5 rounded-full mt-1 flex-shrink-0 ${dot}`} />
                <div>
                  <p className="text-sm font-medium text-foreground">{name}</p>
                  <p className="text-xs text-muted-foreground">{role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key formulas */}
        <div className="border border-border rounded-md bg-card p-5 mb-8">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">Core Formulas</h2>
          <div className="space-y-2 font-mono text-xs text-foreground bg-muted/30 rounded-md p-4 leading-relaxed">
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

      <footer className="border-t border-border py-5 px-6">
        <p className="text-xs text-muted-foreground text-center">
          Self-Auditing LLM — Multi-Agent Framework for Bias &amp; Hallucination Reduction
        </p>
      </footer>
    </div>
  );
}
