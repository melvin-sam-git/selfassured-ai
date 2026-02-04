import { useState } from 'react';
import { Message } from '@/types/audit';
import { User, Brain, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuditPanel } from './AuditPanel';
import { ConfidenceWeighting } from './ConfidenceWeighting';
import { OutcomesPanel } from './OutcomesPanel';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const [showAudit, setShowAudit] = useState(false);
  const [showConfidence, setShowConfidence] = useState(false);
  const [showOutcomes, setShowOutcomes] = useState(false);

  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex gap-4 ${isAssistant ? 'flex-row' : 'flex-row-reverse'}`}>
      <div className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${
        isAssistant ? 'gradient-primary' : 'bg-secondary'
      }`}>
        {isAssistant ? (
          <Brain className="w-5 h-5 text-primary-foreground" />
        ) : (
          <User className="w-5 h-5 text-secondary-foreground" />
        )}
      </div>

      <div className={`flex-1 max-w-[80%] ${isAssistant ? '' : 'flex flex-col items-end'}`}>
        <div className={`rounded-2xl p-4 ${
          isAssistant 
            ? 'glass-card' 
            : 'bg-primary text-primary-foreground'
        }`}>
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
          
          {message.isStreaming && (
            <span className="inline-block w-2 h-4 bg-primary animate-pulse ml-1" />
          )}
        </div>

        {isAssistant && message.auditData && (
          <div className="mt-4 space-y-2">
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAudit(!showAudit)}
                className="text-xs border-primary/30 hover:bg-primary/10"
              >
                Self-Audit Details
                {showAudit ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowConfidence(!showConfidence)}
                className="text-xs border-agent-confidence/30 hover:bg-agent-confidence/10"
              >
                Confidence Weighting
                {showConfidence ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOutcomes(!showOutcomes)}
                className="text-xs border-success/30 hover:bg-success/10"
              >
                Outcomes Delivered
                {showOutcomes ? <ChevronUp className="ml-1 w-3 h-3" /> : <ChevronDown className="ml-1 w-3 h-3" />}
              </Button>
            </div>

            {showAudit && <AuditPanel auditData={message.auditData} />}
            {showConfidence && <ConfidenceWeighting auditData={message.auditData} />}
            {showOutcomes && <OutcomesPanel auditData={message.auditData} />}
          </div>
        )}

        <p className="text-xs text-muted-foreground mt-2">
          {message.timestamp.toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
