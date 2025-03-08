
import { StudyGroup } from "@/models/StudyGroup";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";
import { format } from "date-fns";

interface StudyGroupCardProps {
  group: StudyGroup;
}

const StudyGroupCard = ({ group }: StudyGroupCardProps) => {
  const nextSession = group.sessions.find(s => !s.isCompleted && new Date(s.date) > new Date());
  
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      {group.coverImage && (
        <div className="h-32 overflow-hidden">
          <img 
            src={group.coverImage} 
            alt={group.name} 
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
        </div>
      )}
      
      <CardHeader className="p-4 pb-0">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{group.name}</h3>
            <Badge variant="outline" className="mt-1">{group.subject}</Badge>
          </div>
          <div className="flex -space-x-2">
            {group.members.slice(0, 3).map(member => (
              <Avatar key={member.id} className="border-2 border-background w-8 h-8">
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
            ))}
            {group.members.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center border-2 border-background text-xs">
                +{group.members.length - 3}
              </div>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{group.description}</p>
        
        <div className="space-y-1">
          <div className="flex items-center text-xs text-muted-foreground">
            <Users className="h-3.5 w-3.5 mr-1" />
            {group.members.length} members
          </div>
          
          {group.resources.length > 0 && (
            <div className="flex items-center text-xs text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5 mr-1" />
              {group.resources.length} resources
            </div>
          )}
          
          {nextSession && (
            <div className="flex items-center text-xs text-primary">
              <CalendarDays className="h-3.5 w-3.5 mr-1" />
              Next session: {format(new Date(nextSession.date), "MMM d, h:mm a")}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="p-4 pt-0">
        <Link to={`/study-groups/${group.id}`} className="w-full">
          <Button variant="outline" className="w-full">View Group</Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default StudyGroupCard;
