
import { useState, useRef, useEffect } from "react";
import { Send, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChatMessage from "./ChatMessage";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

const initialMessages: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    content: "Hello! I'm your Study Assistant. How can I help you with your learning today?",
    timestamp: "01:14 PM"
  }
];

const ChatInterface = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  // Focus input on load
  useEffect(() => {
    inputRef.current?.focus();
  }, []);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputValue.trim()) return;
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInputValue("");
    setIsProcessing(true);
    
    // Simulate AI response after a delay
    setTimeout(() => {
      // Example response based on user query
      let responseContent = "";
      const lcQuery = inputValue.toLowerCase();
      
      if (lcQuery.includes("photosynthesis")) {
        responseContent = "Photosynthesis is the process by which green plants, algae, and some bacteria convert light energy, usually from the sun, into chemical energy in the form of glucose or other sugars. This process occurs in the chloroplasts and involves chlorophyll, which absorbs light energy. The basic equation is: 6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂";
      } else if (lcQuery.includes("quantum mechanics")) {
        responseContent = "Quantum mechanics is a fundamental theory in physics that describes nature at the smallest scales of energy levels of atoms and subatomic particles. It's characterized by principles like wave-particle duality, superposition, and quantum entanglement. Would you like me to explain a specific concept within quantum mechanics?";
      } else if (lcQuery.includes("machine learning") || lcQuery.includes("ml")) {
        responseContent = "Machine Learning is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed. It focuses on developing algorithms that can access data and use it to learn patterns and make predictions. Key approaches include supervised learning, unsupervised learning, and reinforcement learning.";
      } else {
        responseContent = "That's an interesting question! To provide you with the most helpful response, I'd need to research this topic further. In a fully implemented system, I would connect to reliable academic sources to give you accurate information. Is there something specific about this topic you'd like to explore?";
      }
      
      const assistantMessage: Message = {
        id: Date.now().toString(),
        role: "assistant",
        content: responseContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      setIsProcessing(false);
    }, 1000);
  };
  
  const toggleRecording = () => {
    if (!isRecording) {
      // Request microphone permission
      navigator.mediaDevices.getUserMedia({ audio: true })
        .then(() => {
          setIsRecording(true);
          toast({
            title: "Voice recording started",
            description: "Speak clearly into your microphone.",
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
      // Simulate transcription
      setInputValue("Tell me about machine learning algorithms");
      toast({
        title: "Voice recording stopped",
        description: "Your speech has been transcribed.",
      });
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        
        {isProcessing && (
          <div className="flex gap-3 mb-6">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary" />
            </div>
            <div className="p-4 rounded-2xl rounded-tl-none bg-secondary text-secondary-foreground neo-morphism max-w-[80%]">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <div className="text-xs text-muted-foreground mb-2">
          Try asking: "Explain the concept of photosynthesis" or "Find resources about quantum mechanics"
        </div>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask me any study-related question..."
            className="flex-1"
            disabled={isProcessing}
          />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={toggleRecording}
            className={isRecording ? "bg-primary text-primary-foreground" : ""}
          >
            {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
          </Button>
          <Button type="submit" size="icon" disabled={!inputValue.trim() || isProcessing}>
            <Send className="h-5 w-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;
