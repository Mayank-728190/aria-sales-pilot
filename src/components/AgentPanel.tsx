
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Bot, Target, DollarSign, TrendingUp } from 'lucide-react';
import { AgentConfig, SalesOffer } from '@/components/SalesDashboard';

interface AgentPanelProps {
  agentConfig: AgentConfig;
  currentOffer: SalesOffer;
}

export const AgentPanel: React.FC<AgentPanelProps> = ({
  agentConfig,
  currentOffer
}) => {
  return (
    <div className="space-y-6">
      {/* Agent Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span>Agent Config</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">Instructions</h4>
            <p className="text-sm text-gray-600 leading-relaxed">
              {agentConfig.instructions}
            </p>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">Personality</h4>
            <Badge variant="outline">{agentConfig.personality}</Badge>
          </div>
          
          <Separator />
          
          <div>
            <h4 className="font-medium text-sm text-gray-700 mb-2">Goals</h4>
            <div className="space-y-1">
              {agentConfig.goals.map((goal, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Target className="w-3 h-3 text-green-500" />
                  <span className="text-sm text-gray-600">{goal}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Offer */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <DollarSign className="w-5 h-5" />
            <span>Active Offer</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">
              {currentOffer.productName}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {currentOffer.description}
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <DollarSign className="w-5 h-5 text-blue-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-blue-900">Price</p>
              <p className="text-lg font-bold text-blue-600">
                {currentOffer.price}
              </p>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <TrendingUp className="w-5 h-5 text-green-600 mx-auto mb-1" />
              <p className="text-sm font-medium text-green-900">Margin</p>
              <p className="text-lg font-bold text-green-600">
                {currentOffer.margin}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Session Stats</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Duration</span>
              <span className="font-medium">00:00:00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Messages</span>
              <span className="font-medium">0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Engagement</span>
              <Badge variant="outline" className="text-xs">Starting</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
