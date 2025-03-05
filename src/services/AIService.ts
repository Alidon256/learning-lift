
import { toast } from "@/components/ui/use-toast";

class AIService {
  private apiKey: string | null = null;
  
  // Set API key for Gemini
  setApiKey(key: string) {
    this.apiKey = key;
    localStorage.setItem('gemini_api_key', key);
    return true;
  }
  
  // Get API key from localStorage
  getApiKey() {
    if (this.apiKey) return this.apiKey;
    
    const storedKey = localStorage.getItem('gemini_api_key');
    if (storedKey) {
      this.apiKey = storedKey;
      return storedKey;
    }
    
    return null;
  }
  
  // Clear API key
  clearApiKey() {
    this.apiKey = null;
    localStorage.removeItem('gemini_api_key');
  }
  
  // Check if API key is set
  hasApiKey() {
    return !!this.getApiKey();
  }
  
  // Send a query to Gemini API
  async queryGemini(prompt: string) {
    const apiKey = this.getApiKey();
    
    if (!apiKey) {
      toast({
        title: "API Key Missing",
        description: "Please set your Gemini API key in settings.",
        variant: "destructive",
      });
      return null;
    }
    
    try {
      // For actual implementation, we would use the real Gemini API
      // This is a placeholder that simulates a response
      console.log("Sending to Gemini API:", prompt);
      console.log("Using API key:", apiKey.substring(0, 4) + "..." + apiKey.substring(apiKey.length - 4));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate different responses based on the prompt
      let responseText = "";
      
      if (prompt.toLowerCase().includes("hello") || prompt.toLowerCase().includes("hi")) {
        responseText = "Hello! How can I help with your studies today?";
      } 
      else if (prompt.toLowerCase().includes("help") || prompt.toLowerCase().includes("assist")) {
        responseText = "I'm here to help! I can explain concepts, create study plans, answer questions, or provide resources. What specific topic are you working on?";
      }
      else if (prompt.toLowerCase().includes("explain") || prompt.toLowerCase().includes("what is")) {
        responseText = "I'd be happy to explain that concept. Let me break it down for you:\n\n" + 
          "The topic you're asking about involves several key principles:\n" +
          "1. First, it's important to understand the basic fundamentals\n" +
          "2. These principles build on each other progressively\n" +
          "3. Real-world applications help solidify the understanding\n\n" +
          "Would you like me to go deeper into any particular aspect?";
      }
      else {
        responseText = "Thank you for your question about \"" + prompt + "\". That's an interesting topic to explore. While I'm currently operating in simulation mode, in a fully integrated version, I would connect to the Gemini API to provide a detailed and helpful response about this subject. Would you like to know more about a specific aspect of this topic?";
      }
      
      return {
        text: responseText,
      };
    } catch (error) {
      console.error("Error querying Gemini:", error);
      toast({
        title: "API Error",
        description: "Failed to get a response from Gemini API.",
        variant: "destructive",
      });
      return null;
    }
  }
  
  // Generate lecture summaries
  async generateLectureSummary(transcript: string) {
    return this.queryGemini(`Summarize the following lecture transcript and highlight key points, concepts, and terminology:\n\n${transcript}`);
  }
  
  // Generate study questions
  async generateStudyQuestions(topic: string) {
    return this.queryGemini(`Generate 5 comprehensive study questions about ${topic} that would be suitable for a university-level exam.`);
  }
  
  // Explain complex topics
  async explainConcept(concept: string) {
    return this.queryGemini(`Explain the concept of ${concept} in simple terms, then provide a more advanced explanation with examples.`);
  }
}

export const aiService = new AIService();
