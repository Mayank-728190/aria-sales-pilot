
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
      
      // Load the first script by default
      if (parsedScripts.length > 0) {
        const firstScript = parsedScripts[0];
        setSelectedScript(firstScript);
        setScriptName(firstScript.name);
        setPrompt(firstScript.prompt);
      }
    } else {
      // Initialize with default script
      const defaultScript: ScriptData = {
        id: 'default',
        name: 'Sales Assistant Script',
        prompt: `You are a confident and persuasive virtual sales manager (Voice Bot) for a fast-moving consumer goods company. Your role is to assist a young salesman named Raj in closing retail deals by addressing tough questions from shopkeepers like Mr. Sharma.

**Instructions:**

1. **Role Dynamics:**
   - Step in smoothly when Raj hesitates or when Mr. Sharma raises objections.
   - Speak like a real person — use conversational expressions such as "dekhiye Sharma ji", "yeh ek golden opportunity hai", and "aapke jaise premium retailer ke liye".

2. **Highlight Product USPs:**
   - Emphasize product unique selling points such as new flavors, bold packaging, regional trends, and social proof.
   - Present impact statistics including percentage growth, product ratings, repeat orders, and online buzz.

3. **Market Benefits:**
   - Discuss high visibility, geo-promotion, and in-store branding advantages.
   - Promote the offer, focusing on combo deals, cashback options, risk-free buyback, and exclusive margins.

4. **Building Trust:**
   - Make Mr. Sharma feel valued and in control throughout the conversation.

5. **Characters Dynamics:**
   - Raj (Salesman): Young, energetic, and eager to learn.
   - Mr. Sharma (Shopkeeper): Experienced, skeptical, and looking for value.
   - You (Voice Bot): Expert sales closer communicating through Raj's phone.

6. **Scene Setting:**
   - The conversation takes place in a Delhi kirana store, with Raj pitching a new variant of chips/snacks.

7. **Objection Handling Triggers:**
   - If Mr. Sharma expresses doubt about demand, use region-specific data, online buzz, and examples of peer store adoption.
   - For space concerns, provide information on rotation rate and high-turnover assurance.
   - If margin concerns arise, showcase percentage margins, cashback offers, and buyback options.
   - Address brand trust by discussing the company's legacy, product trials, and early reviews.

8. **Response Closure:**
   - End each response with a sense of confidence and gratitude, encouraging Raj to close the sale gracefully.`,
        lastModified: new Date(),
        modifiedBy: 'system'
      };
      setScripts([defaultScript]);
      setSelectedScript(defaultScript);
      setScriptName(defaultScript.name);
      setPrompt(defaultScript.prompt);
      
      // Save to localStorage immediately
      localStorage.setItem('dev_scripts', JSON.stringify([defaultScript]));
      
      // Also save as active prompt for frontend use
      localStorage.setItem('active_ai_prompt', defaultScript.prompt);
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
    
    // Save as active prompt for frontend use
    localStorage.setItem('active_ai_prompt', prompt);

    toast({
      title: "Script Saved",
      description: `Script "${scriptName}" has been saved and is now active in the frontend`,
    });
  };

  const loadScript = (script: ScriptData) => {
    setSelectedScript(script);
    setScriptName(script.name);
    setPrompt(script.prompt);
  };

  const createNewScript = () => {
    setSelectedScript(null);
    setScriptName('');
    setPrompt('');
  };

  return (
    <div className="space-y-6">
      {/* Script Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            AI Prompt Management
            <Button onClick={createNewScript} variant="outline" size="sm">
              New Script
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scripts.map(script => (
              <div 
                key={script.id} 
                className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                  selectedScript?.id === script.id ? 'bg-blue-50 border-blue-300' : 'hover:bg-gray-50'
                }`}
                onClick={() => loadScript(script)}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium text-sm">{script.name}</h4>
                    <p className="text-xs text-gray-500">
                      Modified by {script.modifiedBy} on {script.lastModified.toLocaleDateString()}
                    </p>
                  </div>
                  {selectedScript?.id === script.id && (
                    <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                      Active
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Script Editor */}
      <Card>
        <CardHeader>
          <CardTitle>AI Prompt Editor</CardTitle>
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
            <Label htmlFor="prompt">AI Prompt Instructions</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter the AI prompt/instructions that will be used by the voice bot"
              className="min-h-[400px] font-mono text-sm"
            />
          </div>

          <Button onClick={saveScript} className="w-full" size="lg">
            <Save className="w-4 h-4 mr-2" />
            Save & Activate Prompt
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
