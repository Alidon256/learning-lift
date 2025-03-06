
import { useState, useEffect } from "react";
import ChatInterface from "@/components/assistant/ChatInterface";
import { Loader2, Bot, BrainCircuit, Sparkles } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import NavigationDrawer from "@/components/layout/NavigationDrawer";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Assistant = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Simulate loading of the assistant
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="mx-auto mb-6 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <BrainCircuit className="h-8 w-8 text-primary" />
          </motion.div>
          <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Loading your AI assistant...</p>
          <p className="text-sm text-muted-foreground mt-2">Powered by Gemini</p>
        </motion.div>
      </div>
    );
  }
  
  return (
    <>
      <NavigationDrawer />
      
      <motion.div 
        className="container max-w-5xl py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex items-center justify-between mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="flex items-center gap-3">
            <motion.div 
              className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <BrainCircuit className="h-6 w-6" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold">Smart Study Assistant</h1>
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Gemini</Badge>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-200">2.0</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Ask any question about your studies or get help with assignments</p>
            </div>
          </div>
          
          <div className="flex gap-3 items-center">
            <Button 
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => navigate('/note-taker')}
            >
              <Sparkles className="h-4 w-4" />
              Note Taker
            </Button>
            <ThemeToggle />
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-background rounded-xl overflow-hidden border shadow-lg neo-morphism h-[calc(100vh-180px)]"
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <ChatInterface />
        </motion.div>
      </motion.div>
    </>
  );
};

export default Assistant;
