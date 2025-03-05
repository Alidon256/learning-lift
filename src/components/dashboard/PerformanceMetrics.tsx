
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface Quiz {
  title: string;
  score: number;
  status: "passed" | "warning" | "failed";
}

interface Subject {
  name: string;
  grade: string;
  progress: number;
}

const quizzes: Quiz[] = [
  { title: "AI Ethics Quiz", score: 92, status: "passed" },
  { title: "Machine Learning Basics", score: 88, status: "passed" },
  { title: "Data Structures", score: 75, status: "passed" },
  { title: "Neural Networks", score: 65, status: "warning" },
  { title: "Programming Fundamentals", score: 95, status: "passed" },
];

const subjects: Subject[] = [
  { name: "Artificial Intelligence", grade: "A", progress: 92 },
  { name: "Data Structures", grade: "B+", progress: 85 },
  { name: "Machine Learning", grade: "A-", progress: 88 },
  { name: "Computer Networks", grade: "B", progress: 78 },
];

const PerformanceMetrics = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl neo-morphism animate-scale-in">
        <h3 className="text-lg font-medium mb-4">Quiz Performance</h3>
        <p className="text-sm text-muted-foreground mb-4">Last 5 quizzes</p>
        
        <div className="space-y-4">
          {quizzes.map((quiz, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="font-medium">{quiz.title}</span>
              <div className="flex items-center gap-2">
                <span className="font-medium">{quiz.score}%</span>
                {quiz.status === "passed" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : quiz.status === "warning" ? (
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl neo-morphism animate-scale-in">
        <h3 className="text-lg font-medium mb-4">Subject Performance</h3>
        <p className="text-sm text-muted-foreground mb-4">Current semester</p>
        
        <div className="space-y-6">
          {subjects.map((subject, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium">{subject.name}</span>
                <span className="font-medium">{subject.grade}</span>
              </div>
              <Progress value={subject.progress} className="h-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PerformanceMetrics;
