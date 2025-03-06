import { toast } from "@/components/ui/use-toast";

class AIService {
  private apiKey: string | null = null;
  private contextHistory: Array<{ role: "user" | "assistant", content: string }> = [];
  
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
  
  // Clear context history
  clearHistory() {
    this.contextHistory = [];
  }
  
  // Update context with new messages
  updateContext(role: "user" | "assistant", content: string) {
    this.contextHistory.push({ role, content });
    // Keep context history limited to last 10 messages for performance
    if (this.contextHistory.length > 10) {
      this.contextHistory = this.contextHistory.slice(-10);
    }
  }
  
  // Send a query to Gemini API with context
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
      // Add user message to context
      this.updateContext("user", prompt);
      
      // In real implementation, we would send the context history to get more accurate responses
      console.log("Sending to Gemini API with context:", this.contextHistory);
      console.log("Using API key:", apiKey.substring(0, 4) + "..." + apiKey.substring(apiKey.length - 4));
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simulate different responses based on the prompt
      let responseText = "";
      const lowerPrompt = prompt.toLowerCase();
      
      if (lowerPrompt.includes("hello") || lowerPrompt.includes("hi")) {
        responseText = "Hello! I'm your AI study assistant powered by Gemini. How can I help with your studies today?";
      } 
      else if (lowerPrompt.includes("help") || lowerPrompt.includes("assist")) {
        responseText = "I'm here to help! I can explain concepts, create study plans, answer questions, or provide resources. What specific topic are you working on?";
      }
      else if (lowerPrompt.includes("explain") || lowerPrompt.includes("what is")) {
        responseText = "I'd be happy to explain that concept. Let me break it down for you:\n\n" + 
          "The topic you're asking about involves several key principles:\n" +
          "1. First, it's important to understand the basic fundamentals\n" +
          "2. These principles build on each other progressively\n" +
          "3. Real-world applications help solidify the understanding\n\n" +
          "Would you like me to go deeper into any particular aspect?";
      }
      else if (lowerPrompt.includes("tool") || lowerPrompt.includes("suggested tools")) {
        responseText = "Here are some tools that might help you with your studies:\n\n" +
          "1. **Flashcard Creator** - Generate study flashcards from your notes\n" +
          "2. **Study Planner** - Create a personalized study schedule\n" +
          "3. **Citation Generator** - Format references for your papers\n" +
          "4. **Concept Map Builder** - Visualize connections between concepts\n\n" +
          "Would you like me to tell you more about any of these tools?";
      }
      else if (lowerPrompt.includes("feature") || lowerPrompt.includes("can you")) {
        responseText = "As your study assistant, I can help with several features:\n\n" +
          "• Explain complex concepts in simple terms\n" +
          "• Generate practice questions on any topic\n" +
          "• Provide summaries of academic texts\n" +
          "• Create study guides and outlines\n" +
          "• Help with research and finding sources\n" +
          "• Offer memory techniques and study strategies\n\n" +
          "What would you like assistance with today?";
      }
      else {
        responseText = "Thank you for your question about \"" + prompt + "\". That's an interesting topic to explore.\n\n" +
          "In a fully integrated version with the Gemini API, I would provide a detailed response about this subject, drawing on academic sources and up-to-date information.\n\n" +
          "Is there a specific aspect of this topic you're most interested in learning about?";
      }
      
      // Add assistant response to context
      this.updateContext("assistant", responseText);
      
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
