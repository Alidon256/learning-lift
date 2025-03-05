
import { BookOpen, FileText, Video, ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface Resource {
  id: string;
  title: string;
  source: string;
  type: "pdf" | "video" | "course" | "book";
  relevance: number;
}

const resources: Resource[] = [
  {
    id: "1",
    title: "Introduction to AI Ethics",
    source: "Stanford University",
    type: "pdf",
    relevance: 95
  },
  {
    id: "2",
    title: "Neural Networks Explained",
    source: "MIT OpenCourseWare",
    type: "video",
    relevance: 92
  },
  {
    id: "3",
    title: "Practical Machine Learning",
    source: "Coursera",
    type: "course",
    relevance: 88
  },
  {
    id: "4",
    title: "Advanced Data Structures",
    source: "O'Reilly Media",
    type: "book",
    relevance: 85
  }
];

const ResourceItem = ({ resource }: { resource: Resource }) => {
  const getIcon = () => {
    switch (resource.type) {
      case "pdf":
        return <FileText className="h-5 w-5 text-primary" />;
      case "video":
        return <Video className="h-5 w-5 text-primary" />;
      case "course":
      case "book":
        return <BookOpen className="h-5 w-5 text-primary" />;
    }
  };
  
  const getTypeLabel = () => {
    switch (resource.type) {
      case "pdf":
        return "PDF Article";
      case "video":
        return "Video Tutorial";
      case "course":
        return "Online Course";
      case "book":
        return "E-Book";
    }
  };
  
  return (
    <div className="flex justify-between items-center py-4 border-b last:border-0">
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          {getIcon()}
        </div>
        <div>
          <h4 className="font-medium">{resource.title}</h4>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
            <span>{getTypeLabel()}</span>
            <span>•</span>
            <span>{resource.source}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-sm text-muted-foreground">Relevance</p>
          <p className={cn(
            "font-medium",
            resource.relevance >= 90 ? "text-green-500" : 
            resource.relevance >= 80 ? "text-blue-500" : "text-amber-500"
          )}>
            {resource.relevance}%
          </p>
        </div>
        <Link 
          to={`/resource/${resource.id}`}
          className="p-2 bg-primary/10 rounded-full text-primary hover:bg-primary/20 transition-colors"
        >
          <ArrowUpRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
};

const ResourceList = () => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl neo-morphism animate-scale-in">
      <h3 className="text-lg font-semibold mb-4">Resources</h3>
      <div>
        {resources.map((resource) => (
          <ResourceItem key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );
};

export default ResourceList;
