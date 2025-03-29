
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { userScoreService } from "@/services/UserScoreService";
import { UserScore } from "@/models/StudyGroup";
import { toast } from "@/hooks/use-toast";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";

interface ScoreUploadFormProps {
  onScoreAdded: (score: UserScore) => void;
}

const SUBJECTS = [
  { id: "subj-1", name: "Artificial Intelligence" },
  { id: "subj-2", name: "Data Structures" },
  { id: "subj-3", name: "Machine Learning" },
  { id: "subj-4", name: "Computer Networks" },
  { id: "subj-5", name: "Database Systems" },
];

const CATEGORIES = [
  { value: "quiz", label: "Quiz" },
  { value: "exam", label: "Exam" },
  { value: "assignment", label: "Assignment" },
  { value: "project", label: "Project" },
  { value: "other", label: "Other" },
];

const ScoreUploadForm = ({ onScoreAdded }: ScoreUploadFormProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subjectId, setSubjectId] = useState("");
  const [category, setCategory] = useState<"quiz" | "exam" | "assignment" | "project" | "other">("quiz");
  const [score, setScore] = useState("");
  const [maxScore, setMaxScore] = useState("");
  
  const resetForm = () => {
    setTitle("");
    setDescription("");
    setSubjectId("");
    setCategory("quiz");
    setScore("");
    setMaxScore("");
    setIsSubmitting(false);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !subjectId || !score || !maxScore) {
      toast({
        title: "Missing information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }
    
    const scoreNum = Number(score);
    const maxScoreNum = Number(maxScore);
    
    if (isNaN(scoreNum) || isNaN(maxScoreNum) || scoreNum < 0 || maxScoreNum <= 0 || scoreNum > maxScoreNum) {
      toast({
        title: "Invalid score values",
        description: "Please enter valid numbers for the score and maximum score",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const selectedSubject = SUBJECTS.find(s => s.id === subjectId);
      
      if (!selectedSubject) {
        throw new Error("Selected subject not found");
      }
      
      const newScore = await userScoreService.addUserScore({
        userId: "current-user", // In a real app, get from auth context
        userName: "John Doe", // In a real app, get from auth context
        subjectId,
        subjectName: selectedSubject.name,
        score: scoreNum,
        maxScore: maxScoreNum,
        category,
        title,
        description,
      });
      
      toast({
        title: "Score uploaded successfully",
        description: `Your ${category} score has been recorded`,
      });
      
      onScoreAdded(newScore);
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error adding score:", error);
      toast({
        title: "Failed to upload score",
        description: "An error occurred while uploading your score. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <>
      <Button onClick={() => setIsDialogOpen(true)}>
        Upload New Score
      </Button>
      
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Upload New Score</DialogTitle>
            <DialogDescription>
              Enter your assessment details to track your academic progress and get AI-powered insights.
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Midterm Exam"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select value={subjectId} onValueChange={setSubjectId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Select a subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((subject) => (
                    <SelectItem key={subject.id} value={subject.id}>
                      {subject.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={category} 
                onValueChange={(value) => setCategory(value as typeof category)}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="score">Your Score</Label>
                <Input
                  id="score"
                  type="number"
                  min="0"
                  step="any"
                  value={score}
                  onChange={(e) => setScore(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxScore">Maximum Score</Label>
                <Input
                  id="maxScore"
                  type="number"
                  min="1"
                  step="any"
                  value={maxScore}
                  onChange={(e) => setMaxScore(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add any additional details about this assessment"
                rows={3}
              />
            </div>
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setIsDialogOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Uploading..." : "Upload Score"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ScoreUploadForm;
