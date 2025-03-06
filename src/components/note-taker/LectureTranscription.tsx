
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { 
  FileText, 
  Download, 
  BookOpen, 
  Copy, 
  MessageSquare,
  Brain,
  ListFilter,
  FileDown,
  FilePlus,
  BookText
} from "lucide-react";
import { motion } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Lecture } from "./LectureLibrary";
import { aiService } from "@/services/AIService";

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
  const [questionInput, setQuestionInput] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);
  const { toast } = useToast();
  
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
  
  const handleExport = (format: "pdf" | "doc") => {
    const content = activeTab === "transcription" 
      ? lecture.transcription 
      : activeTab === "summary" 
        ? lecture.summary 
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
        <TabsList className="grid grid-cols-3">
          <TabsTrigger value="transcription" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Transcription
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2" disabled={!lecture.summary}>
            <ListFilter className="h-4 w-4" />
            Summary
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
              <ScrollArea className="h-[calc(100vh-400px)]">
                {lecture.summary ? (
                  <p className="whitespace-pre-wrap">{lecture.summary}</p>
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
