
import { useState, useEffect } from "react";
import { ArrowUpRight } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "neutral";
  icon: React.ReactNode;
}

const StatsCard = ({ title, value, change, trend, icon }: StatsCardProps) => {
  const trendColor = trend === "up" ? "text-green-500" : trend === "down" ? "text-red-500" : "text-blue-500";
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl neo-morphism animate-scale-in">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className="p-2 rounded-lg bg-primary/10 text-primary">
          {icon}
        </div>
      </div>
      <div className={`mt-2 flex items-center ${trendColor}`}>
        <span className="text-xs font-medium">{change}</span>
        <ArrowUpRight className="h-3 w-3 ml-1" />
      </div>
    </div>
  );
};

const DashboardHeader = () => {
  // Simulate data loading
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[...Array(4)].map((_, index) => (
          <div key={index} className="h-32 animate-pulse bg-gray-200 dark:bg-gray-700 rounded-xl" />
        ))}
      </div>
    );
  }
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <StatsCard 
        title="Lectures Attended" 
        value="18/20" 
        change="+2 this week" 
        trend="up"
        icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>}
      />
      
      <StatsCard 
        title="Study Hours" 
        value="42h" 
        change="+8h this week" 
        trend="up"
        icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>}
      />
      
      <StatsCard 
        title="Notes Created" 
        value="24" 
        change="+5 this week" 
        trend="up"
        icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>}
      />
      
      <StatsCard 
        title="Average Grade" 
        value="A-" 
        change="Up 1 grade" 
        trend="up"
        icon={<svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>}
      />
    </div>
  );
};

export default DashboardHeader;
