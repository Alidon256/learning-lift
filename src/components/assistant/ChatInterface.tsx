
import React, { useState, useRef, useEffect } from "react";
import { aiService } from "@/services/AIService";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Mic, Send, Bot, User, Settings, Plus } from "lucide-react";
import ChatMessage from "./ChatMessage";
import { toast } from "@/components/ui/use-toast";
import ApiKeyDialog from "./ApiKeyDialog";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
  const chatBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Welcome message
    if (messages.length === 0 && aiService.hasApiKey()) {
      const welcomeMessage: Message = {
        id: "welcome",
        role: "assistant",
        content: "Hi there! I'm your virtual study assistant. How can I help you today? You can ask me questions about your studies, request explanations of concepts, or get help with assignments.",
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
  };

  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-2 flex items-center justify-between bg-muted/30">
        <div className="text-sm font-medium flex items-center gap-2">
          <Bot className="h-4 w-4 text-primary" />
          AI Assistant
        </div>
        <div className="flex gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8" 
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
                  className="h-8 w-8" 
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
      </div>

      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isTyping && (
          <div className="chat-message assistant">
            <div className="message-content">
              <Bot className="inline-block h-4 w-4 mr-1" />
              Thinking...
            </div>
          </div>
        )}
        <div ref={chatBoxRef} />
      </div>

      <div className="p-4 border-t bg-background">
        <div className="flex items-center space-x-2">
          <Textarea
            rows={1}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={aiService.hasApiKey() ? "Type your message..." : "Set up API key first..."}
            className="flex-grow resize-none"
            disabled={isTyping || !aiService.hasApiKey()}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isTyping || !input.trim()}
            className="transition-all duration-300 hover:scale-105"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
        {!aiService.hasApiKey() && (
          <p className="text-xs text-muted-foreground mt-2 animate-pulse">
            Please set up your Gemini API key in settings to enable chat functionality.
          </p>
        )}
      </div>

      <ApiKeyDialog 
        open={showApiKeyDialog} 
        onOpenChange={setShowApiKeyDialog} 
      />
    </div>
  );
};

export default ChatInterface;
