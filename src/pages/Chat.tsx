import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Message, AuditData } from '@/types/audit';
import { ChatMessage } from '@/components/chat/ChatMessage';
import { ChatInput } from '@/components/chat/ChatInput';
import { Button } from '@/components/ui/button';
import { Brain, LogOut, Plus, Menu, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const CHAT_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`;

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex neural-grid">
      {/* Mobile sidebar toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 lg:hidden"
        onClick={() => setSidebarOpen(!sidebarOpen)}
      >
        {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </Button>

      {/* Sidebar */}
      <div className={`
        fixed lg:relative inset-y-0 left-0 z-40
        w-72 bg-sidebar border-r border-sidebar-border
        transform transition-transform duration-300
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-8 pt-2">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-bold">Self-Auditing LLM</h1>
              <p className="text-xs text-muted-foreground">Multi-Agent Framework</p>
            </div>
          </div>

          {/* New Chat Button */}
          <Button
            onClick={handleNewChat}
            className="w-full mb-4 gradient-primary text-primary-foreground"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Chat
          </Button>

          {/* Framework Info */}
          <div className="flex-1 space-y-4 overflow-y-auto">
            <div className="glass-card rounded-lg p-4 space-y-2">
              <h3 className="font-medium text-sm">How It Works</h3>
              <div className="space-y-2 text-xs text-muted-foreground">
                <p>1. <strong>Generate</strong> - Initial draft response</p>
                <p>2. <strong>Audit</strong> - 4 specialized agents review</p>
                <p>3. <strong>Fix</strong> - Iterative corrections</p>
                <p>4. <strong>Verify</strong> - Confidence threshold check</p>
                <p>5. <strong>Deliver</strong> - Trusted final answer</p>
              </div>
            </div>

            <div className="glass-card rounded-lg p-4 space-y-2">
              <h3 className="font-medium text-sm">Audit Agents</h3>
              <div className="space-y-2 text-xs">
                <p className="text-agent-fact">• Fact-Checking Agent</p>
                <p className="text-agent-bias">• Bias & Safety Agent</p>
                <p className="text-agent-reasoning">• Reasoning Agent</p>
                <p className="text-agent-confidence">• Confidence Agent</p>
              </div>
            </div>
          </div>

          {/* User & Sign Out */}
          <div className="border-t border-sidebar-border pt-4 mt-4">
            <div className="flex items-center justify-between">
              <div className="truncate">
                <p className="text-sm font-medium truncate">{user?.email}</p>
                <p className="text-xs text-muted-foreground">Logged in</p>
              </div>
              <Button variant="ghost" size="icon" onClick={handleSignOut}>
                <LogOut className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col h-screen">
        {/* Header */}
        <header className="border-b border-border p-4 flex items-center justify-center">
          <div className="text-center">
            <h2 className="font-semibold">AI Chat with Self-Auditing</h2>
            <p className="text-xs text-muted-foreground">
              Every response is verified through multi-agent peer review
            </p>
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-8">
              <div className="w-20 h-20 rounded-2xl gradient-primary flex items-center justify-center mb-6 glow-primary animate-pulse-glow">
                <Brain className="w-10 h-10 text-primary-foreground" />
              </div>
              <h2 className="text-2xl font-bold mb-2">
                Welcome to Self-Auditing <span className="text-gradient">LLM</span>
              </h2>
              <p className="text-muted-foreground max-w-md mb-8">
                Ask anything and watch as your query is processed through our multi-agent 
                verification framework for reliable, trustworthy responses.
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
              <ChatMessage key={message.id} message={message} />
            ))
          )}
          
          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center animate-pulse">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <div className="glass-card rounded-2xl p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Processing through multi-agent audit</span>
                  <span className="animate-pulse">...</span>
                </div>
                <div className="flex gap-2 mt-2">
                  {['Generating', 'Auditing', 'Correcting', 'Verifying'].map((step, i) => (
                    <span 
                      key={step}
                      className="text-xs px-2 py-1 rounded bg-secondary animate-pulse"
                      style={{ animationDelay: `${i * 0.2}s` }}
                    >
                      {step}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border">
          <div className="max-w-4xl mx-auto">
            <ChatInput onSend={handleSend} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
}
