import { AuditData } from '@/types/audit';
import { TrendingUp, Shield, Brain, Scale, CheckCircle, RefreshCw } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface OutcomesPanelProps {
  auditData: AuditData;
}

interface MetricCardProps {
  icon: React.ElementType;
  title: string;
  value: number;
  description: string;
  formula: string;
  colorClass: string;
}

function MetricCard({ icon: Icon, title, value, description, formula, colorClass }: MetricCardProps) {
  return (
    <div className="border border-border rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-lg bg-${colorClass}/20 flex items-center justify-center`}>
            <Icon className={`w-4 h-4 text-${colorClass}`} />
          </div>
          <span className="font-medium text-sm">{title}</span>
        </div>
        <span className={`text-xl font-bold text-${colorClass}`}>
          {(value * 100).toFixed(1)}%
        </span>
      </div>

      <Progress value={value * 100} className="h-2" />

      <p className="text-xs text-muted-foreground">{description}</p>

      <div className="bg-secondary/50 rounded p-2 font-mono text-xs">
        <span className="text-muted-foreground">Formula: </span>
        <span className="text-primary">{formula}</span>
      </div>
    </div>
  );
}

export function OutcomesPanel({ auditData }: OutcomesPanelProps) {
  const { outcomes, iterations } = auditData;

  const metrics: Omit<MetricCardProps, 'colorClass'>[] = [
    {
      icon: TrendingUp,
      title: 'Hallucination Reduction',
      value: outcomes.hallucinationReduction,
      description: 'Percentage of hallucinated content removed through multi-agent verification.',
      formula: '(R₀_hallucinations - Rᶠ_hallucinations) / R₀_hallucinations',
    },
    {
      icon: CheckCircle,
      title: 'Factual Accuracy Improvement',
      value: outcomes.factualAccuracyImprovement,
      description: 'Increase in factually verified claims after audit corrections.',
      formula: '(Rᶠ_verified_facts - R₀_verified_facts) / total_claims',
    },
    {
      icon: Brain,
      title: 'Logical Coherence Gain',
      value: outcomes.logicalCoherenceGain,
      description: 'Improvement in logical consistency between statements.',
      formula: 'Σ(reasoning_agent_scores) / max_possible_score',
    },
    {
      icon: Shield,
      title: 'Policy & Safety Compliance',
      value: outcomes.policySafetyCompliance,
      description: 'Adherence to safety policies and ethical guidelines.',
      formula: 'bias_safety_agent.score × policy_adherence_factor',
    },
    {
      icon: Scale,
      title: 'Overall Trustworthiness',
      value: outcomes.overallTrustworthiness,
      description: 'Composite score combining all reliability metrics.',
      formula: 'Σ(all_agent_scores × weights) / Σ(weights)',
    },
    {
      icon: RefreshCw,
      title: 'Correction Success Rate',
      value: outcomes.correctionSuccessRate,
      description: 'Percentage of identified issues successfully resolved.',
      formula: 'issues_resolved / total_issues_identified',
    },
  ];

  const colors = ['primary', 'success', 'agent-reasoning', 'agent-bias', 'agent-confidence', 'agent-fact'];

  return (
    <div className="glass-card rounded-xl p-6 space-y-6 animate-fade-in">
      <div>
        <h3 className="font-semibold text-lg">Outcomes Delivered</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Quantified improvements from the self-auditing process
        </p>
      </div>

      {/* Comparison Summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
          <p className="text-xs text-muted-foreground">Initial Draft (R₀)</p>
          <p className="text-lg font-bold text-destructive">
            {(iterations[0]?.confidence * 100 || 0).toFixed(0)}% Confidence
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Potential hallucinations, unverified claims
          </p>
        </div>
        <div className="p-4 rounded-lg bg-success/10 border border-success/20">
          <p className="text-xs text-muted-foreground">Final Output (Rᶠ)</p>
          <p className="text-lg font-bold text-success">
            {(auditData.finalConfidence * 100).toFixed(0)}% Confidence
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Verified, audited, peer-reviewed
          </p>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {metrics.map((metric, index) => (
          <MetricCard
            key={metric.title}
            {...metric}
            colorClass={colors[index]}
          />
        ))}
      </div>

      {/* Explanation */}
      <div className="p-4 rounded-lg bg-secondary/50 space-y-2">
        <p className="font-medium text-sm">Understanding These Metrics</p>
        <p className="text-xs text-muted-foreground">
          The self-auditing framework transforms a single LLM response into a peer-reviewed, 
          verified output. Unlike traditional single-pass generation, each response undergoes:
        </p>
        <ul className="text-xs text-muted-foreground list-disc list-inside space-y-1 mt-2">
          <li><strong>Multi-agent verification</strong> - 4 specialized agents audit different aspects</li>
          <li><strong>Confidence-weighted arbitration</strong> - Higher-confidence agents have more influence</li>
          <li><strong>Iterative refinement</strong> - Multiple correction passes until threshold met</li>
          <li><strong>Token-level streaming audit</strong> - Real-time intervention during generation</li>
        </ul>
      </div>

      {/* Iterations Summary */}
      <div className="space-y-2">
        <p className="font-medium text-sm">Correction Iterations</p>
        <div className="flex items-center gap-1 text-xs">
          {iterations.map((iter, index) => (
            <div 
              key={index}
              className={`flex-1 h-8 rounded flex items-center justify-center ${
                index === iterations.length - 1 
                  ? 'gradient-primary text-primary-foreground font-medium' 
                  : 'bg-secondary'
              }`}
            >
              {(iter.confidence * 100).toFixed(0)}%
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          {iterations.length} iteration{iterations.length > 1 ? 's' : ''} to reach confidence threshold
        </p>
      </div>
    </div>
  );
}
