import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Bot, 
  User, 
  Play, 
  Clock, 
  CheckCircle, 
  TrendingUp, 
  LogOut,
  Calendar,
  Award,
  BarChart3
} from 'lucide-react';

interface Session {
  id: string;
  date: Date;
  duration: number;
  status: 'completed' | 'in-progress' | 'scheduled';
  score?: number;
  feedback?: string;
}

interface DashboardProps {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  sessions: Session[];
  onStartInterview: () => void;
  onLogout: () => void;
  onViewSession: (sessionId: string) => void;
}

export function Dashboard({ user, sessions, onStartInterview, onLogout, onViewSession }: DashboardProps) {
  const completedSessions = sessions.filter(s => s.status === 'completed');
  const averageScore = completedSessions.length > 0 
    ? Math.round(completedSessions.reduce((acc, s) => acc + (s.score || 0), 0) / completedSessions.length)
    : 0;
  
  const totalDuration = completedSessions.reduce((acc, s) => acc + s.duration, 0);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    return `${mins}m`;
  };

  const getStatusColor = (status: Session['status']) => {
    switch (status) {
      case 'completed': return 'bg-success text-white';
      case 'in-progress': return 'bg-warning text-white';
      case 'scheduled': return 'bg-muted text-muted-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b px-6 py-4">
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <div className="flex items-center space-x-3">
            <div className="bg-galaxy p-2 rounded-lg">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold">AI Interviewer</h1>
              <p className="text-sm text-muted-foreground">Practice with confidence</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="font-medium">{user.firstName} {user.lastName}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <Button variant="outline" size="sm" onClick={onLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Welcome Section */}
        <div className="text-center py-8">
          <h2 className="text-3xl font-bold mb-4">
            Welcome back, {user.firstName}! 👋
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
            Ready to sharpen your interview skills? Start a new AI-powered practice session or review your progress.
          </p>
          
          <Button onClick={onStartInterview} className="btn-galaxy text-lg px-8 py-4 h-auto">
            <Play className="w-5 h-5 mr-2" />
            Start New Interview
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Interviews</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{sessions.length}</div>
              <p className="text-xs text-muted-foreground">
                {completedSessions.length} completed
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore}%</div>
              <p className="text-xs text-muted-foreground">
                {completedSessions.length > 0 ? 'Keep improving!' : 'Complete your first interview'}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Practice Time</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatDuration(totalDuration)}</div>
              <p className="text-xs text-muted-foreground">
                Total practice time
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Sessions */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Interview Sessions</CardTitle>
                <CardDescription>
                  Your latest practice sessions and results
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {sessions.length === 0 ? (
              <div className="text-center py-8">
                <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No interviews yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start your first AI interview session to begin tracking your progress.
                </p>
                <Button onClick={onStartInterview} variant="outline">
                  Start First Interview
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {sessions.slice(0, 5).map((session) => (
                  <div 
                    key={session.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    onClick={() => onViewSession(session.id)}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="bg-galaxy p-2 rounded-lg">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <p className="font-medium">
                          Interview Session
                        </p>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <Calendar className="w-3 h-3" />
                          <span>{session.date.toLocaleDateString()}</span>
                          <Clock className="w-3 h-3 ml-2" />
                          <span>{formatDuration(session.duration)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {session.score && (
                        <div className="text-right">
                          <p className="font-semibold">{session.score}%</p>
                          <p className="text-xs text-muted-foreground">Score</p>
                        </div>
                      )}
                      <Badge className={getStatusColor(session.status)}>
                        {session.status === 'completed' && <CheckCircle className="w-3 h-3 mr-1" />}
                        {session.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to help you prepare for interviews
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="justify-start h-auto p-4">
                <TrendingUp className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium">View Progress</p>
                  <p className="text-sm text-muted-foreground">Track your improvement over time</p>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-auto p-4">
                <User className="w-5 h-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Profile Settings</p>
                  <p className="text-sm text-muted-foreground">Update your preferences</p>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}