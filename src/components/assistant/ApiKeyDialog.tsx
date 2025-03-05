
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { aiService } from "@/services/AIService";
import { toast } from "@/components/ui/use-toast";
import { Key } from "lucide-react";

interface ApiKeyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ApiKeyDialog = ({ open, onOpenChange }: ApiKeyDialogProps) => {
  const [apiKey, setApiKey] = useState(aiService.getApiKey() || "");

  const handleSaveApiKey = () => {
    if (!apiKey.trim()) {
      toast({
        title: "API Key Required",
        description: "Please enter your Gemini API key.",
        variant: "destructive",
      });
      return;
    }

    aiService.setApiKey(apiKey.trim());
    toast({
      title: "API Key Saved",
      description: "Your Gemini API key has been saved successfully.",
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Key className="h-5 w-5 text-primary" />
            Gemini API Key Setup
          </DialogTitle>
          <DialogDescription>
            Enter your Gemini API key to enable AI functionality.
            You can get a key from the Google AI Studio.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Your API key is stored locally and is never sent to our servers.
            </p>
            <Input
              type="password"
              placeholder="Enter your Gemini API key..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="font-mono"
            />
          </div>
          <div className="bg-muted p-3 rounded-md">
            <p className="text-xs text-muted-foreground">
              To get a Gemini API key:
              <ol className="list-decimal list-inside mt-1 space-y-1">
                <li>Visit <a href="https://ai.google.dev/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Google AI Studio</a></li>
                <li>Create a new project</li>
                <li>Navigate to API Keys section</li>
                <li>Generate a new API key</li>
              </ol>
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSaveApiKey}>
            Save API Key
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApiKeyDialog;
