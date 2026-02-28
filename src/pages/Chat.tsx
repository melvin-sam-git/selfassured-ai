import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Message, AuditData } from '@/types/audit';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { AuditPanel } from '@/components/chat/AuditPanel';
import { ConfidenceWeighting } from '@/components/chat/ConfidenceWeighting';
import { OutcomesPanel } from '@/components/chat/OutcomesPanel';
import { Button } from '@/components/ui/button';
import { LogOut, Plus, Menu, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [inspectTab, setInspectTab] = useState<'audit' | 'confidence' | 'outcomes'>('audit');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Auto-select latest assistant message for inspection
  useEffect(() => {
    const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant' && m.auditData);
    if (lastAssistant) setSelectedMessage(lastAssistant);
  }, [messages]);

  const handleSend = async (content: string) => {
    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to get response');
      }

      const data = await response.json();

      const assistantMessage: Message = {
        id: crypto.randomUUID(),
        role: 'assistant',
        content: data.response,
        auditData: data.auditData as AuditData,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send message',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setSelectedMessage(null);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-2 left-2 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </Button>

      {/* Left Sidebar — Conversation List */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-40
        w-56 bg-card border-r border-border
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-3">
          <div className="mb-4 pt-1">
            <h1 className="font-semibold text-sm text-foreground">Self-Auditing LLM</h1>
            <p className="text-[10px] text-muted-foreground font-mono">Multi-Agent Framework v1.0</p>
          </div>

          <Button
            onClick={handleNewChat}
            variant="outline"
            size="sm"
            className="w-full mb-3 text-xs"
          >
            <Plus className="w-3 h-3 mr-1" />
            New Session
          </Button>

          {/* Pipeline reference */}
          <div className="border border-border rounded p-3 space-y-1 mb-3">
            <h3 className="font-medium text-[10px] uppercase tracking-wide text-muted-foreground">Pipeline</h3>
            <div className="space-y-0.5 text-[11px] text-muted-foreground font-mono">
              <p>1. Generate R₀</p>
              <p>2. Multi-agent audit</p>
              <p>3. Iterative correction</p>
              <p>4. Threshold check (τ=0.7)</p>
              <p>5. Release Rᶠ</p>
            </div>
          </div>

          <div className="flex-1" />

          {/* User */}
          <div className="border-t border-border pt-3">
            <div className="flex items-center justify-between">
              <div className="truncate">
                <p className="text-xs font-medium truncate text-foreground">{user?.email}</p>
                <p className="text-[10px] text-muted-foreground">Authenticated</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut} className="h-7 w-7">
                <LogOut className="w-3 h-3" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Middle — Messages */}
      <div className="flex-1 flex flex-col h-screen min-w-0">
        <header className="border-b border-border px-4 py-2 bg-card">
          <h2 className="font-medium text-sm text-foreground">Conversation</h2>
          <p className="text-[10px] text-muted-foreground font-mono">
            Responses verified through multi-agent peer review
          </p>
        </header>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <p className="text-sm text-muted-foreground mb-4">
                No messages yet. Enter a query below to begin evaluation.
              </p>
              <div className="flex flex-wrap gap-2 justify-center">
                {[
                  'Explain quantum computing',
                  'What causes climate change?',
                  'How does machine learning work?',
                ].map((suggestion) => (
                  <Button
                    key={suggestion}
                    variant="outline"
                    size="sm"
                    onClick={() => handleSend(suggestion)}
                    className="text-xs"
                  >
                    {suggestion}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <ChatMessage
                key={message.id}
                message={message}
                isSelected={selectedMessage?.id === message.id}
                onSelect={() => message.auditData && setSelectedMessage(message)}
              />
            ))
          )}

          {isLoading && (
            <div className="border border-border rounded p-3 bg-card">
              <p className="text-xs text-muted-foreground font-mono">
                Processing: Generate → Audit → Correct → Verify ...
              </p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-3 border-t border-border bg-card">
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
      </div>

      {/* Right — Audit Inspection Panel */}
      <div className="hidden lg:flex flex-col w-96 border-l border-border bg-card h-screen">
        <div className="border-b border-border px-3 py-2">
          <h2 className="font-medium text-sm text-foreground">Inspection Panel</h2>
          <p className="text-[10px] text-muted-foreground">Select an assistant message to inspect</p>
        </div>

        {selectedMessage?.auditData ? (
          <>
            {/* Tabs */}
            <div className="flex border-b border-border text-xs">
              {(['audit', 'confidence', 'outcomes'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setInspectTab(tab)}
                  className={`flex-1 py-2 px-3 text-center capitalize border-b-2 transition-colors ${
                    inspectTab === tab
                      ? 'border-primary text-primary font-medium'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-3">
              {inspectTab === 'audit' && <AuditPanel auditData={selectedMessage.auditData} />}
              {inspectTab === 'confidence' && <ConfidenceWeighting auditData={selectedMessage.auditData} />}
              {inspectTab === 'outcomes' && <OutcomesPanel auditData={selectedMessage.auditData} />}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6">
            <p className="text-xs text-muted-foreground text-center">
              No audit data selected. Send a message and click on an assistant response to inspect.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
