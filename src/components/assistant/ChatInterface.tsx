
import React, { useState, useRef, useEffect } from "react";
import { aiService } from "@/services/AIService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Mic, 
  Send, 
  Bot, 
  User, 
  Settings, 
  Plus, 
  Sparkles, 
  Book, 
  Brain, 
  FileText, 
  CalendarClock,
  BookText,
  GraduationCap,
  Calculator,
  Lightbulb,
  History,
  BookOpen,
  Dices,
  BarChart
} from "lucide-react";
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
  const [isListening, setIsListening] = useState(false);
  const chatBoxRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const suggestedTools: SuggestedTool[] = [
    {
      id: "flashcards",
      name: "Create Flashcards",
      description: "Generate study flashcards from your notes or topics",
      icon: FileText,
      prompt: "Create flashcards for me about photosynthesis",
      category: "Study"
    },
    {
      id: "summarize",
      name: "Summarize Text",
      description: "Get a concise summary of a complex text",
      icon: BookText,
      prompt: "Summarize the key concepts of quantum mechanics",
      isPopular: true,
      category: "Learning"
    },
    {
      id: "explain",
      name: "Explain Concept",
      description: "Get a simple explanation of a complex concept", 
      icon: Brain,
      prompt: "Explain the concept of neural networks in simple terms",
      isPopular: true,
      category: "Learning"
    },
    {
      id: "studyplan",
      name: "Create Study Plan",
      description: "Generate a personalized study schedule",
      icon: CalendarClock,
      prompt: "Create a study plan for my upcoming calculus exam",
      category: "Planning"
    },
    {
      id: "practice",
      name: "Practice Questions",
      description: "Generate practice questions on any topic",
      icon: Dices,
      prompt: "Create 5 practice questions about organic chemistry",
      category: "Practice"
    },
    {
      id: "research",
      name: "Research Helper",
      description: "Get help finding sources and information",
      icon: BookOpen,
      prompt: "Help me find good sources for my essay on climate change",
      category: "Research"
    },
    {
      id: "math",
      name: "Math Problem Solver",
      description: "Get step-by-step solutions to math problems",
      icon: Calculator,
      prompt: "Help me solve this equation: 2x + 5 = 13",
      category: "Problem"
    },
    {
      id: "insights",
      name: "Learning Insights",
      description: "Get insights on how to improve your learning",
      icon: Lightbulb,
      prompt: "Give me tips to improve my study habits and retention",
      isPopular: true,
      category: "Tips"
    },
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

  useEffect(() => {
    // Auto-focus the textarea when loaded
    if (textareaRef.current && aiService.hasApiKey()) {
      textareaRef.current.focus();
    }
  }, []);

  // Handle speech recognition
  useEffect(() => {
    let recognition: SpeechRecognition | null = null;
    
    if (isListening) {
      try {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        
        recognition.onresult = (event) => {
          const transcript = Array.from(event.results)
            .map(result => result[0])
            .map(result => result.transcript)
            .join('');
          
          setInput(transcript);
        };
        
        recognition.onerror = (event) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          toast({
            title: "Speech Recognition Error",
            description: "There was a problem with speech recognition. Please try again.",
            variant: "destructive",
          });
        };
        
        recognition.start();
      } catch (error) {
        console.error('Speech recognition not supported', error);
        setIsListening(false);
        toast({
          description: "Speech recognition is not supported in your browser.",
          variant: "destructive",
        });
      }
    }
    
    return () => {
      if (recognition) {
        recognition.stop();
      }
    };
  }, [isListening]);

  const scrollToBottom = () => {
    chatBoxRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    // Auto resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
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
    
    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

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
      setIsListening(false);
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
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const toggleSpeechRecognition = () => {
    setIsListening(!isListening);
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
        <div className="flex items-end space-x-2">
          <Textarea
            ref={textareaRef}
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={aiService.hasApiKey() ? "Ask me anything..." : "Set up API key first..."}
            className="flex-grow resize-none rounded-full pl-4 pr-12 py-3 min-h-[50px] max-h-[120px]"
            disabled={isTyping || !aiService.hasApiKey()}
          />
          <div className="flex space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant={isListening ? "default" : "outline"}
                    size="icon"
                    className={`rounded-full w-10 h-10 p-0 flex items-center justify-center ${isListening ? 'bg-red-500 hover:bg-red-600' : ''}`}
                    onClick={toggleSpeechRecognition}
                    disabled={!aiService.hasApiKey() || isTyping}
                  >
                    <Mic className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{isListening ? "Stop listening" : "Voice input"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    onClick={handleSendMessage} 
                    disabled={isTyping || !input.trim() || !aiService.hasApiKey()}
                    className="rounded-full w-10 h-10 p-0 flex items-center justify-center"
                    size="icon"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Send message</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        
        {isListening && (
          <div className="mt-2 text-xs text-center animate-pulse text-primary">
            Listening... Speak clearly into your microphone
          </div>
        )}
        
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
