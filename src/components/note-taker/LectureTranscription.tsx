
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Copy, 
  MessageSquare,
  Brain,
  ListFilter,
  FileDown,
  FilePlus,
  BookText,
  Lightbulb,
  Sparkles
} from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Lecture } from "./LectureLibrary";
import { aiService } from "@/services/AIService";
import { useNavigate } from "react-router-dom";

interface LectureTranscriptionProps {
  lecture: Lecture;
  onUpdateTranscription: (id: string, transcription: string) => void;
  onUpdateSummary: (id: string, summary: string) => void;
}

const LectureTranscription = ({ 
  lecture, 
  onUpdateTranscription,
  onUpdateSummary
}: LectureTranscriptionProps) => {
  const [activeTab, setActiveTab] = useState("transcription");
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(lecture.transcription || "");
  const [isSummarizing, setIsSummarizing] = useState(false);
  const [isGeneratingExpansion, setIsGeneratingExpansion] = useState(false);
  const [expansionTopic, setExpansionTopic] = useState("");
  const [topicExpansion, setTopicExpansion] = useState("");
  const [questionInput, setQuestionInput] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);
  const [relatedTopics, setRelatedTopics] = useState<string[]>([]);
  
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleSaveTranscription = () => {
    onUpdateTranscription(lecture.id, editedText);
    setIsEditing(false);
    toast({
      title: "Transcription updated",
      description: "Your changes have been saved."
    });
  };
  
  const handleCopy = () => {
    navigator.clipboard.writeText(lecture.transcription || "");
    toast({
      title: "Copied to clipboard",
      description: "Transcription has been copied to clipboard."
    });
  };
  
  const handleGenerateSummary = async () => {
    if (!lecture.transcription) {
      toast({
        title: "Cannot summarize",
        description: "There's no transcription to summarize.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSummarizing(true);
    
    try {
      const response = await aiService.generateLectureSummary(lecture.transcription);
      if (response) {
        onUpdateSummary(lecture.id, response.text);
        
        // Also generate related topics for deeper exploration
        const topics = [
          "Historical context of these concepts",
          "Practical applications in industry",
          "Recent research developments",
          "Alternative approaches and methodologies",
          "Advanced topics in this field"
        ];
        
        setRelatedTopics(topics);
        setActiveTab("summary");
        toast({
          title: "Summary generated",
          description: "Your lecture has been summarized."
        });
      } else {
        throw new Error("Failed to generate summary");
      }
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSummarizing(false);
    }
  };
  
  const handleAskQuestion = async () => {
    if (!questionInput.trim()) return;
    
    setIsAnswering(true);
    setAiAnswer("");
    
    try {
      const contextPrompt = `Based on the following lecture transcription: "${lecture.transcription}". 
      
Question: ${questionInput}

Please provide a detailed and accurate answer:`;
      
      const response = await aiService.queryGemini(contextPrompt);
      if (response) {
        setAiAnswer(response.text);
      } else {
        throw new Error("Failed to get an answer");
      }
    } catch (error) {
      console.error("Error getting answer:", error);
      toast({
        title: "Error",
        description: "Failed to get an answer. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsAnswering(false);
    }
  };
  
  const generateTopicExpansion = async (topic: string) => {
    if (!lecture.transcription) return;
    
    setIsGeneratingExpansion(true);
    setExpansionTopic(topic);
    
    try {
      const prompt = `Based on this lecture transcription: "${lecture.transcription}"
      
Please provide an in-depth exploration of the topic: "${topic}"
Include additional resources, references, and deeper explanations to help the student understand this aspect better.`;
      
      const response = await aiService.queryGemini(prompt);
      if (response) {
        setTopicExpansion(response.text);
        setActiveTab("expansion");
      } else {
        throw new Error("Failed to generate topic expansion");
      }
    } catch (error) {
      console.error("Error generating expansion:", error);
      toast({
        title: "Error",
        description: "Failed to generate in-depth explanation.",
        variant: "destructive"
      });
    } finally {
      setIsGeneratingExpansion(false);
    }
  };
  
  const handleExport = (format: "pdf" | "doc") => {
    const content = activeTab === "transcription" 
      ? lecture.transcription 
      : activeTab === "summary" 
        ? lecture.summary 
        : activeTab === "expansion"
          ? topicExpansion
          : "";
    
    if (!content) {
      toast({
        title: "Cannot export",
        description: "There's no content to export.",
        variant: "destructive"
      });
      return;
    }
    
    toast({
      title: `Exporting as ${format.toUpperCase()}`,
      description: "Your document will be downloaded shortly."
    });
    
    // Simulated export
    setTimeout(() => {
      const element = document.createElement("a");
      const file = new Blob([content], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${lecture.title}_${activeTab}.${format}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1000);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{lecture.title}</h2>
          <p className="text-sm text-muted-foreground">{lecture.date} • {lecture.duration}</p>
        </div>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => handleExport("pdf")}
            disabled={!lecture.transcription}
          >
            <FileDown className="h-4 w-4" />
            PDF
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => handleExport("doc")}
            disabled={!lecture.transcription}
          >
            <FilePlus className="h-4 w-4" />
            DOC
          </Button>
        </div>
      </div>
      
      <audio
        src={lecture.audioUrl}
        controls
        className="w-full"
      />
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="transcription" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Transcription
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2" disabled={!lecture.summary}>
            <ListFilter className="h-4 w-4" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="expansion" className="flex items-center gap-2" disabled={!topicExpansion}>
            <Sparkles className="h-4 w-4" />
            Deep Dive
          </TabsTrigger>
          <TabsTrigger value="qa" className="flex items-center gap-2" disabled={!lecture.transcription}>
            <MessageSquare className="h-4 w-4" />
            Q&A
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="transcription" className="space-y-4">
          <div className="flex justify-between">
            <div className="flex gap-2">
              {!isEditing ? (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    disabled={!lecture.transcription}
                  >
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleCopy}
                    disabled={!lecture.transcription}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={handleSaveTranscription}
                  >
                    Save
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setIsEditing(false);
                      setEditedText(lecture.transcription || "");
                    }}
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
            
            {!lecture.summary && (
              <Button
                variant="outline"
                size="sm"
                className="gap-1"
                onClick={handleGenerateSummary}
                disabled={!lecture.transcription || isSummarizing}
              >
                {isSummarizing ? (
                  <>Summarizing...</>
                ) : (
                  <>
                    <Brain className="h-4 w-4" />
                    Generate Summary
                  </>
                )}
              </Button>
            )}
          </div>
          
          {isEditing ? (
            <Textarea
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="min-h-[300px]"
              placeholder="No transcription available yet. Edit to add one manually."
            />
          ) : (
            <Card>
              <CardContent className="p-4">
                <ScrollArea className="h-[calc(100vh-400px)]">
                  {lecture.transcription ? (
                    <p className="whitespace-pre-wrap">{lecture.transcription}</p>
                  ) : (
                    <div className="text-center py-10">
                      <BookText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">No transcription available yet.</p>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="mt-4"
                        onClick={() => setIsEditing(true)}
                      >
                        Add transcription manually
                      </Button>
                    </div>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <ScrollArea className="h-[calc(100vh-500px)]">
                {lecture.summary ? (
                  <div className="space-y-6">
                    <p className="whitespace-pre-wrap">{lecture.summary}</p>
                    
                    {relatedTopics.length > 0 && (
                      <div className="mt-8 border-t pt-4">
                        <h3 className="text-lg font-medium mb-3">Explore Deeper</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {relatedTopics.map((topic, index) => (
                            <Card 
                              key={index} 
                              className="hover:bg-accent/50 transition-colors cursor-pointer"
                              onClick={() => generateTopicExpansion(topic)}
                            >
                              <CardContent className="p-3 flex items-center gap-2">
                                <Lightbulb className="h-5 w-5 text-primary" />
                                <div>
                                  <p className="font-medium text-sm">{topic}</p>
                                  <p className="text-xs text-muted-foreground">Click to learn more</p>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-10">
                    <ListFilter className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No summary available yet.</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="mt-4"
                      onClick={handleGenerateSummary}
                      disabled={!lecture.transcription || isSummarizing}
                    >
                      {isSummarizing ? "Summarizing..." : "Generate summary"}
                    </Button>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="expansion" className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                {expansionTopic}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <ScrollArea className="h-[calc(100vh-400px)]">
                {isGeneratingExpansion ? (
                  <div className="flex flex-col items-center justify-center py-10">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, 0, -5, 0]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                      className="rounded-full bg-primary/10 p-4 mb-4"
                    >
                      <Brain className="h-8 w-8 text-primary" />
                    </motion.div>
                    <p className="text-center text-muted-foreground">Generating in-depth exploration...</p>
                  </div>
                ) : (
                  <p className="whitespace-pre-wrap">{topicExpansion}</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="qa" className="space-y-4">
          <div className="p-4 border rounded-lg">
            <div className="flex gap-2 mb-4">
              <Textarea
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                placeholder="Ask a question about this lecture..."
                className="flex-1"
              />
              <Button
                onClick={handleAskQuestion}
                disabled={!questionInput.trim() || isAnswering}
                className="self-end"
              >
                {isAnswering ? "Thinking..." : "Ask"}
              </Button>
            </div>
            
            {aiAnswer && (
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Brain className="h-5 w-5 text-primary" />
                    Answer
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="max-h-[300px]">
                    <p className="whitespace-pre-wrap">{aiAnswer}</p>
                  </ScrollArea>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LectureTranscription;
