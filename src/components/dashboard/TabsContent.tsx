
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentNotes from "./RecentNotes";
import ResourceList from "./ResourceList";
import PerformanceMetrics from "./PerformanceMetrics";

const TabsContainer = () => {
  const [activeTab, setActiveTab] = useState("recent-notes");
  
  return (
    <Tabs defaultValue="recent-notes" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="recent-notes">Recent Notes</TabsTrigger>
        <TabsTrigger value="performance">Performance</TabsTrigger>
        <TabsTrigger value="resources">Resources</TabsTrigger>
      </TabsList>
      
      <TabsContent value="recent-notes" className="animate-fade-in">
        <RecentNotes />
      </TabsContent>
      
      <TabsContent value="performance" className="animate-fade-in">
        <PerformanceMetrics />
      </TabsContent>
      
      <TabsContent value="resources" className="animate-fade-in">
        <ResourceList />
      </TabsContent>
    </Tabs>
  );
};

export default TabsContainer;
