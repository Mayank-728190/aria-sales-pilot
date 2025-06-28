
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScriptManager } from '@/components/ScriptManager';
import { VoiceController } from '@/components/VoiceController';
import { TranscriptDisplay } from '@/components/TranscriptDisplay';
import { AgentStatus } from '@/components/AgentStatus';
import { TranscriptEntry } from '@/components/SalesDashboard';
import { LogOut, Code, Mic, FileText } from 'lucide-react';

interface DeveloperDashboardProps {
  username: string;
  onLogout: () => void;
}

export const DeveloperDashboard: React.FC<DeveloperDashboardProps> = ({
  username,
  onLogout
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);

  const handleStartCall = async () => {
    setIsConnecting(true);
    
    // Simulate connection for demo
    setTimeout(() => {
      setIsConnected(true);
      setIsConnecting(false);
      addToTranscript('agent', 'Developer mode: AI Sales Assistant connected');
    }, 2000);
  };

  const handleEndCall = async () => {
    setIsConnected(false);
  };

  const addToTranscript = (speaker: 'user' | 'agent', text: string) => {
    const newEntry: TranscriptEntry = {
      id: Date.now().toString(),
      speaker,
      text,
      timestamp: new Date()
    };
    setTranscript(prev => [...prev, newEntry]);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Developer Dashboard</h1>
            <p className="text-gray-600">Welcome back, {username}</p>
          </div>
          <Button onClick={onLogout} variant="outline">
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <Tabs defaultValue="scripts" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="scripts" className="flex items-center">
              <Code className="w-4 h-4 mr-2" />
              Script Manager
            </TabsTrigger>
            <TabsTrigger value="voice" className="flex items-center">
              <Mic className="w-4 h-4 mr-2" />
              Voice Testing
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center">
              <FileText className="w-4 h-4 mr-2" />
              Live Scripts
            </TabsTrigger>
          </TabsList>

          <TabsContent value="scripts">
            <ScriptManager username={username} />
          </TabsContent>

          <TabsContent value="voice" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Voice Interaction Testing
                  <AgentStatus 
                    isConnected={isConnected} 
                    isConnecting={isConnecting} 
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VoiceController
                  isConnected={isConnected}
                  isConnecting={isConnecting}
                  onStartCall={handleStartCall}
                  onEndCall={handleEndCall}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Live Transcript</CardTitle>
              </CardHeader>
              <CardContent>
                <TranscriptDisplay transcript={transcript} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs">
            <Card>
              <CardHeader>
                <CardTitle>Live Scripts & Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm min-h-[400px]">
                  <div className="space-y-2">
                    <div>[{new Date().toLocaleTimeString()}] System: Developer dashboard initialized</div>
                    <div>[{new Date().toLocaleTimeString()}] User: {username} logged in</div>
                    <div>[{new Date().toLocaleTimeString()}] Scripts: Loaded from localStorage</div>
                    {isConnected && (
                      <div>[{new Date().toLocaleTimeString()}] LiveKit: Agent connected</div>
                    )}
                    {transcript.map(entry => (
                      <div key={entry.id}>
                        [{entry.timestamp.toLocaleTimeString()}] {entry.speaker}: {entry.text}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};
