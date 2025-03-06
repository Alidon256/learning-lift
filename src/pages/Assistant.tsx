
import { useState, useEffect } from "react";
import ChatInterface from "@/components/assistant/ChatInterface";
import { Loader2 } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import NavigationDrawer from "@/components/layout/NavigationDrawer";
import { motion } from "framer-motion";

const Assistant = () => {
  const [loading, setLoading] = useState(true);
  
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
    <>
      <NavigationDrawer />
      
      <motion.div 
        className="container max-w-4xl py-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div 
              className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
              </svg>
            </motion.div>
            <h1 className="text-2xl font-bold">Virtual Study Assistant</h1>
          </div>
          
          <div className="flex gap-3">
            <ThemeToggle />
          </div>
        </div>
        
        <motion.div 
          className="bg-background rounded-xl overflow-hidden border neo-morphism h-[calc(100vh-180px)]"
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
