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
    // Keep context history limited to last 15 messages for better context
    if (this.contextHistory.length > 15) {
      this.contextHistory = this.contextHistory.slice(-15);
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
      
      // For demo purposes - simulate API interaction
      // In production, this would be an actual API call
      /*
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: this.contextHistory.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
          })),
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024,
          },
        }),
      });
      
      const data = await response.json();
      const generatedText = data.candidates[0].content.parts[0].text;
      */
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Enhanced response generation for diverse questions
      let responseText = "";
      const lowerPrompt = prompt.toLowerCase();
      
      if (lowerPrompt.includes("hello") || lowerPrompt.includes("hi")) {
        responseText = "Hello! I'm your AI study assistant powered by Gemini. How can I help with your studies today?";
      } 
      else if (lowerPrompt.includes("how are you")) {
        responseText = "I'm functioning well, thank you for asking! I'm here to assist with any questions or tasks you might have. What can I help you with today?";
      }
      else if (lowerPrompt.includes("help") || lowerPrompt.includes("assist")) {
        responseText = "I'm here to help! I can explain concepts, create study plans, answer questions, or provide resources. What specific topic are you working on?";
      }
      else if (lowerPrompt.includes("explain") || lowerPrompt.includes("what is")) {
        const concept = prompt.replace(/explain|what is|tell me about/gi, "").trim();
        responseText = `I'd be happy to explain ${concept}. Let me break it down for you:\n\n` + 
          `${concept} is a fascinating subject that encompasses several key principles:\n` +
          "1. It involves understanding the fundamental concepts and their relationships\n" +
          "2. Historical context is important for a complete understanding\n" +
          "3. There are practical applications in various fields including science, technology, and daily life\n\n" +
          "Would you like me to elaborate on any specific aspect of this topic?";
      }
      else if (lowerPrompt.includes("math") || lowerPrompt.includes("calculate") || lowerPrompt.includes("equation")) {
        responseText = "For mathematical problems, I can help with:\n\n" +
          "• Basic arithmetic operations\n" +
          "• Algebraic equations and expressions\n" +
          "• Calculus concepts like derivatives and integrals\n" +
          "• Statistics and probability problems\n" +
          "• Geometry and trigonometric functions\n\n" +
          "Could you provide the specific math problem you'd like assistance with?";
      }
      else if (lowerPrompt.includes("science") || lowerPrompt.includes("physics") || lowerPrompt.includes("chemistry") || lowerPrompt.includes("biology")) {
        const field = lowerPrompt.includes("physics") ? "Physics" : 
                      lowerPrompt.includes("chemistry") ? "Chemistry" : 
                      lowerPrompt.includes("biology") ? "Biology" : "Science";
        
        responseText = `Let me help you with your ${field} question.\n\n` +
          `${field} is a vast field with many interconnected concepts. Based on your question, I can provide:\n` +
          "• Clear explanations of fundamental principles\n" +
          "• Examples to illustrate complex concepts\n" +
          "• Step-by-step problem-solving methods\n" +
          "• Connections to real-world applications\n\n" +
          "To give you the most helpful answer, could you specify which particular concept or problem you're working with?";
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
      else if (lowerPrompt.includes("history") || lowerPrompt.includes("historical")) {
        responseText = "I'd be happy to discuss historical topics with you. History provides valuable context for understanding our present world.\n\n" +
          "I can provide information about:\n" +
          "• Key historical events and their significance\n" +
          "• Important historical figures and their contributions\n" +
          "• The development of societies, cultures, and civilizations\n" +
          "• Historical movements and their impacts\n\n" +
          "Which specific historical period or event would you like to explore?";
      }
      else if (lowerPrompt.includes("literature") || lowerPrompt.includes("book") || lowerPrompt.includes("novel") || lowerPrompt.includes("poem")) {
        responseText = "Literature is a rich field for exploration and analysis. I can assist with:\n\n" +
          "• Understanding themes, motifs, and symbolism in literary works\n" +
          "• Analyzing character development and narrative structures\n" +
          "• Exploring historical and cultural contexts of literary works\n" +
          "• Discussing literary movements and their characteristics\n\n" +
          "Which specific literary work or author are you interested in discussing?";
      }
      else {
        responseText = "Thank you for your question about \"" + prompt + "\".\n\n" +
          "I'd be happy to help you with this topic. To provide a comprehensive answer:\n\n" +
          "• The question you've asked touches on important concepts that are worth exploring in detail\n" +
          "• There are multiple perspectives and approaches to consider\n" +
          "• Understanding the fundamentals will help build a stronger knowledge base\n" +
          "• Practical applications can help reinforce theoretical knowledge\n\n" +
          "Could you provide a bit more context about what specific aspects of this topic you're most interested in?";
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
