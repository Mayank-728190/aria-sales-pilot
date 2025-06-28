
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScriptManager } from '@/components/ScriptManager';
import { VoiceController } from '@/components/VoiceController';
import { TranscriptDisplay } from '@/components/TranscriptDisplay';
import { AgentStatus } from '@/components/AgentStatus';
import { TranscriptEntry } from '@/components/SalesDashboard';
import { useToast } from '@/hooks/use-toast';
import { Room, RoomEvent, Track } from 'livekit-client';
import { LogOut } from 'lucide-react';

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
  const [userInput, setUserInput] = useState('');
  const [room, setRoom] = useState<Room | null>(null);
  const { toast } = useToast();

  const handleStartCall = async () => {
    setIsConnecting(true);
    
    try {
      // Simulate API call to start LiveKit session
      const response = await fetch('/start-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentConfig: { instructions: localStorage.getItem('active_ai_prompt') || '' }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to start call session');
      }

      const { token, wsUrl } = await response.json();
      
      // Initialize LiveKit room
      const newRoom = new Room();
      
      newRoom.on(RoomEvent.Connected, () => {
        console.log('Connected to LiveKit room');
        setIsConnected(true);
        setIsConnecting(false);
        toast({
          title: "Session Started",
          description: "Connected to AI Sales Agent",
        });
      });

      newRoom.on(RoomEvent.Disconnected, () => {
        console.log('Disconnected from LiveKit room');
        setIsConnected(false);
        setRoom(null);
        toast({
          title: "Session Ended",
          description: "Disconnected from AI Sales Agent",
          variant: "destructive"
        });
      });

      newRoom.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        if (track.kind === Track.Kind.Audio && participant.identity === 'agent') {
          // Handle agent audio
          const audioElement = track.attach();
          document.body.appendChild(audioElement);
        }
      });

      await newRoom.connect(wsUrl, token);
      setRoom(newRoom);
      
      // Add initial greeting to transcript
      addToTranscript('agent', 'Hello! I\'m your AI Sales Assistant. How can I help you today?');
      
    } catch (error) {
      console.error('Failed to start call:', error);
      setIsConnecting(false);
      
      // For demo purposes, simulate a successful connection
      setTimeout(() => {
        setIsConnected(true);
        setIsConnecting(false);
        addToTranscript('agent', 'Hello! I\'m your AI Sales Assistant. How can I help you today?');
        toast({
          title: "Demo Mode",
          description: "Connected to simulated AI Sales Agent",
        });
      }, 2000);
    }
  };

  const handleEndCall = async () => {
    if (room) {
      await room.disconnect();
    } else {
      // Demo mode disconnect
      setIsConnected(false);
      toast({
        title: "Session Ended",
        description: "Disconnected from AI Sales Agent",
        variant: "destructive"
      });
    }
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

  const handleSendMessage = () => {
    if (!userInput.trim()) return;
    
    addToTranscript('user', userInput);
    
    // Simulate agent response (in real implementation, this would be handled by LiveKit)
    setTimeout(() => {
      const responses = [
        "I understand your concern. Let me explain how our solution addresses that specific challenge.",
        "That's a great question! Our Premium CRM Suite actually helps with exactly that issue.",
        "I can see why that would be important to your business. Here's how we handle that...",
        "Excellent point. Many of our clients had the same consideration before making the switch."
      ];
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      addToTranscript('agent', randomResponse);
    }, 1000);
    
    setUserInput('');
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Script Manager */}
          <div className="space-y-6">
            <ScriptManager username={username} />
          </div>

          {/* Right Column - Voice Testing & Live Scripts */}
          <div className="space-y-6">
            {/* Voice Controller */}
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

            {/* Live Transcript */}
            <Card>
              <CardHeader>
                <CardTitle>Live Transcript</CardTitle>
              </CardHeader>
              <CardContent>
                <TranscriptDisplay transcript={transcript} />
              </CardContent>
            </Card>

            {/* Text Input */}
            <Card>
              <CardHeader>
                <CardTitle>Send Message</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Input
                    placeholder="Type a message or question..."
                    value={userInput}
                    onChange={(e) => setUserInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    disabled={!isConnected}
                  />
                  <Button 
                    onClick={handleSendMessage}
                    disabled={!isConnected || !userInput.trim()}
                  >
                    Send
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Live Scripts & Logs */}
            <Card>
              <CardHeader>
                <CardTitle>Live Scripts & Logs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 text-green-400 p-4 rounded-lg font-mono text-sm min-h-[300px]">
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
          </div>
        </div>
      </div>
    </div>
  );
};
