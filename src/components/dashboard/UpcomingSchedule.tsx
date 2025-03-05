
import { Calendar, Clock } from "lucide-react";

const scheduleItems = [
  {
    title: "AI Fundamentals Lecture",
    time: "10:00 AM - 11:30 AM",
    location: "Room 302",
    type: "lecture"
  },
  {
    title: "Data Structures Tutorial",
    time: "1:15 PM - 2:45 PM",
    location: "Online (Zoom)",
    type: "tutorial"
  }
];

const UpcomingSchedule = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl neo-morphism animate-scale-in">
      <h3 className="text-lg font-semibold mb-4">Upcoming Schedule</h3>
      
      <div className="space-y-4">
        {scheduleItems.map((item, index) => (
          <div 
            key={index}
            className="p-4 border-l-4 border-primary bg-primary/5 rounded-r-lg transition-all hover:translate-x-1"
          >
            <h4 className="font-medium text-primary">{item.title}</h4>
            <div className="flex items-center mt-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4 mr-1" />
              <span>{item.time}</span>
            </div>
            <div className="flex items-center mt-1 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span>{item.location}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingSchedule;
