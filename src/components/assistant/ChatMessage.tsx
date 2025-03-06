
import { useState, useEffect } from "react";
import { Bot, User, Copy, Check, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface ChatMessageProps {
  message: {
    id: string;
    role: "user" | "assistant";
    content: string;
    timestamp: string;
  };
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const [copied, setCopied] = useState(false);
  const isUser = message.role === "user";
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  // Format timestamp for display
  const formattedTime = (() => {
    try {
      const date = new Date(message.timestamp);
      return date.toLocaleTimeString(undefined, { 
        hour: '2-digit', 
        minute: '2-digit'
      });
    } catch (e) {
      return '';
    }
  })();
  
  // Simulate typing effect for assistant messages
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  useEffect(() => {
    if (message.role === "assistant") {
      setIsTyping(true);
      let i = 0;
      const typingSpeed = Math.max(10, Math.min(30, 800 / Math.sqrt(message.content.length)));
      
      const interval = setInterval(() => {
        setDisplayedText(message.content.substring(0, i));
        i++;
        if (i > message.content.length) {
          clearInterval(interval);
          setIsTyping(false);
        }
      }, typingSpeed);
      
      return () => clearInterval(interval);
    } else {
      setDisplayedText(message.content);
    }
  }, [message.content, message.role]);
  
  const messageVariants = {
    hidden: isUser ? { x: 20, opacity: 0 } : { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.3 } },
  };
  
  return (
    <motion.div 
      className={cn(
        "flex gap-3 mb-6",
        isUser ? "justify-end" : "justify-start"
      )}
      variants={messageVariants}
      initial="hidden"
      animate="visible"
    >
      {!isUser && (
        <motion.div 
          className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Bot className="h-4 w-4 text-primary" />
        </motion.div>
      )}
      
      <motion.div 
        className={cn(
          "max-w-[80%] p-4 rounded-2xl group transition-all duration-300",
          isUser 
            ? "bg-primary text-primary-foreground rounded-tr-none hover:bg-primary/90" 
            : "bg-secondary text-secondary-foreground rounded-tl-none neo-morphism hover:shadow-md"
        )}
        whileHover={{ scale: 1.01 }}
      >
        <div className="flex flex-col">
          <div className="flex justify-between items-start">
            <div className="font-semibold text-sm flex items-center gap-1.5">
              {isUser ? (
                <>
                  <span>You</span>
                </>
              ) : (
                <>
                  <span>Study Assistant</span>
                  <span className="text-xs bg-primary/20 text-primary px-1.5 py-0.5 rounded-full">AI</span>
                </>
              )}
            </div>
            {formattedTime && (
              <div className="text-xs opacity-70 ml-2">{formattedTime}</div>
            )}
          </div>
          
          <div className="mt-1 text-sm whitespace-pre-wrap">
            {isUser ? message.content : displayedText}
            {isTyping && !isUser && (
              <span className="inline-block w-1 h-4 ml-1 bg-current animate-pulse"></span>
            )}
          </div>
          
          {!isUser && (
            <motion.button 
              onClick={copyToClipboard}
              className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 self-end p-1 rounded-full hover:bg-background/20"
              aria-label="Copy to clipboard"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </motion.button>
          )}
        </div>
      </motion.div>
      
      {isUser && (
        <motion.div 
          className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          <User className="h-4 w-4 text-primary-foreground" />
        </motion.div>
      )}
    </motion.div>
  );
};

export default ChatMessage;
