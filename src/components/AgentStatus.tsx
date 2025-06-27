
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
}

export const AgentStatus: React.FC<AgentStatusProps> = ({
  isConnected,
  isConnecting
}) => {
  const getStatusConfig = () => {
    if (isConnecting) {
      return {
        label: "Connecting",
        variant: "secondary" as const,
        iconColor: "text-yellow-500",
        animate: "animate-pulse"
      };
    }
    
    if (isConnected) {
      return {
        label: "Connected",
        variant: "default" as const,
        iconColor: "text-green-500",
        animate: ""
      };
    }
    
    return {
      label: "Disconnected",
      variant: "outline" as const,
      iconColor: "text-gray-400",
      animate: ""
    };
  };

  const status = getStatusConfig();

  return (
    <Badge variant={status.variant} className="flex items-center space-x-1">
      <Circle className={cn("w-2 h-2 fill-current", status.iconColor, status.animate)} />
      <span>{status.label}</span>
    </Badge>
  );
};
