
import { useState, useRef } from "react";
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
  Sparkles,
  Check,
  Download
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { Lecture } from "./LectureLibrary";
import { aiService } from "@/services/AIService";
import { Document, Packer, Paragraph, TextRun, HeadingLevel } from "docx";
import { saveAs } from "file-saver";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import htmlToPdfmake from "html-to-pdfmake";

// Initialize pdfMake
pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
  const [summarizingProgress, setSummarizingProgress] = useState(0);
  const [isGeneratingExpansion, setIsGeneratingExpansion] = useState(false);
  const [expansionTopic, setExpansionTopic] = useState("");
  const [topicExpansion, setTopicExpansion] = useState("");
  const [questionInput, setQuestionInput] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [isAnswering, setIsAnswering] = useState(false);
  const [relatedTopics, setRelatedTopics] = useState<string[]>([]);
  const [exportFormat, setExportFormat] = useState<"pdf" | "doc">("pdf");
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  
  const { toast } = useToast();
  const audioRef = useRef<HTMLAudioElement>(null);
  
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
  
  const simulateProgress = async (
    setProgressFn: React.Dispatch<React.SetStateAction<number>>,
    steps = 10,
    duration = 2000
  ) => {
    const stepTime = duration / steps;
    for (let step = 1; step <= steps; step++) {
      await new Promise(resolve => setTimeout(resolve, stepTime));
      setProgressFn(Math.floor((step / steps) * 100));
    }
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
    setSummarizingProgress(0);
    
    try {
      // Simulate progress updates
      simulateProgress(setSummarizingProgress);
      
      // In a real app, this would use the AI service
      // For now we'll generate a better formatted summary
      const summary = `# Summary of "${lecture.title}"

## Overview
This lecture provides a comprehensive exploration of the subject matter, combining theoretical foundations with practical applications and case studies.

## Key Points
1. **Theoretical Framework**
   - The fundamental concepts introduced define the scope of the discussion
   - Historical context illustrates the evolution of thinking in this field
   - Current perspectives demonstrate the diversity of approaches

2. **Methodological Considerations**
   - Research methodologies appropriate for this domain were evaluated
   - Data collection techniques and their limitations were outlined
   - Analytical frameworks for interpretation were presented

3. **Applications and Case Studies**
   - Real-world examples demonstrated practical implementation
   - Industry best practices were highlighted
   - Success factors and common pitfalls were identified

## Critical Analysis
The lecture included a thoughtful critique of current approaches, acknowledging limitations while suggesting paths for improvement. Ethical considerations were given appropriate weight in the discussion.

## Implications
The content has significant implications for both theoretical understanding and practical implementation. The methodologies discussed provide a foundation for further exploration and application.

## Recommendations for Further Study
The lecture pointed to several promising directions for further investigation, including emerging technologies, interdisciplinary approaches, and evolving best practices.`;
      
      onUpdateSummary(lecture.id, summary);
      
      // Generate topics for deeper exploration
      const topics = [
        "Historical Development of These Concepts",
        "Practical Applications in Industry",
        "Research Frontiers and Recent Developments",
        "Comparative Analysis with Alternative Approaches",
        "Ethical Considerations and Social Impact",
        "Technological Integration and Digital Transformation",
        "Case Studies of Successful Implementation"
      ];
      
      setRelatedTopics(topics);
      setActiveTab("summary");
      toast({
        title: "Summary generated",
        description: "Your lecture has been summarized."
      });
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSummarizing(false);
      setSummarizingProgress(0);
    }
  };
  
  const handleAskQuestion = async () => {
    if (!questionInput.trim()) return;
    
    setIsAnswering(true);
    setAiAnswer("");
    
    try {
      await simulateProgress(setSummarizingProgress, 8, 2000);
      
      // In a real app, this would use the AI service with the actual lecture transcription
      const contextualizedAnswer = `Based on the lecture content, I can provide the following detailed answer:

${questionInput.includes("example") ? 
`### Examples and Case Studies
The lecture provided several illuminating examples that directly address your question:

1. **Primary Case Study**: The implementation at XYZ Corporation demonstrated how these principles can be successfully applied in a corporate environment. Key success factors included:
   - Strong leadership commitment
   - Methodical implementation approach
   - Continuous feedback and adjustment
   
2. **Comparative Analysis**: The contrasting approaches taken by different organizations revealed important contextual factors that influence outcomes.

3. **Failed Implementation**: The lecture also covered an instructive failure case where insufficient attention to cultural factors undermined otherwise sound technical decisions.` 
: 
questionInput.includes("define") || questionInput.includes("what is") || questionInput.includes("meaning") ?
`### Conceptual Definition
The lecture defined this concept in detail, drawing from multiple theoretical traditions:

1. **Core Definition**: The fundamental meaning as established in the literature is "a systematic approach to understanding and addressing complex challenges through the application of structured methodologies and evidence-based decision-making."

2. **Theoretical Context**: This definition builds upon earlier work by Smith (2018) and Jones (2020), while incorporating recent developments in the field.

3. **Practical Interpretation**: In applied settings, this translates to "a framework for analyzing problems, generating solutions, and implementing strategic interventions based on validated principles and contextual understanding."

The lecture emphasized that this definition continues to evolve as new research emerges and practical applications yield new insights.`
:
`### Analysis and Interpretation
Your question touches on a central theme of the lecture. The key insights provided were:

1. **Fundamental Principles**: The lecture established that these approaches are grounded in empirically-validated methodologies rather than intuitive or traditional practices.

2. **Integration of Perspectives**: A significant strength identified was the ability to synthesize diverse viewpoints into a coherent framework that accommodates complexity without oversimplification.

3. **Contextual Adaptability**: The lecture emphasized that successful application requires thoughtful adaptation to specific contexts rather than rigid implementation of prescribed methods.

4. **Evidence-Based Evaluation**: The criteria for assessing effectiveness were clearly articulated, focusing on measurable outcomes and systematic evaluation rather than anecdotal success stories.

The lecture concluded that this understanding provides a robust foundation for both theoretical advancement and practical application in diverse settings.`}

The lecture also pointed to several additional resources that might help deepen your understanding of this topic, including recent research publications and practical implementation guides.`;
      
      setAiAnswer(contextualizedAnswer);
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
      await simulateProgress(setSummarizingProgress, 8, 2000);
      
      // In a real app, this would use the AI service
      const expansion = `# In-Depth Exploration: ${topic}

## Context and Significance
This topic represents a crucial dimension of the subject matter discussed in the lecture. While the main presentation provided a foundation, this expansion delves deeper into the theoretical underpinnings, practical applications, and ongoing developments in this specific area.

## Theoretical Framework
The conceptual basis for this topic draws from multiple disciplines and theoretical traditions:

1. **Historical Development**
   - Early formulations emerged in the work of foundational theorists
   - Key evolutionary stages show how understanding has been refined over time
   - Current theoretical models integrate diverse perspectives

2. **Core Principles**
   - Fundamental concepts that structure understanding in this domain
   - Relationships between key variables and processes
   - Theoretical debates and areas of consensus

## Research Evidence
Empirical studies have provided substantial insights into this topic:

1. **Landmark Studies**
   - Smith et al. (2019) conducted a comprehensive meta-analysis
   - Johnson's longitudinal study (2020-2022) tracked developmental patterns
   - Cross-cultural research by Wong and colleagues revealed contextual variations

2. **Methodological Approaches**
   - Quantitative methods have illuminated statistical relationships
   - Qualitative research has provided rich contextual understanding
   - Mixed methods approaches offer complementary perspectives

## Practical Applications
This theoretical knowledge translates into practical implementations:

1. **Industry Applications**
   - Corporate settings have adapted these principles for strategic planning
   - Educational institutions utilize these concepts in curriculum development
   - Healthcare settings apply these approaches to improve patient outcomes

2. **Implementation Strategies**
   - Staged implementation models provide structured pathways
   - Contextual adaptation ensures relevance to specific settings
   - Evaluation frameworks measure effectiveness and guide refinement

## Current Frontiers
The field continues to evolve in several exciting directions:

1. **Emerging Research Questions**
   - How do digital technologies transform implementation possibilities?
   - What cultural factors influence effectiveness across diverse contexts?
   - How can interdisciplinary approaches enhance understanding?

2. **Methodological Innovations**
   - Advanced statistical techniques offer new analytical possibilities
   - Digital data collection methods expand research scope
   - Participatory approaches engage stakeholders in knowledge creation

## Resources for Further Study

### Academic Resources
- Smith, J. (2022). *Comprehensive Framework for Application*. Oxford University Press.
- Journal of Applied Research (Special Issue on this topic, 2023)
- International Conference Proceedings (2022-2023)

### Practical Guides
- Anderson's Implementation Handbook (2023)
- Online Learning Platform: www.advancedstudies.org
- Professional Development Workshop Series (available online)

### Communities of Practice
- International Practitioner Network
- Research Consortium on Advanced Applications
- Social Media Discussion Groups (#AdvancedApplications)`;
      
      setTopicExpansion(expansion);
      setActiveTab("expansion");
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
  
  const handleExport = async (format: "pdf" | "doc") => {
    setExportFormat(format);
    setIsExporting(true);
    setExportProgress(0);
    
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
      setIsExporting(false);
      return;
    }
    
    try {
      // Simulate processing
      await simulateProgress(setExportProgress, 5, 1500);
      
      const fileName = `${lecture.title.replace(/\s+/g, '_')}_${activeTab}`;
      
      if (format === "pdf") {
        // Convert markdown-like content to HTML for PDF conversion
        const htmlContent = convertMarkdownToHtml(content);
        const pdfContent = htmlToPdfmake(htmlContent);
        
        const documentDefinition = {
          content: pdfContent,
          styles: {
            header: {
              fontSize: 18,
              bold: true,
              margin: [0, 10, 0, 5]
            },
            subheader: {
              fontSize: 15,
              bold: true,
              margin: [0, 10, 0, 5]
            },
            quote: {
              italics: true,
              margin: [20, 0]
            },
            small: {
              fontSize: 8
            }
          },
          defaultStyle: {
            font: 'Roboto'
          },
          footer: function(currentPage: number, pageCount: number) { 
            return { text: currentPage.toString() + ' / ' + pageCount, alignment: 'center' };
          },
          header: function(currentPage: number) {
            return { text: lecture.title, alignment: 'center', margin: [0, 20] };
          }
        };
        
        pdfMake.createPdf(documentDefinition).download(fileName + '.pdf');
      } else {
        // Create DOCX document
        const doc = new Document({
          sections: [{
            properties: {},
            children: createDocxContent(content)
          }]
        });
        
        // Generate and save document
        const buffer = await Packer.toBlob(doc);
        saveAs(buffer, fileName + '.docx');
      }
      
      toast({
        title: `${format.toUpperCase()} Created`,
        description: `Your ${format.toUpperCase()} has been created and downloaded.`
      });
    } catch (error) {
      console.error(`Error creating ${format}:`, error);
      toast({
        title: "Export failed",
        description: `Failed to create ${format.toUpperCase()}. Please try again.`,
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
      setExportProgress(0);
    }
  };
  
  // Helper function to convert markdown-like syntax to HTML
  const convertMarkdownToHtml = (markdown: string): string => {
    let html = markdown;
    
    // Convert headings
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    
    // Convert bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    
    // Convert italics
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    
    // Convert lists
    html = html.replace(/^\d+\. (.*$)/gm, '<li>$1</li>');
    html = html.replace(/^- (.*$)/gm, '<li>$1</li>');
    
    // Wrap lists
    let inOrderedList = false;
    let inUnorderedList = false;
    
    const lines = html.split('\n');
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].match(/<li>/)) {
        if (lines[i].match(/^\d+\. /) && !inOrderedList) {
          lines[i] = '<ol>' + lines[i];
          inOrderedList = true;
        } else if (lines[i].match(/^- /) && !inUnorderedList) {
          lines[i] = '<ul>' + lines[i];
          inUnorderedList = true;
        }
      } else {
        if (inOrderedList) {
          lines[i-1] += '</ol>';
          inOrderedList = false;
        }
        if (inUnorderedList) {
          lines[i-1] += '</ul>';
          inUnorderedList = false;
        }
      }
    }
    
    // Close any remaining lists
    if (inOrderedList) {
      lines[lines.length-1] += '</ol>';
    }
    if (inUnorderedList) {
      lines[lines.length-1] += '</ul>';
    }
    
    // Convert paragraphs
    html = lines.join('\n');
    html = html.replace(/^(?!<[hou])(.*$)/gm, '<p>$1</p>');
    
    // Clean up empty paragraphs
    html = html.replace(/<p><\/p>/g, '');
    
    return html;
  };
  
  // Helper function to create DOCX content
  const createDocxContent = (markdown: string) => {
    const lines = markdown.split('\n');
    const children = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (!line) {
        continue;
      }
      
      if (line.startsWith('# ')) {
        children.push(new Paragraph({
          text: line.substring(2),
          heading: HeadingLevel.HEADING_1
        }));
      } else if (line.startsWith('## ')) {
        children.push(new Paragraph({
          text: line.substring(3),
          heading: HeadingLevel.HEADING_2
        }));
      } else if (line.startsWith('### ')) {
        children.push(new Paragraph({
          text: line.substring(4),
          heading: HeadingLevel.HEADING_3
        }));
      } else if (line.match(/^\d+\. /) || line.match(/^- /)) {
        // Handle list items
        const text = line.replace(/^\d+\. /, '').replace(/^- /, '');
        children.push(new Paragraph({
          text,
          bullet: {
            level: 0
          }
        }));
      } else {
        // Regular paragraph
        children.push(new Paragraph({
          children: [
            new TextRun(line)
          ]
        }));
      }
    }
    
    return children;
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold">{lecture.title}</h2>
          <p className="text-sm text-muted-foreground">{lecture.date} • {lecture.duration}</p>
        </div>
        
        <div className="flex gap-2">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => handleExport("pdf")}
              disabled={!lecture.transcription || isExporting}
            >
              <FileDown className="h-4 w-4" />
              PDF
            </Button>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
              onClick={() => handleExport("doc")}
              disabled={!lecture.transcription || isExporting}
            >
              <FilePlus className="h-4 w-4" />
              DOC
            </Button>
          </motion.div>
        </div>
      </div>
      
      <audio
        ref={audioRef}
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
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <TabsContent value="transcription" className="space-y-4 mt-0">
              <div className="flex justify-between">
                <div className="flex gap-2">
                  {!isEditing ? (
                    <>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => setIsEditing(true)}
                          disabled={!lecture.transcription}
                        >
                          Edit
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleCopy}
                          disabled={!lecture.transcription}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Copy
                        </Button>
                      </motion.div>
                    </>
                  ) : (
                    <>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          variant="default" 
                          size="sm"
                          onClick={handleSaveTranscription}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Save
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
                      </motion.div>
                    </>
                  )}
                </div>
                
                {!lecture.summary && (
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1"
                      onClick={handleGenerateSummary}
                      disabled={!lecture.transcription || isSummarizing}
                    >
                      {isSummarizing ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          >
                            <Brain className="h-4 w-4 mr-1" />
                          </motion.div>
                          Summarizing...
                        </>
                      ) : (
                        <>
                          <Brain className="h-4 w-4 mr-1" />
                          Generate Summary
                        </>
                      )}
                    </Button>
                  </motion.div>
                )}
              </div>
              
              {isEditing ? (
                <Textarea
                  value={editedText}
                  onChange={(e) => setEditedText(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                  placeholder="No transcription available yet. Edit to add one manually."
                />
              ) : (
                <Card className="overflow-hidden border-none shadow-md">
                  <CardContent className="p-4">
                    <ScrollArea className="h-[calc(100vh-420px)]">
                      {lecture.transcription ? (
                        <div className="whitespace-pre-wrap prose dark:prose-invert max-w-none">
                          {convertMarkdownToHtml(lecture.transcription)}
                        </div>
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
            
            <TabsContent value="summary" className="space-y-4 mt-0">
              <Card className="overflow-hidden border-none shadow-md">
                <CardContent className="p-4">
                  <ScrollArea className="h-[calc(100vh-420px)]">
                    {lecture.summary ? (
                      <div className="space-y-6">
                        <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                          {convertMarkdownToHtml(lecture.summary)}
                        </div>
                        
                        {relatedTopics.length > 0 && (
                          <div className="mt-8 border-t pt-4">
                            <h3 className="text-lg font-medium mb-3 flex items-center gap-2">
                              <Sparkles className="h-5 w-5 text-primary" />
                              Explore Deeper
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {relatedTopics.map((topic, index) => (
                                <motion.div 
                                  key={index} 
                                  whileHover={{ scale: 1.03 }} 
                                  whileTap={{ scale: 0.97 }}
                                >
                                  <Card 
                                    className="hover:bg-accent/50 transition-colors cursor-pointer border border-muted hover:border-primary"
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
                                </motion.div>
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
            
            <TabsContent value="expansion" className="space-y-4 mt-0">
              <Card className="overflow-hidden border-none shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Sparkles className="h-5 w-5 text-primary" />
                    {expansionTopic}
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  <ScrollArea className="h-[calc(100vh-420px)]">
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
                        
                        <div className="w-full max-w-xs mt-4">
                          <Progress value={summarizingProgress} className="h-2" />
                          <p className="text-xs text-center mt-2 text-muted-foreground">{summarizingProgress}%</p>
                        </div>
                      </div>
                    ) : (
                      <div className="prose dark:prose-invert max-w-none whitespace-pre-wrap">
                        {convertMarkdownToHtml(topicExpansion)}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="qa" className="space-y-4 mt-0">
              <Card className="overflow-hidden border-none shadow-md p-4">
                <div className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <Textarea
                      value={questionInput}
                      onChange={(e) => setQuestionInput(e.target.value)}
                      placeholder="Ask a question about this lecture..."
                      className="flex-1 min-h-[80px] resize-none"
                    />
                    <motion.div 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                      className="self-end"
                    >
                      <Button
                        onClick={handleAskQuestion}
                        disabled={!questionInput.trim() || isAnswering}
                        size="lg"
                      >
                        {isAnswering ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            <Brain className="h-5 w-5" />
                          </motion.div>
                        ) : (
                          <Brain className="h-5 w-5 mr-2" />
                        )}
                        {isAnswering ? "Thinking..." : "Ask"}
                      </Button>
                    </motion.div>
                  </div>
                  
                  {isAnswering && (
                    <div className="w-full">
                      <Progress value={summarizingProgress} className="h-2" />
                      <p className="text-xs text-right mt-1 text-muted-foreground">{summarizingProgress}%</p>
                    </div>
                  )}
                  
                  <AnimatePresence>
                    {aiAnswer && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Card className="mt-2 overflow-hidden">
                          <CardHeader className="pb-2 bg-primary/5">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <Brain className="h-5 w-5 text-primary" />
                              Answer
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4">
                            <ScrollArea className="max-h-[300px]">
                              <div className="prose dark:prose-invert max-w-none">
                                {convertMarkdownToHtml(aiAnswer)}
                              </div>
                            </ScrollArea>
                          </CardContent>
                          <CardFooter className="flex justify-end py-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                navigator.clipboard.writeText(aiAnswer);
                                toast({
                                  title: "Copied to clipboard",
                                  description: "Answer has been copied to clipboard."
                                });
                              }}
                            >
                              <Copy className="h-4 w-4 mr-1" />
                              Copy
                            </Button>
                          </CardFooter>
                        </Card>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
      
      {/* Export Progress Dialog */}
      <Dialog open={isExporting} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Exporting {exportFormat.toUpperCase()}</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="mb-4 flex justify-center">
              <motion.div
                animate={{ 
                  rotate: 360,
                }}
                transition={{ 
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear" 
                }}
                className="rounded-full bg-primary/10 p-4"
              >
                {exportFormat === "pdf" ? (
                  <FileDown className="h-8 w-8 text-primary" />
                ) : (
                  <FilePlus className="h-8 w-8 text-primary" />
                )}
              </motion.div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Creating {exportFormat.toUpperCase()}...</span>
                <span>{exportProgress}%</span>
              </div>
              <Progress value={exportProgress} className="h-2" />
              <p className="text-sm text-muted-foreground text-center mt-4">
                Preparing your {exportFormat.toUpperCase()} file for download...
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LectureTranscription;
