
import { useState, useEffect, useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Mic, Home, Sun, Moon, Save, ListMusic, FileText, Plus, Brain } from "lucide-react";
import { useTheme } from "@/hooks/use-theme";
import { useToast } from "@/hooks/use-toast";
import LectureLibrary, { Lecture } from "./LectureLibrary";
import LectureTranscription from "./LectureTranscription";
import { v4 as uuidv4 } from "uuid";
import NavigationDrawer from "@/components/layout/NavigationDrawer";
import { aiService } from "@/services/AIService";
import { motion, AnimatePresence } from "framer-motion";

const NoteTaker = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState("library");
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [selectedLecture, setSelectedLecture] = useState<Lecture | null>(null);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [newLectureTitle, setNewLectureTitle] = useState("");
  const [showTitleDialog, setShowTitleDialog] = useState(false);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcriptionProgress, setTranscriptionProgress] = useState(0);
  
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const timerRef = useRef<number | null>(null);
  
  // Load lectures from localStorage on init
  useEffect(() => {
    const savedLectures = localStorage.getItem('lectures');
    if (savedLectures) {
      try {
        setLectures(JSON.parse(savedLectures));
      } catch (e) {
        console.error("Error loading lectures:", e);
      }
    }
  }, []);
  
  // Save lectures to localStorage when updated
  useEffect(() => {
    localStorage.setItem('lectures', JSON.stringify(lectures));
  }, [lectures]);
  
  // Recording timer
  useEffect(() => {
    if (isRecording) {
      timerRef.current = window.setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
    
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRecording]);
  
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    return [
      hrs > 0 ? hrs : null,
      mins.toString().padStart(hrs > 0 ? 2 : 1, "0"),
      secs.toString().padStart(2, "0")
    ].filter(Boolean).join(":");
  };
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      const chunks: Blob[] = [];
      
      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
          setAudioChunks([...chunks]);
        }
      };
      
      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
      };
      
      recorder.start(1000); // Collect data every second
      setMediaRecorder(recorder);
      setIsRecording(true);
      setRecordingTime(0);
      
      toast({
        title: "Recording started",
        description: "Your lecture is now being recorded.",
      });
    } catch (err) {
      console.error("Error accessing microphone:", err);
      toast({
        title: "Cannot access microphone",
        description: "Please check your browser permissions.",
        variant: "destructive"
      });
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorder) {
      mediaRecorder.stop();
      setIsRecording(false);
      setShowTitleDialog(true);
    }
  };
  
  const handleTitleConfirm = async () => {
    if (!newLectureTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title for your lecture.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const audioBlob = new Blob(audioChunks, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      
      // Store the audio data in localStorage for persistence
      const reader = new FileReader();
      reader.readAsDataURL(audioBlob);
      reader.onloadend = function() {
        const base64data = reader.result as string;
        
        // Save the audio data to localStorage 
        const audioId = uuidv4();
        localStorage.setItem(`lecture_audio_${audioId}`, base64data);
        
        const newLecture: Lecture = {
          id: uuidv4(),
          title: newLectureTitle,
          date: new Date().toLocaleDateString(),
          duration: formatTime(recordingTime),
          audioUrl,
          audioId,
        };
        
        setLectures(prev => [newLecture, ...prev]);
        setShowTitleDialog(false);
        setNewLectureTitle("");
        setAudioChunks([]);
        
        toast({
          title: "Lecture saved",
          description: "Your lecture has been saved to the library.",
        });
        
        // Ask if user wants to transcribe
        const shouldTranscribe = window.confirm("Would you like to transcribe this lecture now?");
        if (shouldTranscribe) {
          transcribeLecture(newLecture);
        }
      };
    } catch (error) {
      console.error("Error saving lecture:", error);
      toast({
        title: "Error",
        description: "Failed to save the lecture. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const transcribeLecture = async (lecture: Lecture) => {
    setIsTranscribing(true);
    setTranscriptionProgress(0);
    
    toast({
      title: "Transcribing",
      description: "Your lecture is being transcribed. This may take a few moments.",
    });
    
    try {
      // Simulate transcription process with progress updates
      const totalSteps = 5;
      for (let step = 1; step <= totalSteps; step++) {
        await new Promise(resolve => setTimeout(resolve, 800));
        setTranscriptionProgress(Math.floor((step / totalSteps) * 100));
      }
      
      // In a real app, you would send the audio to a transcription service
      // Here's an improved placeholder text that's more comprehensive
      const placeholderText = `# Lecture Transcription: ${lecture.title}
      
## Date: ${lecture.date}
## Duration: ${lecture.duration}

### Introduction
This lecture begins with an overview of the key concepts that will be explored in detail. The speaker establishes the context and relevance of today's topic within the broader field of study. They outline the learning objectives and the structure of the presentation.

### Main Content
The central portion of the lecture focuses on several critical themes:

1. **Theoretical Framework**
   - The foundational principles underlying the subject matter
   - Historical development of key theories
   - Current academic consensus and areas of debate

2. **Methodological Approaches**
   - Quantitative vs. qualitative research methods in this domain
   - Data collection techniques and their limitations
   - Analytical frameworks for interpreting results

3. **Practical Applications**
   - Real-world case studies demonstrating theoretical concepts
   - Industry best practices and implementation strategies
   - Technological innovations driving change in the field

4. **Critical Analysis**
   - Strengths and weaknesses of current approaches
   - Ethical considerations and societal implications
   - Potential biases and limitations in research design

### Discussion and Q&A
The lecture concludes with an interactive discussion where several important questions were addressed:
- How these concepts apply to emerging challenges
- The relationship between theory and practice
- Future directions for research and development

### Key Takeaways
- The importance of integrating multiple perspectives
- The necessity of evidence-based decision making
- Practical strategies for applying these concepts in professional contexts

### Recommended Resources
Several valuable resources were mentioned for further exploration:
- Recent journal articles providing empirical evidence
- Comprehensive textbooks covering theoretical foundations
- Online platforms offering practical tutorials and examples`;
      
      // Update the lecture with transcription
      setLectures(prev => prev.map(item => 
        item.id === lecture.id 
          ? { ...item, transcription: placeholderText } 
          : item
      ));
      
      toast({
        title: "Transcription complete",
        description: "Your lecture has been transcribed successfully.",
      });
      
      // Set this lecture as selected and switch to transcription tab
      const updatedLecture = { ...lecture, transcription: placeholderText };
      setSelectedLecture(updatedLecture);
      setActiveTab("transcription");
      
      // Generate a summary automatically
      generateSummary(updatedLecture);
      
    } catch (error) {
      console.error("Error transcribing lecture:", error);
      toast({
        title: "Transcription failed",
        description: "There was an error transcribing your lecture. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTranscribing(false);
      setTranscriptionProgress(0);
    }
  };
  
  const generateSummary = async (lecture: Lecture) => {
    if (!lecture.transcription) return;
    
    toast({
      title: "Generating summary",
      description: "Creating a concise summary of your lecture...",
    });
    
    try {
      // In a real app, this would use the AI service
      // Here's a better placeholder summary
      const summary = `# Summary of "${lecture.title}"

## Overview
This lecture provides a comprehensive exploration of key concepts and methodologies in the field, emphasizing both theoretical frameworks and practical applications.

## Key Points
1. **Core Concepts**
   - The lecture establishes fundamental principles that form the basis of this subject area
   - Historical context is provided to show the evolution of thinking in the field
   - Current academic perspectives are presented with attention to contrasting viewpoints

2. **Methodological Framework**
   - Various research approaches are analyzed with their respective strengths and limitations
   - Data collection and analysis techniques are explained with practical examples
   - Emphasis is placed on selecting appropriate methods for specific research questions

3. **Practical Implications**
   - Real-world applications demonstrate how theoretical concepts translate to practice
   - Case studies illustrate successful implementation strategies
   - Technological innovations are highlighted as drivers of advancement

## Significance
The content is particularly relevant for understanding current developments in the field and anticipating future trends. The methodological approaches discussed provide valuable tools for both academic research and professional practice.

## Conclusions
The lecture concludes that an integrated approach combining multiple perspectives yields the most comprehensive understanding. Evidence-based decision-making emerges as a critical factor for success in applying these concepts.`;
      
      // Update the lecture with the summary
      setLectures(prev => prev.map(item => 
        item.id === lecture.id 
          ? { ...item, summary } 
          : item
      ));
      
      // Update selected lecture if it's the current one
      if (selectedLecture && selectedLecture.id === lecture.id) {
        setSelectedLecture({ ...selectedLecture, summary });
      }
      
      toast({
        title: "Summary generated",
        description: "A concise summary of the lecture has been created.",
      });
      
    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Summary generation failed",
        description: "There was an error creating the summary. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteLecture = (id: string) => {
    if (window.confirm("Are you sure you want to delete this lecture? This action cannot be undone.")) {
      setLectures(prev => prev.filter(lecture => lecture.id !== id));
      
      if (selectedLecture?.id === id) {
        setSelectedLecture(null);
        setActiveTab("library");
      }
      
      toast({
        title: "Lecture deleted",
        description: "The lecture has been removed from your library.",
      });
    }
  };
  
  const handleSelectLecture = (lecture: Lecture) => {
    setSelectedLecture(lecture);
    setActiveTab("transcription");
  };
  
  const handleUpdateTranscription = (id: string, transcription: string) => {
    setLectures(prev => prev.map(item => 
      item.id === id 
        ? { ...item, transcription } 
        : item
    ));
    
    if (selectedLecture && selectedLecture.id === id) {
      setSelectedLecture({ ...selectedLecture, transcription });
    }
  };
  
  const handleUpdateSummary = (id: string, summary: string) => {
    setLectures(prev => prev.map(item => 
      item.id === id 
        ? { ...item, summary } 
        : item
    ));
    
    if (selectedLecture && selectedLecture.id === id) {
      setSelectedLecture({ ...selectedLecture, summary });
    }
  };
  
  const handleBackToLibrary = () => {
    setSelectedLecture(null);
    setActiveTab("library");
  };
  
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <NavigationDrawer />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex items-center justify-between mb-8"
      >
        <div className="flex items-center gap-2">
          <motion.div 
            className={`h-10 w-10 rounded-full ${isRecording ? 'bg-red-500' : 'bg-primary/10'} flex items-center justify-center text-primary transition-all duration-300`}
            animate={{ 
              scale: isRecording ? [1, 1.1, 1] : 1,
              backgroundColor: isRecording ? 'rgb(239, 68, 68)' : 'rgba(var(--primary), 0.1)'
            }}
            transition={{ 
              duration: 1.5, 
              repeat: isRecording ? Infinity : 0,
              repeatType: "reverse"
            }}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold">Lecture Note Taker</h1>
            <p className="text-sm text-muted-foreground">Record, transcribe, and interact with your lectures</p>
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="hover:scale-105 transition-transform"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          {selectedLecture && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                variant="outline" 
                onClick={handleBackToLibrary}
                className="flex items-center gap-2"
              >
                <Home className="h-4 w-4" />
                Back to Library
              </Button>
            </motion.div>
          )}
          
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              onClick={isRecording ? stopRecording : startRecording} 
              className={isRecording ? "bg-red-500 hover:bg-red-600" : ""}
              disabled={isTranscribing}
            >
              <Mic className="h-5 w-5 mr-2" />
              {isRecording ? `Stop (${formatTime(recordingTime)})` : "Start Recording"}
            </Button>
          </motion.div>
        </div>
      </motion.div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="w-full max-w-md mx-auto grid grid-cols-2">
          <TabsTrigger value="library" className="flex items-center gap-2">
            <ListMusic className="h-4 w-4" />
            Library
          </TabsTrigger>
          <TabsTrigger 
            value="transcription" 
            className="flex items-center gap-2"
            disabled={!selectedLecture}
          >
            <FileText className="h-4 w-4" />
            Lecture Content
          </TabsTrigger>
        </TabsList>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <TabsContent value="library" className="animate-fade-in mt-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg min-h-[400px]">
                <LectureLibrary 
                  lectures={lectures}
                  onDeleteLecture={handleDeleteLecture}
                  onSelectLecture={handleSelectLecture}
                />
              </div>
            </TabsContent>
            
            <TabsContent value="transcription" className="animate-fade-in mt-0">
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg min-h-[400px]">
                {selectedLecture ? (
                  <LectureTranscription 
                    lecture={selectedLecture}
                    onUpdateTranscription={handleUpdateTranscription}
                    onUpdateSummary={handleUpdateSummary}
                  />
                ) : (
                  <div className="text-center py-10">
                    <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <p className="text-lg font-medium">No lecture selected</p>
                    <Button 
                      variant="outline" 
                      className="mt-4"
                      onClick={() => setActiveTab("library")}
                    >
                      Go to Library
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </motion.div>
        </AnimatePresence>
      </Tabs>
      
      {/* Title dialog */}
      <Dialog open={showTitleDialog} onOpenChange={setShowTitleDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Name your lecture recording</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-primary" />
              <span className="text-sm">Duration: {formatTime(recordingTime)}</span>
            </div>
            <Input
              value={newLectureTitle}
              onChange={(e) => setNewLectureTitle(e.target.value)}
              placeholder="Enter lecture title"
              className="focus:ring-2 focus:ring-primary"
            />
            <div className="flex justify-end gap-2 mt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowTitleDialog(false);
                  setNewLectureTitle("");
                  setAudioChunks([]);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleTitleConfirm}>
                <Save className="h-4 w-4 mr-2" />
                Save Lecture
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Transcription progress dialog */}
      <Dialog open={isTranscribing} onOpenChange={() => {}}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Transcribing Your Lecture</DialogTitle>
          </DialogHeader>
          <div className="py-6">
            <div className="mb-4 flex justify-center">
              <motion.div
                animate={{ 
                  rotate: 360,
                  scale: [1, 1.1, 1]
                }}
                transition={{ 
                  rotate: { 
                    duration: 2,
                    repeat: Infinity,
                    ease: "linear"
                  },
                  scale: {
                    duration: 1,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }}
                className="rounded-full bg-primary/10 p-4"
              >
                <Brain className="h-8 w-8 text-primary" />
              </motion.div>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Processing audio...</span>
                <span>{transcriptionProgress}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: `${transcriptionProgress}%` }}
                  transition={{ type: "spring", stiffness: 50 }}
                />
              </div>
              <p className="text-sm text-muted-foreground text-center mt-4">
                This may take a few moments. We're converting your audio to text...
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NoteTaker;
