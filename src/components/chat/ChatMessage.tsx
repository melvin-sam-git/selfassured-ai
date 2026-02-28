import { Message } from '@/types/audit';
import ReactMarkdown from 'react-markdown';

interface ChatMessageProps {
  message: Message;
  isSelected?: boolean;
  onSelect?: () => void;
}

export function ChatMessage({ message, isSelected, onSelect }: ChatMessageProps) {
  const isAssistant = message.role === 'assistant';

  return (
    <div
      className={`border rounded-md p-4 text-sm transition-colors ${
        isAssistant
          ? isSelected
            ? 'border-primary/40 bg-card shadow-sm'
            : 'border-border bg-card hover:border-primary/30 cursor-pointer'
          : 'border-primary/20 bg-primary/[0.04]'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2 mb-2">
        <span className={`inline-flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wider ${
          isAssistant ? 'text-muted-foreground' : 'text-primary'
        }`}>
          <span className={`w-2 h-2 rounded-full ${isAssistant ? 'bg-muted-foreground/40' : 'bg-primary'}`} />
          {isAssistant ? 'Assistant' : 'You'}
        </span>
        <span className="text-[11px] text-muted-foreground/60">
          {message.timestamp.toLocaleTimeString()}
        </span>
        {isAssistant && message.auditData && (
          <span className={`ml-auto text-[11px] font-mono px-2 py-0.5 rounded ${
            message.auditData.passedThreshold
              ? 'bg-success/10 text-success'
              : 'bg-warning/10 text-warning'
          }`}>
            {message.auditData.passedThreshold ? 'PASS' : 'WARN'} · {(message.auditData.finalConfidence * 100).toFixed(0)}%
          </span>
        )}
      </div>

      <div className="prose prose-sm max-w-none text-foreground leading-relaxed">
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>

      {message.isStreaming && (
        <span className="inline-block w-1.5 h-4 bg-primary ml-0.5 animate-pulse" />
      )}
    </div>
  );
}
