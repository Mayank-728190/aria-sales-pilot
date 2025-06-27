
import React, { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { TranscriptEntry } from '@/components/SalesDashboard';

interface TranscriptDisplayProps {
  transcript: TranscriptEntry[];
}

export const TranscriptDisplay: React.FC<TranscriptDisplayProps> = ({
  transcript
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [transcript]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (transcript.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-gray-500">
        <div className="text-center">
          <p className="text-lg font-medium">No conversation yet</p>
          <p className="text-sm">Start a voice session to see the live transcript</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="h-64 w-full">
      <div className="space-y-4 p-2">
        {transcript.map((entry) => (
          <div
            key={entry.id}
            className={cn(
              "flex flex-col space-y-1",
              entry.speaker === 'user' ? "items-end" : "items-start"
            )}
          >
            <div className="flex items-center space-x-2">
              <Badge
                variant={entry.speaker === 'user' ? "default" : "secondary"}
                className="text-xs"
              >
                {entry.speaker === 'user' ? 'You' : 'AI Agent'}
              </Badge>
              <span className="text-xs text-gray-500">
                {formatTime(entry.timestamp)}
              </span>
            </div>
            
            <div
              className={cn(
                "max-w-[80%] p-3 rounded-lg text-sm",
                entry.speaker === 'user'
                  ? "bg-blue-500 text-white rounded-br-none"
                  : "bg-gray-100 text-gray-900 rounded-bl-none"
              )}
            >
              {entry.text}
            </div>
          </div>
        ))}
        <div ref={scrollRef} />
      </div>
    </ScrollArea>
  );
};
