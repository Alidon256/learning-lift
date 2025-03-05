
import { CheckCircle2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const UserProfile = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl neo-morphism mb-8 animate-scale-in">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-3xl font-bold text-primary">
            JD
          </div>
          <h2 className="text-xl font-bold mt-3">John Doe</h2>
          <p className="text-sm text-muted-foreground">Computer Science Student</p>
        </div>
        
        <div className="flex-1 space-y-4 w-full">
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Course Progress</label>
              <span className="text-sm font-medium">78%</span>
            </div>
            <Progress value={78} className="h-2" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Assignment Completion</label>
              <span className="text-sm font-medium">65%</span>
            </div>
            <Progress value={65} className="h-2" />
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Attendance</label>
              <span className="text-sm font-medium">92%</span>
            </div>
            <Progress value={92} className="h-2" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
