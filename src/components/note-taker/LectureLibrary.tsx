
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileText, 
  Download, 
  BookOpen, 
  Trash, 
  MessageSquare, 
  FileDown, 
  FilePlus, 
  FileQuestion 
} from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

export interface Lecture {
  id: string;
  title: string;
  date: string;
  duration: string;
  audioUrl: string;
  transcription?: string;
  summary?: string;
}

interface LectureLibraryProps {
  lectures: Lecture[];
  onDeleteLecture: (id: string) => void;
  onSelectLecture: (lecture: Lecture) => void;
}

const LectureLibrary = ({ lectures, onDeleteLecture, onSelectLecture }: LectureLibraryProps) => {
  const [filter, setFilter] = useState<"all" | "transcribed">("all");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const filteredLectures = filter === "all" 
    ? lectures 
    : lectures.filter(lecture => lecture.transcription);
  
  const handleExport = (lecture: Lecture, format: "pdf" | "doc") => {
    if (!lecture.transcription) {
      toast({
        title: "Cannot export",
        description: "This lecture hasn't been transcribed yet.",
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
      const file = new Blob([lecture.transcription || ""], {type: 'text/plain'});
      element.href = URL.createObjectURL(file);
      element.download = `${lecture.title}.${format}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    }, 1000);
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">Your Lecture Library</h2>
        <Tabs defaultValue="all" value={filter} onValueChange={(value) => setFilter(value as "all" | "transcribed")}>
          <TabsList>
            <TabsTrigger value="all">All Lectures</TabsTrigger>
            <TabsTrigger value="transcribed">Transcribed</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      
      <ScrollArea className="h-[calc(100vh-300px)]">
        {filteredLectures.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredLectures.map((lecture) => (
              <motion.div
                key={lecture.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <Card className="overflow-hidden h-full">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">{lecture.title}</CardTitle>
                      <div className="flex gap-1">
                        {lecture.transcription && (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-200">
                            Transcribed
                          </Badge>
                        )}
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-200">
                          {lecture.duration}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{lecture.date}</p>
                  </CardHeader>
                  
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-primary" />
                        </div>
                        <div className="flex-1">
                          <audio
                            src={lecture.audioUrl}
                            controls
                            className="w-full h-8"
                          />
                        </div>
                      </div>
                      
                      {lecture.transcription && (
                        <p className="text-sm text-muted-foreground line-clamp-3 mt-2">
                          {lecture.transcription.slice(0, 150)}...
                        </p>
                      )}
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-2 flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1"
                      onClick={() => onSelectLecture(lecture)}
                    >
                      <FileText className="h-4 w-4" />
                      <span>View</span>
                    </Button>
                    
                    {lecture.transcription && (
                      <>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleExport(lecture, "pdf")}
                        >
                          <FileDown className="h-4 w-4" />
                          <span>PDF</span>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1"
                          onClick={() => handleExport(lecture, "doc")}
                        >
                          <FilePlus className="h-4 w-4" />
                          <span>DOC</span>
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="flex items-center gap-1 text-blue-500"
                          onClick={() => navigate('/assistant', { state: { context: lecture.transcription } })}
                        >
                          <FileQuestion className="h-4 w-4" />
                          <span>Ask AI</span>
                        </Button>
                      </>
                    )}
                    
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-1 text-red-500 ml-auto"
                      onClick={() => onDeleteLecture(lecture.id)}
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center mb-4">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No lectures found</h3>
            <p className="text-muted-foreground text-sm">
              {filter === "all" 
                ? "Record your first lecture to see it here." 
                : "Transcribe lectures to see them in this view."}
            </p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default LectureLibrary;
