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
import { LogOut, Plus, Menu, X, FlaskConical, ChevronRight } from 'lucide-react';
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
        className="fixed top-3 left-3 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
      </Button>

      {/* Left Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-40
        w-60 bg-card border-r border-border
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <FlaskConical className="w-4 h-4 text-primary" />
              <div>
                <h1 className="font-semibold text-sm text-foreground leading-tight">Self-Auditing LLM</h1>
                <p className="text-[11px] text-muted-foreground font-mono">v1.0 · Multi-Agent</p>
              </div>
            </div>
          </div>

          <div className="p-3">
            <Button
              onClick={handleNewChat}
              variant="outline"
              size="sm"
              className="w-full text-xs justify-start"
            >
              <Plus className="w-3.5 h-3.5 mr-2" />
              New Session
            </Button>
          </div>

          {/* Pipeline reference */}
          <div className="mx-3 border border-border rounded-md p-3 space-y-1.5">
            <h3 className="font-medium text-[11px] uppercase tracking-wider text-muted-foreground">Pipeline</h3>
            <div className="space-y-1 text-[11px] text-muted-foreground">
              {[
                { num: '1', label: 'Generate R₀' },
                { num: '2', label: 'Multi-agent audit' },
                { num: '3', label: 'Iterative correction' },
                { num: '4', label: 'Threshold check (τ=0.7)' },
                { num: '5', label: 'Release Rᶠ' },
              ].map(step => (
                <div key={step.num} className="flex items-center gap-2">
                  <span className="w-4 h-4 rounded-sm bg-muted flex items-center justify-center text-[10px] font-mono font-medium text-muted-foreground">{step.num}</span>
                  <span>{step.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex-1" />

          {/* User */}
          <div className="border-t border-border p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="truncate">
                <p className="text-xs font-medium truncate text-foreground">{user?.email}</p>
                <p className="text-[11px] text-muted-foreground">Authenticated</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut} className="h-7 w-7 text-muted-foreground hover:text-foreground">
                <LogOut className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Center — Messages */}
      <div className="flex-1 flex flex-col h-screen min-w-0">
        <header className="border-b border-border px-5 py-3 bg-card flex items-center justify-between">
          <div>
            <h2 className="font-semibold text-sm text-foreground">Conversation</h2>
            <p className="text-[11px] text-muted-foreground">
              Responses verified through multi-agent peer review
            </p>
          </div>
          {selectedMessage?.auditData && (
            <div className="hidden md:flex lg:hidden items-center gap-1 text-[11px] text-muted-foreground">
              <span>Inspect</span>
              <ChevronRight className="w-3 h-3" />
            </div>
          )}
        </header>

        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8 max-w-md mx-auto">
              <FlaskConical className="w-8 h-8 text-muted-foreground/30 mb-4" />
              <p className="text-sm text-muted-foreground mb-1 font-medium">
                No messages yet
              </p>
              <p className="text-xs text-muted-foreground/70 mb-5">
                Enter a query below to begin multi-agent evaluation.
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
                    className="text-xs text-muted-foreground hover:text-foreground"
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
            <div className="border border-border rounded-md p-4 bg-card">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <p className="text-xs text-muted-foreground">
                  Processing: Generate → Audit → Correct → Verify …
                </p>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-4 border-t border-border bg-card">
          <ChatInput onSend={handleSend} isLoading={isLoading} />
        </div>
      </div>

      {/* Right — Inspection Panel */}
      <div className="hidden lg:flex flex-col w-[400px] border-l border-border bg-card h-screen">
        <div className="border-b border-border px-4 py-3">
          <h2 className="font-semibold text-sm text-foreground">Inspection Panel</h2>
          <p className="text-[11px] text-muted-foreground">Select an assistant message to inspect</p>
        </div>

        {selectedMessage?.auditData ? (
          <>
            {/* Tabs */}
            <div className="flex border-b border-border text-xs">
              {(['audit', 'confidence', 'outcomes'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setInspectTab(tab)}
                  className={`flex-1 py-2.5 px-3 text-center capitalize transition-colors ${
                    inspectTab === tab
                      ? 'border-b-2 border-primary text-primary font-medium bg-primary/[0.03]'
                      : 'border-b-2 border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/30'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {inspectTab === 'audit' && <AuditPanel auditData={selectedMessage.auditData} />}
              {inspectTab === 'confidence' && <ConfidenceWeighting auditData={selectedMessage.auditData} />}
              {inspectTab === 'outcomes' && <OutcomesPanel auditData={selectedMessage.auditData} />}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <FlaskConical className="w-6 h-6 text-muted-foreground/20 mx-auto mb-3" />
              <p className="text-xs text-muted-foreground">
                No audit data selected.<br />
                Send a message and click on an assistant response to inspect.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
