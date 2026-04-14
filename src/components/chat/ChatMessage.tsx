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
      className={`border rounded p-3 text-sm cursor-pointer transition-colors ${
        isSelected
          ? 'border-primary bg-primary/5'
          : 'border-border bg-card hover:border-muted-foreground/30'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-[10px] font-mono uppercase tracking-wide text-muted-foreground">
          {isAssistant ? 'assistant' : 'user'}
        </span>
        <span className="text-[10px] text-muted-foreground">
          {message.timestamp.toLocaleTimeString()}
        </span>
        {isAssistant && message.auditData && (
          <span className="text-[10px] font-mono text-primary">
            [audited — {(message.auditData.finalConfidence * 100).toFixed(0)}% conf]
          </span>
        )}
        {isAssistant && !message.auditData && (
          <span className="text-[10px] font-mono text-muted-foreground">
            [invalid query — audit skipped]
          </span>
        )}
      </div>

      <div className="prose prose-sm max-w-none text-foreground">
        <ReactMarkdown>{message.content}</ReactMarkdown>
      </div>

      {message.isStreaming && (
        <span className="inline-block w-1.5 h-3.5 bg-foreground ml-0.5" />
      )}
    </div>
  );
}
