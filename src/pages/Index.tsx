import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Brain, Shield, Zap, CheckCircle, ArrowRight, Layers, RefreshCw } from 'lucide-react';

export default function Index() {
  const features = [
    {
      icon: Brain,
      title: 'Multi-Agent Auditing',
      description: 'Four specialized AI agents work together to verify every response for accuracy and reliability.',
    },
    {
      icon: Shield,
      title: 'Hallucination Reduction',
      description: 'Advanced fact-checking prevents false or fabricated information from reaching users.',
    },
    {
      icon: Zap,
      title: 'Real-time Verification',
      description: 'Token-level streaming audit catches errors during generation, not after.',
    },
    {
      icon: CheckCircle,
      title: 'Confidence Scoring',
      description: 'Every response includes quantified reliability metrics you can trust.',
    },
    {
      icon: Layers,
      title: 'Iterative Refinement',
      description: 'Responses are corrected through multiple passes until they meet quality thresholds.',
    },
    {
      icon: RefreshCw,
      title: 'Self-Improving System',
      description: 'The framework learns from corrections to continuously enhance accuracy.',
    },
  ];

  const auditFlow = [
    { step: 'Prompt', desc: 'User submits query' },
    { step: 'Draft', desc: 'Initial R₀ generation' },
    { step: 'Audit', desc: 'Multi-agent review' },
    { step: 'Fix', desc: 'Corrections applied' },
    { step: 'Verify', desc: 'Threshold check' },
    { step: 'Final', desc: 'Trusted response' },
  ];

  return (
    <div className="min-h-screen neural-grid">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="font-bold text-lg">Self-Auditing LLM</span>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link to="/signup">
              <Button className="gradient-primary text-primary-foreground">Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 relative overflow-hidden">
        <div className="absolute inset-0 gradient-glow opacity-50" />
        
        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card mb-6">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-muted-foreground">Multi-Agent Framework for Trustworthy AI</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
            AI Responses You Can
            <br />
            <span className="text-gradient">Actually Trust</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            Transform single LLM outputs into peer-reviewed, verified responses through our 
            revolutionary self-auditing multi-agent framework.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link to="/signup">
              <Button size="lg" className="gradient-primary text-primary-foreground glow-primary group">
                Start Free Trial
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                View Demo
              </Button>
            </Link>
          </div>

          {/* Audit Flow Visualization */}
          <div className="glass-card rounded-2xl p-8 max-w-4xl mx-auto">
            <h3 className="text-lg font-semibold mb-6">Self-Auditing Pipeline</h3>
            <div className="flex flex-wrap justify-center items-center gap-2">
              {auditFlow.map((item, index) => (
                <div key={item.step} className="flex items-center">
                  <div className={`px-4 py-3 rounded-lg ${
                    index === auditFlow.length - 1 
                      ? 'gradient-primary text-primary-foreground' 
                      : 'bg-secondary'
                  }`}>
                    <div className="font-semibold text-sm">{item.step}</div>
                    <div className="text-xs opacity-70">{item.desc}</div>
                  </div>
                  {index < auditFlow.length - 1 && (
                    <ArrowRight className="w-4 h-4 mx-2 text-muted-foreground hidden sm:block" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              How It <span className="text-gradient">Works</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our multi-agent framework introduces specialized auditors that verify 
              every aspect of AI-generated content.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="glass-card rounded-xl p-6 hover:border-primary/50 transition-colors animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Agents Section */}
      <section className="py-20 px-4 relative">
        <div className="absolute inset-0 gradient-glow opacity-30" />
        
        <div className="container mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Meet the <span className="text-gradient">Audit Agents</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Specialized AI agents that work in parallel to ensure reliability.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Fact-Checking', role: 'Detects hallucinated or incorrect claims', color: 'agent-fact' },
              { name: 'Bias & Safety', role: 'Identifies harmful or unfair outputs', color: 'agent-bias' },
              { name: 'Reasoning', role: 'Checks logical consistency', color: 'agent-reasoning' },
              { name: 'Confidence', role: 'Estimates uncertainty and reliability', color: 'agent-confidence' },
            ].map((agent) => (
              <div key={agent.name} className="glass-card rounded-xl p-6 text-center">
                <div className={`w-16 h-16 rounded-2xl bg-${agent.color}/20 flex items-center justify-center mx-auto mb-4`}>
                  <Brain className={`w-8 h-8 text-${agent.color}`} />
                </div>
                <h3 className={`font-semibold text-lg mb-2 text-${agent.color}`}>{agent.name}</h3>
                <p className="text-muted-foreground text-sm">{agent.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="glass-card rounded-2xl p-12 text-center glow-primary">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready for <span className="text-gradient">Trustworthy AI</span>?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Experience the next generation of AI reliability. Every response verified 
              through multi-agent peer review.
            </p>
            <Link to="/signup">
              <Button size="lg" className="gradient-primary text-primary-foreground glow-primary">
                Get Started Free
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            <span className="font-semibold">Self-Auditing LLM</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Multi-Agent Framework for Bias & Hallucination Reduction
          </p>
        </div>
      </footer>
    </div>
  );
}
