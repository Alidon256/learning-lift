
import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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
import jsPDF from "jspdf";
import { Packer, Document, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";

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
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [exportFormat, setExportFormat] = useState<"pdf" | "doc">("pdf");
  const [exportFileName, setExportFileName] = useState(lecture.title || "lecture");
  
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
      // Improved prompt for better summarization
      const summaryPrompt = `Please provide a detailed and well-structured summary of the following lecture transcript. Break it down into:
      
1. Key Concepts: The main ideas and theories discussed
2. Important Points: Specific facts, examples, or case studies mentioned
3. Connections: How these ideas relate to each other or to the broader field
4. Technical Terms: Any specialized vocabulary with brief definitions
5. Potential Applications: How this knowledge might be applied in practice
      
Transcript: "${lecture.transcription}"
      
Format your response with clear headings and bullet points where appropriate. Focus on accuracy and educational value.`;
      
      const response = await aiService.generateLectureSummary(summaryPrompt);
      if (response) {
        onUpdateSummary(lecture.id, response.text);
        
        // Generate related topics for deeper exploration
        const topicsPrompt = `Based on this lecture transcript: "${lecture.transcription}"
        
Generate 5 specific related topics that would help a student deepen their understanding of this material. For each topic, provide a descriptive title that clearly indicates what the student will learn about. Topics should be diverse and cover different aspects of the lecture material, including theoretical foundations, practical applications, historical context, current research, and related fields.`;
        
        const topicsResponse = await aiService.queryGemini(topicsPrompt);
        if (topicsResponse) {
          // Parse out topics from the response
          const topicsText = topicsResponse.text;
          const topics = topicsText
            .split(/\d\./)
            .filter(line => line.trim().length > 0)
            .map(line => line.trim())
            .slice(0, 5);
          
          setRelatedTopics(topics);
        }
        
        setActiveTab("summary");
        toast({
          title: "Summary generated",
          description: "Your lecture has been summarized with improved detail and structure."
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
      const contextPrompt = `As an educational assistant, please answer the following question based on this lecture transcript. 

Lecture: "${lecture.transcription}"

Question: ${questionInput}

Please provide a detailed and accurate answer that directly addresses the question. Include specific information from the transcript where relevant, and clarify any concepts that might need additional explanation. If the question cannot be fully answered based on the transcript alone, provide what information you can from the transcript and then suggest what additional information might be needed.`;
      
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
      const prompt = `Based on this lecture transcript: "${lecture.transcription}"
      
Please provide an in-depth exploration of the topic: "${topic}"

Structure your response as follows:
1. Overview: A brief introduction to this specific aspect of the lecture
2. Key Concepts: Detailed explanations of the main ideas
3. Examples and Applications: Real-world examples showing how these concepts are applied
4. Current Research: Recent developments or ongoing research in this area
5. Related Concepts: How this topic connects to other ideas in the field
6. Learning Resources: Specific books, articles, videos, or courses that would help students learn more about this topic

Format your response with clear headings and use examples where appropriate. Focus on making complex ideas accessible while maintaining academic rigor.`;
      
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
  
  const handleExport = () => {
    setShowExportDialog(true);
  };
  
  const getActiveContent = () => {
    switch (activeTab) {
      case "transcription":
        return lecture.transcription || "";
      case "summary":
        return lecture.summary || "";
      case "expansion":
        return topicExpansion || "";
      case "qa":
        return `Question: ${questionInput}\n\nAnswer: ${aiAnswer}`;
      default:
        return "";
    }
  };
  
  const exportToPDF = (filename: string, content: string) => {
    try {
      const doc = new jsPDF();
      const title = `${lecture.title} - ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`;
      const date = new Date().toLocaleDateString();
      
      // Add title
      doc.setFontSize(18);
      doc.text(title, 20, 20);
      
      // Add date
      doc.setFontSize(12);
      doc.text(`Date: ${date}`, 20, 30);
      doc.text(`Duration: ${lecture.duration || "N/A"}`, 20, 37);
      
      // Add content
      doc.setFontSize(12);
      
      // Split long text into paragraphs and pages
      const textLines = doc.splitTextToSize(content, 170);
      let y = 50;
      const pageHeight = doc.internal.pageSize.height - 20;
      
      for (let i = 0; i < textLines.length; i++) {
        if (y > pageHeight) {
          doc.addPage();
          y = 20;
        }
        doc.text(textLines[i], 20, y);
        y += 7;
      }
      
      doc.save(`${filename}.pdf`);
      toast({
        title: "Export successful",
        description: `Your document has been exported as ${filename}.pdf`
      });
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting to PDF.",
        variant: "destructive"
      });
    }
  };
  
  const exportToDoc = async (filename: string, content: string) => {
    try {
      const title = `${lecture.title} - ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`;
      const doc = new Document({
        sections: [
          {
            properties: {},
            children: [
              new Paragraph({
                children: [
                  new TextRun({
                    text: title,
                    bold: true,
                    size: 36
                  })
                ]
              }),
              new Paragraph({
                children: [new TextRun({ text: `Date: ${new Date().toLocaleDateString()}`, size: 24 })]
              }),
              new Paragraph({
                children: [new TextRun({ text: `Duration: ${lecture.duration || "N/A"}`, size: 24 })]
              }),
              new Paragraph({
                children: [new TextRun({ text: '' })]
              }),
              // Split content into paragraphs
              ...content.split('\n').map(para => 
                new Paragraph({
                  children: [new TextRun({ text: para })]
                })
              )
            ]
          }
        ]
      });
      
      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${filename}.docx`);
      
      toast({
        title: "Export successful",
        description: `Your document has been exported as ${filename}.docx`
      });
    } catch (error) {
      console.error("Error exporting to DOCX:", error);
      toast({
        title: "Export failed", 
        description: "There was an error exporting to DOCX.",
        variant: "destructive"
      });
    }
  };
  
  const executeExport = () => {
    const content = getActiveContent();
    
    if (!content) {
      toast({
        title: "Cannot export",
        description: "There's no content to export.",
        variant: "destructive"
      });
      return;
    }
    
    if (exportFormat === "pdf") {
      exportToPDF(exportFileName, content);
    } else {
      exportToDoc(exportFileName, content);
    }
    
    setShowExportDialog(false);
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
            onClick={handleExport}
            disabled={!lecture.transcription}
          >
            <FileDown className="h-4 w-4" />
            Export
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
      
      {/* Export dialog */}
      <Dialog open={showExportDialog} onOpenChange={setShowExportDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Export Options</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Export Format</label>
              <div className="flex gap-2">
                <Button 
                  variant={exportFormat === "pdf" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setExportFormat("pdf")}
                  className="flex-1"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  PDF
                </Button>
                <Button 
                  variant={exportFormat === "doc" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setExportFormat("doc")}
                  className="flex-1"
                >
                  <FilePlus className="h-4 w-4 mr-2" />
                  DOCX
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="filename" className="text-sm font-medium">File Name</label>
              <Textarea
                id="filename"
                value={exportFileName}
                onChange={(e) => setExportFileName(e.target.value)}
                placeholder="Enter file name"
                className="resize-none"
                rows={1}
              />
            </div>
            
            <div className="pt-2 flex justify-end gap-2">
              <Button 
                variant="outline" 
                onClick={() => setShowExportDialog(false)}
              >
                Cancel
              </Button>
              <Button onClick={executeExport}>
                Export
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LectureTranscription;
