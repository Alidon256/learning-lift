
import React, { useState, useRef, useEffect } from "react";
import { aiService } from "@/services/AIService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  BarChart,
  RefreshCw
} from "lucide-react";
import ChatMessage from "./ChatMessage";
import { toast } from "@/components/ui/use-toast";
import ApiKeyDialog from "./ApiKeyDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { motion, AnimatePresence } from "framer-motion";
import { SuggestedTool, SuggestedTools } from "./SuggestedTools";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface SuggestedDocument {
  id: string;
  title: string;
  source: string;
  url: string;
  snippet: string;
}

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showApiKeyDialog, setShowApiKeyDialog] = useState(!aiService.hasApiKey());
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const [suggestedTopics, setSuggestedTopics] = useState<{id: string; title: string; prompt: string}[]>([]);
  const [suggestedDocs, setSuggestedDocs] = useState<SuggestedDocument[]>([]);
  const [isFetchingSuggestions, setIsFetchingSuggestions] = useState(false);
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
    {
      id: "history",
      name: "Historical Context",
      description: "Learn about the historical background of any topic",
      icon: History,
      prompt: "Explain the historical development of calculus",
      category: "History"
    },
    {
      id: "analysis",
      name: "Data Analysis",
      description: "Get help analyzing and interpreting data",
      icon: BarChart,
      prompt: "Help me interpret these survey results",
      category: "Data"
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

  const generateSuggestedTopics = async (userInput: string, aiResponse: string) => {
    setIsFetchingSuggestions(true);
    
    try {
      // In a real implementation, we would call an API to get related topics based on the conversation
      // Here, we'll simulate it with some sample topics
      const suggestions = [
        { id: "t1", title: "Related mathematical concepts", prompt: `Explain the mathematical concepts related to: ${userInput}` },
        { id: "t2", title: "Historical development", prompt: `Describe the historical development of: ${userInput}` },
        { id: "t3", title: "Practical applications", prompt: `What are the practical applications of: ${userInput}` },
        { id: "t4", title: "Common misconceptions", prompt: `What are common misconceptions about: ${userInput}` }
      ];
      
      setSuggestedTopics(suggestions);
      
      // Simulate fetching recommended documents
      const docs = [
        {
          id: "d1",
          title: `Understanding ${userInput.split(' ').slice(0, 3).join(' ')}...`,
          source: "Khan Academy",
          url: "https://www.khanacademy.org",
          snippet: "This comprehensive guide explains the fundamental concepts and applications..."
        },
        {
          id: "d2",
          title: `Advanced ${userInput.split(' ').slice(0, 2).join(' ')} Tutorial`,
          source: "MIT OpenCourseWare",
          url: "https://ocw.mit.edu",
          snippet: "Designed for advanced students, this resource covers complex topics and practical examples..."
        },
        {
          id: "d3",
          title: `${userInput.split(' ').slice(0, 2).join(' ')} for Beginners`,
          source: "Coursera",
          url: "https://www.coursera.org",
          snippet: "Start your learning journey with this beginner-friendly introduction to key concepts..."
        }
      ];
      
      setSuggestedDocs(docs);
    } catch (error) {
      console.error("Error generating suggestions:", error);
    } finally {
      setIsFetchingSuggestions(false);
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
        
        // Generate suggested topics and documents based on conversation
        generateSuggestedTopics(input, response.text);
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
    setSuggestedTopics([]);
    setSuggestedDocs([]);
  };

  const handleToolSelect = (prompt: string) => {
    setInput(prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleSuggestedTopicSelect = (prompt: string) => {
    setInput(prompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const toggleSpeechRecognition = () => {
    setIsListening(!isListening);
  };

  const refreshSuggestions = () => {
    if (messages.length < 2) return;
    
    const lastUserMessage = messages.filter(m => m.role === "user").pop();
    const lastBotMessage = messages.filter(m => m.role === "assistant").pop();
    
    if (lastUserMessage && lastBotMessage) {
      generateSuggestedTopics(lastUserMessage.content, lastBotMessage.content);
    }
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
      
      {/* Suggested Topics and Documents Sidebar (built into the same component) */}
      {(suggestedTopics.length > 0 || suggestedDocs.length > 0) && messages.length > 1 && (
        <motion.div 
          className="border-t p-3 bg-muted/20 space-y-4 max-h-[300px] overflow-auto"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium">Related to your conversation</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={refreshSuggestions}
              disabled={isFetchingSuggestions}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className="h-3.5 w-3.5" />
            </Button>
          </div>
          
          {suggestedTopics.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">Suggested Topics</h4>
              <div className="flex flex-wrap gap-2">
                {suggestedTopics.map(topic => (
                  <Button
                    key={topic.id}
                    variant="outline"
                    size="sm"
                    className="text-xs h-7 bg-background/80"
                    onClick={() => handleSuggestedTopicSelect(topic.prompt)}
                  >
                    {topic.title}
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {suggestedDocs.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-xs font-medium text-muted-foreground">Recommended Resources</h4>
              <div className="space-y-2">
                {suggestedDocs.map(doc => (
                  <Card key={doc.id} className="overflow-hidden">
                    <CardContent className="p-2 text-xs space-y-1">
                      <a 
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium hover:text-primary transition-colors line-clamp-1"
                      >
                        {doc.title}
                      </a>
                      <p className="text-muted-foreground text-[11px] line-clamp-2">{doc.snippet}</p>
                      <Badge variant="outline" className="text-[10px] h-4">
                        {doc.source}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default ChatInterface;
