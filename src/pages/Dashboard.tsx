
import { useState, useEffect } from "react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import UserProfile from "@/components/dashboard/UserProfile";
import UpcomingSchedule from "@/components/dashboard/UpcomingSchedule";
import TabsContent from "@/components/dashboard/TabsContent";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-primary animate-spin mx-auto mb-4" />
          <p className="text-lg font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-8 max-w-7xl animate-fade-in">
      <DashboardHeader />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="md:col-span-2 space-y-8">
          <UserProfile />
          <TabsContent />
        </div>
        
        <div className="space-y-8">
          <UpcomingSchedule />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
