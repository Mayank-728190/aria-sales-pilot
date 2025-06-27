
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Phone, PhoneOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoiceControllerProps {
  isConnected: boolean;
  isConnecting: boolean;
  onStartCall: () => void;
  onEndCall: () => void;
}

export const VoiceController: React.FC<VoiceControllerProps> = ({
  isConnected,
  isConnecting,
  onStartCall,
  onEndCall
}) => {
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);

  // Simulate voice activity detection
  useEffect(() => {
    if (!isConnected) return;

    const interval = setInterval(() => {
      setIsListening(Math.random() > 0.7); // Random voice activity simulation
    }, 2000);

    return () => clearInterval(interval);
  }, [isConnected]);

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <div className="flex flex-col items-center space-y-6">
      {/* Main Control Button */}
      <div className="relative">
        {!isConnected ? (
          <Button
            onClick={onStartCall}
            disabled={isConnecting}
            size="lg"
            className={cn(
              "w-20 h-20 rounded-full text-white shadow-lg transition-all duration-300",
              isConnecting 
                ? "bg-yellow-500 hover:bg-yellow-600 animate-pulse" 
                : "bg-green-500 hover:bg-green-600 hover:scale-105"
            )}
          >
            {isConnecting ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Phone className="w-8 h-8" />
            )}
          </Button>
        ) : (
          <Button
            onClick={onEndCall}
            size="lg"
            className="w-20 h-20 rounded-full bg-red-500 hover:bg-red-600 text-white shadow-lg transition-all duration-300 hover:scale-105"
          >
            <PhoneOff className="w-8 h-8" />
          </Button>
        )}
        
        {/* Voice Activity Indicator */}
        {isConnected && isListening && (
          <div className="absolute -inset-2 rounded-full border-4 border-blue-400 animate-ping opacity-75" />
        )}
      </div>

      {/* Status Text */}
      <div className="text-center">
        <p className="text-lg font-medium text-gray-900">
          {isConnecting && "Connecting to Agent..."}
          {isConnected && "Connected - Speak Naturally"}
          {!isConnected && !isConnecting && "Start Voice Session"}
        </p>
        <p className="text-sm text-gray-600 mt-1">
          {isConnecting && "Please wait while we establish connection"}
          {isConnected && "The AI agent is listening and ready to help"}
          {!isConnected && !isConnecting && "Click to begin conversation with AI sales agent"}
        </p>
      </div>

      {/* Mic Controls */}
      {isConnected && (
        <div className="flex items-center space-x-4">
          <Button
            onClick={toggleMute}
            variant={isMuted ? "destructive" : "outline"}
            size="sm"
            className="flex items-center space-x-2"
          >
            {isMuted ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{isMuted ? "Unmute" : "Mute"}</span>
          </Button>
          
          <div className="flex items-center space-x-2">
            <div className={cn(
              "w-3 h-3 rounded-full transition-colors duration-300",
              isListening ? "bg-green-500 animate-pulse" : "bg-gray-300"
            )} />
            <span className="text-sm text-gray-600">
              {isListening ? "Listening..." : "Silent"}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
