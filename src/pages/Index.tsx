import React, { useState } from 'react';
import { AuthModal } from '@/components/AuthModal';
import { Dashboard } from '@/components/Dashboard';
import { ChatInterface } from '@/components/ChatInterface';
import { Button } from '@/components/ui/button';
import { Bot, Sparkles, Target, TrendingUp } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  type: 'ai' | 'user';
  content: string;
  timestamp: Date;
}

interface Session {
  id: string;
  date: Date;
  duration: number;
  status: 'completed' | 'in-progress' | 'scheduled';
  score?: number;
  feedback?: string;
}

type AppState = 'landing' | 'dashboard' | 'interview';

const Index = () => {
  const [appState, setAppState] = useState<AppState>('landing');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<{ firstName: string; lastName: string; email: string } | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const { toast } = useToast();

  // Mock sessions data
  const mockSessions: Session[] = [
    {
      id: '1',
      date: new Date(Date.now() - 86400000),
      duration: 1200,
      status: 'completed',
      score: 85,
      feedback: 'Great communication skills!'
    },
    {
      id: '2',
      date: new Date(Date.now() - 172800000),
      duration: 900,
      status: 'completed',
      score: 78,
      feedback: 'Good technical knowledge, work on confidence.'
    }
  ];

  const handleLogin = async (email: string, password: string) => {
    // Mock login - in real app, this would call API
    setUser({
      firstName: 'John',
      lastName: 'Doe',
      email: email
    });
    setIsAuthModalOpen(false);
    setAppState('dashboard');
    toast({
      title: 'Welcome back!',
      description: 'Successfully logged in to AI Interviewer.',
    });
  };

  const handleRegister = async (email: string, password: string, firstName: string, lastName: string) => {
    // Mock registration - in real app, this would call API
    setUser({
      firstName,
      lastName,
      email
    });
    setIsAuthModalOpen(false);
    setAppState('dashboard');
    toast({
      title: 'Account created!',
      description: 'Welcome to AI Interviewer. Let\'s start practicing!',
    });
  };

  const handleLogout = () => {
    setUser(null);
    setAppState('landing');
    setMessages([]);
    setIsInterviewActive(false);
    toast({
      title: 'Logged out',
      description: 'See you next time!',
    });
  };

  const handleStartInterview = () => {
    setAppState('interview');
    setIsInterviewActive(true);
    
    // Add welcome message from AI
    const welcomeMessage: Message = {
      id: '1',
      type: 'ai',
      content: 'Hello! I\'m your AI interviewer. I\'m here to help you practice and improve your interview skills. Let\'s start with a simple question: Can you tell me a bit about yourself and what brings you here today?',
      timestamp: new Date()
    };
    setMessages([welcomeMessage]);
  };

  const handleSendMessage = async (content: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);

    // Simulate AI thinking
    setIsTyping(true);
    
    // Mock AI response
    setTimeout(() => {
      const responses = [
        'That\'s a great answer! Can you elaborate on a specific challenge you\'ve overcome in your previous role?',
        'Interesting perspective. How do you handle working under pressure or tight deadlines?',
        'Thank you for sharing that. What would you say is your greatest strength and how has it helped you professionally?',
        'I appreciate your honesty. Can you describe a time when you had to learn something new quickly?',
        'Excellent example! How do you typically approach problem-solving in a team environment?'
      ];
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: responses[Math.floor(Math.random() * responses.length)],
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, aiMessage]);
      setIsTyping(false);
    }, 2000);
  };

  const handleViewSession = (sessionId: string) => {
    toast({
      title: 'Session Details',
      description: `Viewing session ${sessionId}. This would show detailed results and feedback.`,
    });
  };

  // Landing Page
  if (appState === 'landing') {
    return (
      <>
        <div className="min-h-screen bg-subtle">
          {/* Header */}
          <header className="bg-card/80 backdrop-blur-sm border-b">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-galaxy p-2 rounded-xl">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-semibold">AI Interviewer</span>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setIsAuthModalOpen(true)}
              >
                Sign In
              </Button>
            </div>
          </header>

          {/* Hero Section */}
          <section className="relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-6 py-20">
              <div className="text-center max-w-4xl mx-auto">
                <div className="inline-flex items-center space-x-2 bg-card/60 backdrop-blur-sm rounded-full px-6 py-2 mb-8 border">
                  <Sparkles className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium">AI-Powered Interview Practice</span>
                </div>
                
                <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  Ace your next interview with AI
                </h1>
                
                <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                  Practice with our advanced AI interviewer. Get personalized feedback, 
                  improve your responses, and build confidence for your dream job.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => setIsAuthModalOpen(true)}
                    size="lg"
                    className="btn-galaxy text-lg px-8 py-4 h-auto"
                  >
                    Start Practicing Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="text-lg px-8 py-4 h-auto"
                  >
                    Watch Demo
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="py-20 bg-card/40 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-bold mb-4">Why Choose AI Interviewer?</h2>
                <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                  Our platform combines cutting-edge AI with proven interview techniques
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-8">
                <div className="text-center p-6">
                  <div className="bg-galaxy p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Bot className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">AI-Powered Conversations</h3>
                  <p className="text-muted-foreground">
                    Practice with our advanced AI that adapts to your responses and provides realistic interview scenarios.
                  </p>
                </div>
                
                <div className="text-center p-6">
                  <div className="bg-galaxy p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Target className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Personalized Feedback</h3>
                  <p className="text-muted-foreground">
                    Get detailed insights on your performance with actionable suggestions for improvement.
                  </p>
                </div>
                
                <div className="text-center p-6">
                  <div className="bg-galaxy p-4 rounded-2xl w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">Track Progress</h3>
                  <p className="text-muted-foreground">
                    Monitor your improvement over time with detailed analytics and performance metrics.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>

        <AuthModal 
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLogin={handleLogin}
          onRegister={handleRegister}
        />
      </>
    );
  }

  // Dashboard
  if (appState === 'dashboard' && user) {
    return (
      <Dashboard
        user={user}
        sessions={mockSessions}
        onStartInterview={handleStartInterview}
        onLogout={handleLogout}
        onViewSession={handleViewSession}
      />
    );
  }

  // Interview Interface
  if (appState === 'interview') {
    return (
      <ChatInterface
        isActive={isInterviewActive}
        onSendMessage={handleSendMessage}
        messages={messages}
        isTyping={isTyping}
      />
    );
  }

  return null;
};

export default Index;
