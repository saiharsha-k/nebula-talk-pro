import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Bot, User, Send, Mic, Clock } from 'lucide-react';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  isActive: boolean;
  onSendMessage: (message: string) => void;
  messages: Message[];
  isTyping: boolean;
}

export function ChatInterface({ isActive, onSendMessage, messages, isTyping }: ChatInterfaceProps) {
  const [inputValue, setInputValue] = useState('');
  const [timeElapsed, setTimeElapsed] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Timer for interview duration
  useEffect(() => {
    if (!isActive) return;
    
    const timer = setInterval(() => {
      setTimeElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() && !isTyping) {
      onSendMessage(inputValue.trim());
      setInputValue('');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-hero p-2 rounded-lg">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-lg">AI Interviewer</h2>
            <p className="text-sm text-muted-foreground">
              {isActive ? 'Ready to interview' : 'Waiting to start'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Clock className="w-4 h-4" />
          <span className="font-mono">{formatTime(timeElapsed)}</span>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="bg-hero p-6 rounded-2xl mb-4">
              <Bot className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Ready for your interview?</h3>
            <p className="text-muted-foreground max-w-md">
              I'm here to help you practice. Send me a message to get started with your AI-powered interview session.
            </p>
          </div>
        ) : (
          <>
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} chat-bubble-enter`}
              >
                <div className={`flex max-w-[70%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'} items-end space-x-2`}>
                  {/* Avatar */}
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === 'ai' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {message.type === 'ai' ? (
                      <Bot className="w-4 h-4" />
                    ) : (
                      <User className="w-4 h-4" />
                    )}
                  </div>
                  
                  {/* Message Bubble */}
                  <div className={`px-4 py-3 ${
                    message.type === 'ai' 
                      ? 'chat-bubble-ai ml-2' 
                      : 'chat-bubble-user mr-2'
                  }`}>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>
                    <div className={`text-xs mt-2 opacity-70 ${
                      message.type === 'ai' ? 'text-primary-foreground' : 'text-muted-foreground'
                    }`}>
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start chat-bubble-enter">
                <div className="flex items-end space-x-2 max-w-[70%]">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="chat-bubble-ai ml-2 px-4 py-3">
                    <div className="typing-dots">
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                      <div className="typing-dot"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-card border-t px-6 py-4">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              type="text"
              placeholder="Type your answer..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              disabled={!isActive || isTyping}
              className="pr-12"
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              className="absolute right-1 top-1 h-8 w-8 p-0"
              disabled={!isActive}
            >
              <Mic className="w-4 h-4" />
            </Button>
          </div>
          <Button
            type="submit"
            size="sm"
            className="btn-hero h-10 w-10 p-0"
            disabled={!inputValue.trim() || !isActive || isTyping}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
        
        {!isActive && (
          <p className="text-xs text-muted-foreground mt-2 text-center">
            Click "Start Interview" to begin your session
          </p>
        )}
      </div>
    </div>
  );
}