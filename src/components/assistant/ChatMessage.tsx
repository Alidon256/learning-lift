
import { useState, useEffect } from "react";
import { Bot, User, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

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
  
  // Simulate typing effect for assistant messages
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    if (message.role === "assistant") {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(message.content.substring(0, i));
        i++;
        if (i > message.content.length) {
          clearInterval(interval);
        }
      }, 10); // Speed of typing
      
      return () => clearInterval(interval);
    } else {
      setDisplayedText(message.content);
    }
  }, [message.content, message.role]);
  
  return (
    <div className={cn(
      "flex gap-3 mb-6 animate-slide-in",
      isUser ? "justify-end" : "justify-start"
    )}>
      {!isUser && (
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
          <Bot className="h-4 w-4 text-primary" />
        </div>
      )}
      
      <div className={cn(
        "max-w-[80%] p-4 rounded-2xl group",
        isUser 
          ? "bg-primary text-primary-foreground rounded-tr-none" 
          : "bg-secondary text-secondary-foreground rounded-tl-none neo-morphism"
      )}>
        <div className="flex flex-col">
          <div className="flex justify-between items-start">
            <div className="font-semibold text-sm">
              {isUser ? "You" : "Study Assistant"}
            </div>
            <div className="text-xs opacity-70">{message.timestamp}</div>
          </div>
          
          <div className="mt-1 text-sm">
            {isUser ? message.content : displayedText}
          </div>
          
          {!isUser && (
            <button 
              onClick={copyToClipboard}
              className="opacity-0 group-hover:opacity-100 transition-opacity mt-2 self-end p-1 rounded-full hover:bg-background/20"
              aria-label="Copy to clipboard"
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </button>
          )}
        </div>
      </div>
      
      {isUser && (
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
          <User className="h-4 w-4 text-primary-foreground" />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;
