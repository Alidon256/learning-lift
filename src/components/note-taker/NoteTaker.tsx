
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Mic, Home, Sun, Moon } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";

const NoteTaker = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState("transcription");
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  
  const handleRecording = () => {
    if (!isRecording) {
      // Request microphone permission
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setIsRecording(true);
          toast({
            title: "Recording started",
            description: "Your lecture is now being recorded and transcribed in real-time.",
          });
        })
        .catch(err => {
          console.error("Error accessing microphone:", err);
          toast({
            title: "Cannot access microphone",
            description: "Please check your browser permissions.",
            variant: "destructive"
          });
        });
    } else {
      setIsRecording(false);
      toast({
        title: "Recording stopped",
        description: "Your lecture recording has been saved successfully.",
      });
    }
  };
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary animate-pulse-soft">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Lecture Note Taker</h1>
            <p className="text-sm text-muted-foreground">Record, transcribe, and interact with your lectures</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          <Button variant="outline" size="icon" aria-label="Go to home" asChild>
            <a href="/">
              <Home className="h-5 w-5" />
            </a>
          </Button>
          
          <Button 
            onClick={handleRecording} 
            className={isRecording ? "bg-red-500 hover:bg-red-600" : ""}
          >
            <Mic className="h-5 w-5 mr-2" />
            {isRecording ? "Stop Recording" : "Start Recording"}
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="transcription" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full max-w-md mx-auto">
          <TabsTrigger value="transcription" className="flex-1">Transcription</TabsTrigger>
          <TabsTrigger value="q&a" className="flex-1">Q&A</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transcription" className="animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 neo-morphism min-h-[400px] flex items-center justify-center">
            {isRecording ? (
              <div className="text-center animate-pulse-soft">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Mic className="h-8 w-8 text-primary" />
                </div>
                <p className="text-lg font-medium">Recording in progress...</p>
                <p className="text-sm text-muted-foreground">Your lecture is being transcribed in real-time</p>
              </div>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <p className="text-lg font-medium">No transcription yet. Start recording a lecture to begin.</p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="q&a" className="animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 neo-morphism min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <svg className="h-8 w-8 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-lg font-medium">Start recording a lecture to ask questions about the content.</p>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default NoteTaker;
