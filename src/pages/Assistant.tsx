
import { useState, useEffect } from "react";
import ChatInterface from "@/components/assistant/ChatInterface";
import { Loader2, Sun, Moon, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

const Assistant = () => {
  const [loading, setLoading] = useState(true);
  const { theme, setTheme } = useTheme();
  
  useEffect(() => {
    // Simulate loading of the assistant
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Loading your AI assistant...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container max-w-4xl py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold">Virtual Study Assistant</h1>
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
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden border neo-morphism h-[calc(100vh-180px)]">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Assistant;
