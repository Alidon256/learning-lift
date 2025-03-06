
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
import { aiService } from "@/services/AIService";
import { v4 as uuidv4 } from "uuid";
import NavigationDrawer from "@/components/layout/NavigationDrawer";

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
      const recorder = new MediaRecorder(stream);
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
      
      const newLecture: Lecture = {
        id: uuidv4(),
        title: newLectureTitle,
        date: new Date().toLocaleDateString(),
        duration: formatTime(recordingTime),
        audioUrl,
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
      const shouldTranscribe = window.confirm("Would you like to transcribe this lecture?");
      if (shouldTranscribe) {
        transcribeLecture(newLecture);
      }
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
    toast({
      title: "Transcribing",
      description: "Your lecture is being transcribed. This may take a few moments.",
    });
    
    try {
      // Simulate transcription process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In a real app, you would send the audio to a transcription service
      // For now, we'll generate some placeholder text
      const placeholderText = `This is a transcription of the lecture titled "${lecture.title}" that was recorded on ${lecture.date}.

In this lecture, we discussed several important topics related to the subject matter. The key points covered include:

1. Introduction to the main concepts
2. Detailed explanation of methodologies
3. Examples and applications in real-world scenarios
4. Analysis of results and findings
5. Conclusions and future directions for research

The lecture also addressed common questions and provided clarification on complex topics. Students engaged in discussion about practical implementations and theoretical foundations.

Additional resources were mentioned during the lecture, including relevant textbooks, journal articles, and online materials that can help deepen understanding of the subject.`;
      
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
    } catch (error) {
      console.error("Error transcribing lecture:", error);
      toast({
        title: "Transcription failed",
        description: "There was an error transcribing your lecture. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsTranscribing(false);
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
      
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div className={`h-10 w-10 rounded-full ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-primary/10'} flex items-center justify-center text-primary transition-all duration-300`}>
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
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
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          
          {selectedLecture && (
            <Button 
              variant="outline" 
              onClick={handleBackToLibrary}
            >
              Back to Library
            </Button>
          )}
          
          <Button 
            onClick={isRecording ? stopRecording : startRecording} 
            className={isRecording ? "bg-red-500 hover:bg-red-600" : ""}
            disabled={isTranscribing}
          >
            <Mic className="h-5 w-5 mr-2" />
            {isRecording ? `Stop (${formatTime(recordingTime)})` : "Start Recording"}
          </Button>
        </div>
      </div>
      
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
        
        <TabsContent value="library" className="animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 neo-morphism min-h-[400px]">
            <LectureLibrary 
              lectures={lectures}
              onDeleteLecture={handleDeleteLecture}
              onSelectLecture={handleSelectLecture}
            />
          </div>
        </TabsContent>
        
        <TabsContent value="transcription" className="animate-fade-in">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 neo-morphism min-h-[400px]">
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
    </div>
  );
};

export default NoteTaker;
