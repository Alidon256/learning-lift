
import { useState } from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  Trash2, 
  MoreHorizontal, 
  Play, 
  Pause,
  Clock,
  Calendar,
  Search,
  Info
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";

export interface Lecture {
  id: string;
  title: string;
  date: string;
  duration: string;
  audioUrl: string;
  audioId?: string;
  transcription?: string;
  summary?: string;
}

interface LectureLibraryProps {
  lectures: Lecture[];
  onDeleteLecture: (id: string) => void;
  onSelectLecture: (lecture: Lecture) => void;
}

const LectureLibrary = ({ lectures, onDeleteLecture, onSelectLecture }: LectureLibraryProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLectureId, setSelectedLectureId] = useState<string | null>(null);
  const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [lectureToDelete, setLectureToDelete] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [audioPlayers, setAudioPlayers] = useState<Record<string, HTMLAudioElement>>({});
  
  const filteredLectures = lectures.filter((lecture) =>
    lecture.title.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handlePlay = (id: string, audioUrl: string) => {
    // Stop any currently playing audio
    if (currentlyPlaying && audioPlayers[currentlyPlaying]) {
      audioPlayers[currentlyPlaying].pause();
    }
    
    // Create or get audio element
    let audioElement = audioPlayers[id];
    if (!audioElement) {
      audioElement = new Audio(audioUrl);
      setAudioPlayers(prev => ({ ...prev, [id]: audioElement }));
    }
    
    // Play the selected audio
    if (currentlyPlaying === id) {
      // Toggle play/pause
      if (audioElement.paused) {
        audioElement.play();
      } else {
        audioElement.pause();
      }
    } else {
      // Play new audio
      audioElement.play();
      setCurrentlyPlaying(id);
    }
    
    // Handle audio ending
    audioElement.onended = () => {
      setCurrentlyPlaying(null);
    };
  };
  
  const confirmDelete = (id: string) => {
    setLectureToDelete(id);
    setIsDeleteDialogOpen(true);
  };
  
  const handleDelete = () => {
    if (lectureToDelete) {
      // Stop playing if this is the current audio
      if (currentlyPlaying === lectureToDelete && audioPlayers[lectureToDelete]) {
        audioPlayers[lectureToDelete].pause();
        setCurrentlyPlaying(null);
      }
      
      // Clean up audio element
      if (audioPlayers[lectureToDelete]) {
        const updatedPlayers = { ...audioPlayers };
        delete updatedPlayers[lectureToDelete];
        setAudioPlayers(updatedPlayers);
      }
      
      // Delete the lecture
      onDeleteLecture(lectureToDelete);
      setLectureToDelete(null);
      setIsDeleteDialogOpen(false);
    }
  };
  
  const handleSelectLecture = (lecture: Lecture) => {
    setIsLoading(true);
    // Simulate loading delay
    setTimeout(() => {
      onSelectLecture(lecture);
      setIsLoading(false);
    }, 500);
  };
  
  const cardVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -100 },
    hover: { scale: 1.02, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Your Lecture Library
          </h2>
          <p className="text-sm text-muted-foreground">
            {lectures.length} {lectures.length === 1 ? "lecture" : "lectures"} in your library
          </p>
        </div>
        
        <div className="relative w-full md:w-64">
          <Search className="h-4 w-4 absolute left-3 top-3 text-muted-foreground" />
          <Input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search lectures..."
            className="pl-9"
          />
        </div>
      </div>
      
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="p-4 flex flex-col md:flex-row gap-4 items-start">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-9 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredLectures.length === 0 ? (
        <div className="text-center py-12">
          {searchTerm ? (
            <>
              <Search className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">No matching lectures found</p>
              <p className="text-sm text-muted-foreground">Try a different search term</p>
            </>
          ) : (
            <>
              <Info className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-lg font-medium">Your library is empty</p>
              <p className="text-sm text-muted-foreground mb-4">Record your first lecture to get started</p>
              <Button variant="outline" disabled>
                Start Recording
              </Button>
            </>
          )}
        </div>
      ) : (
        <ScrollArea className="h-[calc(100vh-300px)]">
          <AnimatePresence>
            <div className="space-y-3">
              {filteredLectures.map((lecture) => (
                <motion.div
                  key={lecture.id}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  whileHover="hover"
                  variants={cardVariants}
                  transition={{ duration: 0.3 }}
                  layout
                >
                  <Card 
                    className={`overflow-hidden hover:border-primary/50 transition-colors ${
                      selectedLectureId === lecture.id ? "ring-1 ring-primary" : ""
                    }`}
                    onMouseEnter={() => setSelectedLectureId(lecture.id)}
                    onMouseLeave={() => setSelectedLectureId(null)}
                  >
                    <CardContent className="p-0">
                      <div className="p-4 flex flex-col md:flex-row gap-4 items-start">
                        <div 
                          className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 cursor-pointer"
                          onClick={() => handlePlay(lecture.id, lecture.audioUrl)}
                        >
                          {currentlyPlaying === lecture.id ? (
                            <Pause className="h-5 w-5 text-primary" />
                          ) : (
                            <Play className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        
                        <div 
                          className="flex-1 min-w-0 cursor-pointer"
                          onClick={() => handleSelectLecture(lecture)}
                        >
                          <h3 className="font-medium truncate">{lecture.title}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5" />
                              {lecture.date}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              {lecture.duration}
                            </span>
                          </div>
                          <div className="flex gap-2 mt-2">
                            {lecture.transcription && (
                              <Badge variant="outline" className="text-xs bg-primary/10 text-primary border-primary/20">
                                Transcribed
                              </Badge>
                            )}
                            {lecture.summary && (
                              <Badge variant="outline" className="text-xs bg-green-500/10 text-green-600 border-green-200">
                                Summarized
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <AnimatePresence>
                          {(selectedLectureId === lecture.id || currentlyPlaying === lecture.id) && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.8 }}
                              transition={{ duration: 0.2 }}
                              className="flex gap-2"
                            >
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleSelectLecture(lecture)}
                              >
                                <FileText className="h-4 w-4 mr-1" />
                                Open
                              </Button>
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon">
                                    <MoreHorizontal className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    className="text-destructive focus:text-destructive"
                                    onClick={() => confirmDelete(lecture.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        </ScrollArea>
      )}
      
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Lecture</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this lecture? This action cannot be undone and all associated transcriptions and summaries will be lost.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LectureLibrary;
