
import { StudyGroupSession } from "@/models/StudyGroup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { format, isAfter, isPast } from "date-fns";

interface UpcomingSessionsPanelProps {
  sessions: StudyGroupSession[];
}

const UpcomingSessionsPanel = ({ sessions }: UpcomingSessionsPanelProps) => {
  const sortedSessions = [...sessions].sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );
  
  const upcomingSessions = sortedSessions.filter(session => 
    isAfter(new Date(session.date), new Date()) && !session.isCompleted
  );
  
  const pastSessions = sortedSessions.filter(session => 
    isPast(new Date(session.date)) || session.isCompleted
  );
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Study Sessions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingSessions.length > 0 ? (
            <div className="space-y-3">
              <h3 className="text-sm font-medium">Upcoming Sessions</h3>
              {upcomingSessions.map((session) => (
                <SessionItem key={session.id} session={session} />
              ))}
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              No upcoming sessions scheduled
            </div>
          )}
          
          {pastSessions.length > 0 && (
            <div className="space-y-3 pt-2">
              <h3 className="text-sm font-medium">Past Sessions</h3>
              <div className="opacity-70">
                {pastSessions.slice(0, 3).map((session) => (
                  <SessionItem key={session.id} session={session} isPast />
                ))}
                {pastSessions.length > 3 && (
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    +{pastSessions.length - 3} more past sessions
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

interface SessionItemProps {
  session: StudyGroupSession;
  isPast?: boolean;
}

const SessionItem = ({ session, isPast = false }: SessionItemProps) => {
  return (
    <div className="border rounded-lg p-3 space-y-2">
      <div className="flex justify-between items-start">
        <h4 className="font-medium">{session.title}</h4>
        {session.isCompleted ? (
          <Badge variant="outline" className="bg-muted">Completed</Badge>
        ) : isPast ? (
          <Badge variant="outline" className="bg-amber-500/10 text-amber-500">Missed</Badge>
        ) : (
          <Badge variant="outline" className="bg-green-500/10 text-green-500">Upcoming</Badge>
        )}
      </div>
      <p className="text-sm text-muted-foreground">{session.topic}</p>
      <div className="flex gap-4">
        <div className="flex items-center text-xs">
          <Calendar className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          {format(new Date(session.date), "MMM d, yyyy")}
        </div>
        <div className="flex items-center text-xs">
          <Clock className="h-3.5 w-3.5 mr-1 text-muted-foreground" />
          {format(new Date(session.date), "h:mm a")} ({session.duration} min)
        </div>
      </div>
    </div>
  );
};

export default UpcomingSessionsPanel;
