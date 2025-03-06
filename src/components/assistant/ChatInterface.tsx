
import React, { useState, useRef, useEffect } from "react";
import { aiService } from "@/services/AIService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Mic, Send, Bot, User, Settings, Plus, Sparkles, Book, Brain, FileText, CalendarClock } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { toast } from "@/components/ui/use-toast";
import ApiKeyDialog from "./ApiKeyDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { SuggestedTool, SuggestedTools } from "./SuggestedTools";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(!aiService.hasApiKey());
  const [showSuggestions, setShowSuggestions] = useState(true);
  const chatBoxRef = useRef<HTMLDivElement>(null);

  const suggestedTools: SuggestedTool[] = [
    {
      id: "flashcards",
      name: "Create Flashcards",
      description: "Generate study flashcards from your notes or topics",
      icon: FileText,
      prompt: "Create flashcards for me about photosynthesis"
    },
    {
      id: "summarize",
      name: "Summarize Text",
      description: "Get a concise summary of a complex text",
      icon: Book,
      prompt: "Summarize the key concepts of quantum mechanics"
    },
    {
      id: "explain",
      name: "Explain Concept",
      description: "Get a simple explanation of a complex concept", 
      icon: Brain,
      prompt: "Explain the concept of neural networks in simple terms"
    },
    {
      id: "studyplan",
      name: "Create Study Plan",
      description: "Generate a personalized study schedule",
      icon: CalendarClock,
      prompt: "Create a study plan for my upcoming calculus exam"
    }
  ];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message
    if (messages.length === 0 && aiService.hasApiKey()) {
      const welcomeMessage: Message = {
        id: "welcome",
        role: "assistant",
        content: "Hi there! I'm your virtual study assistant powered by Gemini AI. How can I help you today? You can ask me questions about your studies, request explanations of concepts, or get help with assignments.",
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
    }
  }, [messages]);

  const scrollToBottom = () => {
    chatBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    if (!aiService.hasApiKey()) {
      setShowApiKeyDialog(true);
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString() + "-user",
      role: "user",
      content: input,
      timestamp: new Date().toISOString(),
    };

    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput("");
    setIsTyping(true);
    setShowSuggestions(false);

    try {
      const response = await aiService.queryGemini(input);
      if (response) {
        const botMessage: Message = {
          id: Date.now().toString() + "-bot",
          role: "assistant",
          content: response.text,
          timestamp: new Date().toISOString(),
        };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
      } else {
        toast({
          title: "Error",
          description: "Failed to get response from the AI.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast({
        title: "Error",
        description: "There was an error communicating with the server.",
        variant: "destructive",
      });
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    aiService.clearHistory();
    setShowSuggestions(true);
  };

  const handleToolSelect = (prompt: string) => {
    setInput(prompt);
    setShowSuggestions(false);
  };

  return (
    <div className="flex flex-col h-full">
      <motion.div 
        className="border-b p-2 flex items-center justify-between bg-muted/30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-sm font-medium flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          <span>AI Assistant</span>
          <span className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">Gemini</span>
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 hover:bg-primary/10 transition-all" 
                  onClick={clearChat}
                >
                  <Plus className="h-4 w-4 rotate-45" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>New chat</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 hover:bg-primary/10 transition-all" 
                  onClick={() => setShowApiKeyDialog(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>API settings</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </motion.div>

      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <ChatMessage message={message} />
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="chat-message assistant"
          >
            <div className="message-content">
              <Bot className="inline-block h-4 w-4 mr-1" />
              Thinking...
            </div>
          </motion.div>
        )}
        
        <AnimatePresence>
          {showSuggestions && messages.length <= 1 && !isTyping && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="my-4"
            >
              <SuggestedTools tools={suggestedTools} onSelect={handleToolSelect} />
            </motion.div>
          )}
        </AnimatePresence>
        
        <div ref={chatBoxRef} />
      </div>

      <motion.div 
        className="p-4 border-t bg-background"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.3 }}
      >
        <div className="flex items-center space-x-2">
          <Textarea
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={aiService.hasApiKey() ? "Type your message..." : "Set up API key first..."}
            className="flex-grow resize-none rounded-full pl-4 pr-12 py-3"
            disabled={isTyping || !aiService.hasApiKey()}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isTyping || !input.trim()}
            className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {!aiService.hasApiKey() && (
          <p className="text-xs text-muted-foreground mt-2 animate-pulse">
            Please set up your Gemini API key in settings to enable chat functionality.
          </p>
        )}
      </motion.div>

      <ApiKeyDialog 
        open={showApiKeyDialog} 
        onOpenChange={setShowApiKeyDialog} 
      />
    </div>
  );
};

export default ChatInterface;
