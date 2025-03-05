
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
      // This is a placeholder - in a real implementation, 
      // this would make an actual API call to Gemini
      console.log("Would send to Gemini API:", prompt);
      console.log("Using API key:", apiKey.substring(0, 4) + "..." + apiKey.substring(apiKey.length - 4));
      
      // Simulate API response
      return {
        text: "This is a simulated response. In the actual implementation, this would be a response from the Gemini API based on your prompt: " + prompt,
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
