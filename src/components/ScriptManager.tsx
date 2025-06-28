
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Save, RefreshCw } from 'lucide-react';

interface ScriptData {
  id: string;
  name: string;
  prompt: string;
  script: string;
  lastModified: Date;
  modifiedBy: string;
}

interface ScriptManagerProps {
  username: string;
}

export const ScriptManager: React.FC<ScriptManagerProps> = ({ username }) => {
  const [scripts, setScripts] = useState<ScriptData[]>([]);
  const [selectedScript, setSelectedScript] = useState<ScriptData | null>(null);
  const [scriptName, setScriptName] = useState('');
  const [prompt, setPrompt] = useState('');
  const [scriptContent, setScriptContent] = useState('');
  const { toast } = useToast();

  // Load scripts from localStorage on component mount
  useEffect(() => {
    const savedScripts = localStorage.getItem('dev_scripts');
    if (savedScripts) {
      const parsedScripts = JSON.parse(savedScripts).map((script: any) => ({
        ...script,
        lastModified: new Date(script.lastModified)
      }));
      setScripts(parsedScripts);
    } else {
      // Initialize with default script
      const defaultScript: ScriptData = {
        id: 'default',
        name: 'Sales Assistant Script',
        prompt: `You are a confident and persuasive virtual sales manager (Voice Bot) for a fast-moving consumer goods company. Your role is to assist a young salesman named Raj in closing retail deals by addressing tough questions from shopkeepers like Mr. Sharma.`,
        script: `from dotenv import load_dotenv
from livekit import agents
from livekit.agents import AgentSession, Agent, RoomInputOptions
from livekit.plugins import openai, noise_cancellation
from local_tts_plugin import TTS as CustomTTS

load_dotenv()

tts = CustomTTS(
    base_url="http://64.247.196.35:8080",
    model="orpheus",
    voice="alloy",
    sample_rate=24000,
    speed=1.0
)

class Assistant(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="""Your prompt will be inserted here"""
        )`,
        lastModified: new Date(),
        modifiedBy: 'system'
      };
      setScripts([defaultScript]);
      setSelectedScript(defaultScript);
      setScriptName(defaultScript.name);
      setPrompt(defaultScript.prompt);
      setScriptContent(defaultScript.script);
    }
  }, []);

  const saveScript = () => {
    if (!scriptName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a script name",
        variant: "destructive"
      });
      return;
    }

    const scriptData: ScriptData = {
      id: selectedScript?.id || Date.now().toString(),
      name: scriptName,
      prompt: prompt,
      script: scriptContent,
      lastModified: new Date(),
      modifiedBy: username
    };

    const updatedScripts = selectedScript
      ? scripts.map(s => s.id === selectedScript.id ? scriptData : s)
      : [...scripts, scriptData];

    setScripts(updatedScripts);
    setSelectedScript(scriptData);
    
    // Save to localStorage
    localStorage.setItem('dev_scripts', JSON.stringify(updatedScripts));

    toast({
      title: "Script Saved",
      description: `Script "${scriptName}" has been saved successfully`,
    });
  };

  const loadScript = (script: ScriptData) => {
    setSelectedScript(script);
    setScriptName(script.name);
    setPrompt(script.prompt);
    setScriptContent(script.script);
  };

  const createNewScript = () => {
    setSelectedScript(null);
    setScriptName('');
    setPrompt('');
    setScriptContent('');
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Script Management
            <Button onClick={createNewScript} variant="outline">
              New Script
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {scripts.map(script => (
              <Card 
                key={script.id} 
                className={`cursor-pointer transition-colors ${
                  selectedScript?.id === script.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                }`}
                onClick={() => loadScript(script)}
              >
                <CardContent className="p-4">
                  <h4 className="font-medium">{script.name}</h4>
                  <p className="text-sm text-gray-500">
                    Modified by {script.modifiedBy}
                  </p>
                  <p className="text-xs text-gray-400">
                    {script.lastModified.toLocaleDateString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Script Editor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="scriptName">Script Name</Label>
            <Input
              id="scriptName"
              value={scriptName}
              onChange={(e) => setScriptName(e.target.value)}
              placeholder="Enter script name"
            />
          </div>

          <div>
            <Label htmlFor="prompt">AI Prompt</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter the AI prompt/instructions"
              className="min-h-[120px]"
            />
          </div>

          <div>
            <Label htmlFor="script">Python Script</Label>
            <Textarea
              id="script"
              value={scriptContent}
              onChange={(e) => setScriptContent(e.target.value)}
              placeholder="Enter the Python script content"
              className="min-h-[300px] font-mono text-sm"
            />
          </div>

          <Button onClick={saveScript} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Save Script
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
