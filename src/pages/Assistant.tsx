import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import ChatInterface from "@/components/assistant/ChatInterface";
import { Loader2, Bot, BrainCircuit, Sparkles, BookOpen, Brain, History, BookText } from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import NavigationDrawer from "@/components/layout/NavigationDrawer";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { aiService } from "@/services/AIService";
import { toast } from "@/hooks/use-toast";

interface SuggestedTopic {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface RecommendedDocument {
  id: string;
  title: string;
  source: string;
  url: string;
  snippet: string;
}

const Assistant = () => {
  const [loading, setLoading] = useState(true);
  const [suggestedTopics, setSuggestedTopics] = useState<SuggestedTopic[]>([]);
  const [recommendedDocs, setRecommendedDocs] = useState<RecommendedDocument[]>([]);
  const [viewContext, setViewContext] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  useEffect(() => {
    // Simulate loading of the assistant
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    // Check if there's a context in the location state (e.g., from lecture transcription)
    if (location.state?.context) {
      setViewContext(location.state.context);
      generateSuggestedTopics(location.state.context);
    } else {
      // Default suggested topics
      setSuggestedTopics([
        {
          id: "study_habits",
          title: "Effective Study Techniques",
          description: "Discover methods to improve learning retention and efficiency",
          icon: <Brain className="h-5 w-5 text-purple-500" />
        },
        {
          id: "note_taking",
          title: "Note Taking Methods",
          description: "Compare different note-taking systems like Cornell, mind mapping, and more",
          icon: <BookText className="h-5 w-5 text-blue-500" />
        },
        {
          id: "science_concepts",
          title: "STEM Concepts Explained",
          description: "Get clear explanations of complex science and math topics",
          icon: <BrainCircuit className="h-5 w-5 text-green-500" />
        },
        {
          id: "research_methods",
          title: "Research Methodologies",
          description: "Learn about different approaches to academic research",
          icon: <BookOpen className="h-5 w-5 text-amber-500" />
        }
      ]);
    }
    
    // Default recommended documents
    setRecommendedDocs([
      {
        id: "doc1",
        title: "The Science of Effective Learning",
        source: "Harvard Education",
        url: "https://example.com/effective-learning",
        snippet: "Research shows that spaced repetition and active recall are among the most effective study techniques..."
      },
      {
        id: "doc2",
        title: "Digital Note-Taking: Best Practices",
        source: "MIT Technology Review",
        url: "https://example.com/digital-notes",
        snippet: "The transition to digital note-taking brings both advantages and challenges for students..."
      },
      {
        id: "doc3",
        title: "Memory Formation and Learning",
        source: "Neuroscience Journal",
        url: "https://example.com/memory-formation",
        snippet: "The hippocampus plays a crucial role in converting short-term memories to long-term storage..."
      }
    ]);
    
    return () => clearTimeout(timer);
  }, [location.state]);
  
  const generateSuggestedTopics = async (context: string) => {
    try {
      setIsSearching(true);
      
      // In a real implementation, we would analyze the context and generate relevant topics
      // Here we're using the AI service to generate more intelligent recommendations
      const topicPrompt = `Based on this lecture content: "${context.substring(0, 300)}...", 
        suggest 4 related topics that a student should explore to deepen their understanding.
        For each topic provide: 1) A short title (3-5 words), 2) A brief description (under 15 words).
        Format as JSON with properties: title, description for each topic.`;
        
      const aiResponse = await aiService.queryGemini(topicPrompt);
      
      if (aiResponse && aiResponse.text) {
        try {
          // Try to parse AI response as structured data
          // If it's not valid JSON, we'll use our fallback topics
          const responseText = aiResponse.text;
          
          // Extract JSON part if the AI wrapped it in markdown code blocks
          const jsonMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || 
                          responseText.match(/\[\s*\{[\s\S]*\}\s*\]/);
          
          const jsonStr = jsonMatch ? jsonMatch[1] : responseText;
          
          // Try to parse the JSON
          const aiTopics = JSON.parse(jsonStr);
          
          if (Array.isArray(aiTopics) && aiTopics.length > 0) {
            // Create icon mapping for the AI-generated topics
            const icons = [
              <BrainCircuit className="h-5 w-5 text-purple-500" />,
              <BookText className="h-5 w-5 text-blue-500" />,
              <BookOpen className="h-5 w-5 text-green-500" />,
              <Brain className="h-5 w-5 text-amber-500" />
            ];
            
            // Map AI topics to our format
            const formattedTopics: SuggestedTopic[] = aiTopics.slice(0, 4).map((topic: any, i: number) => ({
              id: `ai_topic_${i}`,
              title: topic.title || "Explore this topic",
              description: topic.description || "AI suggested topic for deeper understanding",
              icon: icons[i % icons.length]
            }));
            
            setSuggestedTopics(formattedTopics);
            
            // Also generate recommended documents
            generateRecommendedDocs(context, formattedTopics);
          } else {
            // Fallback to default topics
            setDefaultContextTopics();
          }
        } catch (e) {
          console.error("Error parsing AI topic suggestions:", e);
          setDefaultContextTopics();
        }
      } else {
        setDefaultContextTopics();
      }
    } catch (error) {
      console.error("Error generating topics:", error);
      setDefaultContextTopics();
    } finally {
      setIsSearching(false);
    }
  };
  
  const setDefaultContextTopics = () => {
    setSuggestedTopics([
      {
        id: "related_concepts",
        title: "Explore Related Concepts",
        description: "Dive deeper into the topics mentioned in your lecture",
        icon: <BrainCircuit className="h-5 w-5 text-purple-500" />
      },
      {
        id: "study_questions",
        title: "Generate Study Questions",
        description: "Create practice questions based on lecture content",
        icon: <BookText className="h-5 w-5 text-blue-500" />
      },
      {
        id: "key_terms",
        title: "Define Key Terminology",
        description: "Get clear definitions of important terms from the lecture",
        icon: <BookOpen className="h-5 w-5 text-green-500" />
      },
      {
        id: "historical_context",
        title: "Historical Context",
        description: "Understand the historical development of these concepts",
        icon: <History className="h-5 w-5 text-amber-500" />
      }
    ]);
  };
  
  const generateRecommendedDocs = async (context: string, topics: SuggestedTopic[]) => {
    try {
      const topicTitles = topics.map(t => t.title).join(", ");
      
      const docsPrompt = `Based on these topics: ${topicTitles} from a lecture about: "${context.substring(0, 200)}...",
        suggest 3 academic resources a student should read.
        For each resource provide: 1) A title, 2) The source (journal/institution), 3) A brief snippet describing the content.
        Format as JSON with properties: title, source, snippet for each resource.`;
        
      const aiResponse = await aiService.queryGemini(docsPrompt);
      
      if (aiResponse && aiResponse.text) {
        try {
          // Extract JSON part if the AI wrapped it in markdown code blocks
          const jsonMatch = aiResponse.text.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || 
                         aiResponse.text.match(/\[\s*\{[\s\S]*\}\s*\]/);
          
          const jsonStr = jsonMatch ? jsonMatch[1] : aiResponse.text;
          
          // Try to parse the JSON
          const aiDocs = JSON.parse(jsonStr);
          
          if (Array.isArray(aiDocs) && aiDocs.length > 0) {
            // Map AI docs to our format
            const formattedDocs: RecommendedDocument[] = aiDocs.slice(0, 3).map((doc: any, i: number) => ({
              id: `ai_doc_${i}`,
              title: doc.title || "Recommended Resource",
              source: doc.source || "Academic Source",
              url: `https://example.com/resource-${i}`,
              snippet: doc.snippet || "AI recommended academic resource for this topic"
            }));
            
            setRecommendedDocs(formattedDocs);
          }
        } catch (e) {
          console.error("Error parsing AI doc recommendations:", e);
          // Keep default docs
        }
      }
    } catch (error) {
      console.error("Error generating recommended docs:", error);
      // Keep default docs
    }
  };
  
  const handleTopicClick = (topic: SuggestedTopic) => {
    toast({
      title: "Asking about " + topic.title,
      description: "Generating response about this topic..."
    });
    
    // Use the AI service to generate a response about this topic
    aiService.queryGemini(`Tell me about ${topic.title}. ${topic.description}`);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <NavigationDrawer />
        <motion.div 
          className="text-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div 
            className="mx-auto mb-6 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              repeatType: "loop"
            }}
          >
            <BrainCircuit className="h-8 w-8 text-primary" />
          </motion.div>
          <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Loading your AI assistant...</p>
          <p className="text-sm text-muted-foreground mt-2">Powered by Gemini</p>
        </motion.div>
      </div>
    );
  }
  
  return (
    <>
      <NavigationDrawer />
      
      <motion.div 
        className="container max-w-6xl py-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div 
          className="flex items-center justify-between mb-4"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
        >
          <div className="flex items-center gap-3">
            <motion.div 
              className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <BrainCircuit className="h-6 w-6" />
            </motion.div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold">Smart Study Assistant</h1>
                <Badge className="bg-primary/20 text-primary hover:bg-primary/30">Gemini</Badge>
                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-200">2.0</Badge>
              </div>
              <p className="text-sm text-muted-foreground">Ask any question about your studies or get help with assignments</p>
            </div>
          </div>
          
          <div className="flex gap-3 items-center">
            <Button 
              variant="outline"
              size="sm"
              className="gap-2"
              onClick={() => navigate('/note-taker')}
            >
              <Sparkles className="h-4 w-4" />
              Note Taker
            </Button>
            <ThemeToggle />
          </div>
        </motion.div>
        
        {viewContext && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="mb-4"
          >
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Bot className="h-4 w-4 text-primary" />
                  Working with lecture content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  The AI assistant is using your lecture transcript as context. Ask questions specifically about this content.
                </p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-xs mt-2"
                  onClick={() => setViewContext("")}
                >
                  Clear context
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <motion.div 
            className="lg:col-span-3 bg-background rounded-xl overflow-hidden border shadow-lg neo-morphism h-[calc(100vh-180px)]"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <ChatInterface />
          </motion.div>
          
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Card>
              <CardHeader className="pb-2 flex flex-row justify-between items-center">
                <CardTitle className="text-sm">Suggested Topics</CardTitle>
                {isSearching && <Loader2 className="h-3 w-3 animate-spin" />}
              </CardHeader>
              <CardContent className="space-y-2">
                {suggestedTopics.map(topic => (
                  <motion.div
                    key={topic.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => handleTopicClick(topic)}
                    >
                      <CardContent className="p-3 flex items-start gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                          {topic.icon}
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{topic.title}</h3>
                          <p className="text-xs text-muted-foreground">{topic.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
                
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="w-full mt-1 text-xs"
                  onClick={() => {
                    toast({
                      title: "Generating new suggestions",
                      description: "Finding personalized topic suggestions..."
                    });
                    
                    // Generate new topics randomly or based on past interactions
                    // In a real app this would be more intelligent
                    const subjects = ["Physics", "Chemistry", "Biology", "Mathematics", "History", "Literature"];
                    const randomSubject = subjects[Math.floor(Math.random() * subjects.length)];
                    
                    aiService.queryGemini(`Generate 4 interesting study topics related to ${randomSubject} that would be useful for a student`)
                      .then((response) => {
                        if (response && response.text) {
                          // This would trigger UI refresh with new topics
                          toast({
                            title: "New suggestions ready",
                            description: `Check out topics related to ${randomSubject}`
                          });
                        }
                      });
                  }}
                >
                  Refresh suggestions
                </Button>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Recommended Documents</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {recommendedDocs.map(doc => (
                  <div key={doc.id} className="space-y-1">
                    <a 
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-medium hover:text-primary transition-colors"
                    >
                      {doc.title}
                    </a>
                    <p className="text-xs text-muted-foreground">{doc.snippet}</p>
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-[10px] h-4">
                        {doc.source}
                      </Badge>
                    </div>
                    {doc.id !== recommendedDocs[recommendedDocs.length - 1].id && (
                      <Separator className="my-2" />
                    )}
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default Assistant;
