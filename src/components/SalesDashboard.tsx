import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { VoiceController } from '@/components/VoiceController';
import { AgentStatus } from '@/components/AgentStatus';
import { TranscriptDisplay } from '@/components/TranscriptDisplay';
import { AgentPanel } from '@/components/AgentPanel';
import { DeveloperAuth } from '@/components/DeveloperAuth';
import { DeveloperDashboard } from '@/components/DeveloperDashboard';
import { useToast } from '@/hooks/use-toast';
import { Room, RoomEvent, Track } from 'livekit-client';
import { Settings } from 'lucide-react';

export interface SalesOffer {
  productName: string;
  price: string;
  margin: string;
  description: string;
}

export interface AgentConfig {
  instructions: string;
  personality: string;
  goals: string[];
}

export interface TranscriptEntry {
  id: string;
  speaker: 'user' | 'agent';
  text: string;
  timestamp: Date;
}

export const SalesDashboard = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showDeveloperAuth, setShowDeveloperAuth] = useState(false);
  const [developerUser, setDeveloperUser] = useState<string | null>(null);
  
  const [currentOffer] = useState<SalesOffer>({
    productName: "Premium CRM Suite",
    price: "$299/month",
    margin: "65%",
    description: "Complete customer relationship management solution with AI insights"
  });
  
  const [agentConfig] = useState<AgentConfig>({
    instructions: "You are a confident and persuasive virtual sales manager. Your goal is to understand customer needs, present compelling value propositions, and guide prospects toward making purchasing decisions. Always be professional, empathetic, and solution-focused.",
    personality: "Professional, confident, solution-oriented",
    goals: [
      "Identify customer pain points",
      "Present value propositions clearly",
      "Handle objections effectively",
      "Guide toward purchase decision"
    ]
  });

  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [userInput, setUserInput] = useState('');
  const [room, setRoom] = useState<Room | null>(null);
  const { toast } = useToast();

  // Check for existing developer session
  useEffect(() => {
    const savedUser = localStorage.getItem('dev_user');
    if (savedUser) {
      setDeveloperUser(savedUser);
    }
  }, []);

  const handleDeveloperLogin = (username: string) => {
    setDeveloperUser(username);
    setShowDeveloperAuth(false);
  };

  const handleDeveloperLogout = () => {
    localStorage.removeItem('dev_user');
    setDeveloperUser(null);
  };

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
          agentConfig,
          currentOffer
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

  // Show developer dashboard if logged in
  if (developerUser) {
    return (
      <DeveloperDashboard 
        username={developerUser} 
        onLogout={handleDeveloperLogout}
      />
    );
  }

  // Show developer authentication modal
  if (showDeveloperAuth) {
    return <DeveloperAuth onLogin={handleDeveloperLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Sales Assistant</h1>
            <p className="text-gray-600">LiveKit-powered conversational sales agent</p>
          </div>
          <Button 
            onClick={() => setShowDeveloperAuth(true)}
            variant="outline"
            size="sm"
          >
            <Settings className="w-4 h-4 mr-2" />
            Developer
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-3 space-y-6">
            {/* Voice Controller */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Voice Interaction
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

            {/* Transcript */}
            <Card className="flex-1">
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <AgentPanel 
              agentConfig={agentConfig}
              currentOffer={currentOffer}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
