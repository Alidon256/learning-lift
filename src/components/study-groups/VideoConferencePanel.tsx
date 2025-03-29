
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { StudyGroup, VideoConferenceSession, VideoConferenceParticipant } from "@/models/StudyGroup";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Mic, MicOff, Video, VideoOff, ScreenShare, User, UserPlus, MessageSquare, Settings } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { v4 as uuidv4 } from "uuid";

interface VideoConferencePanelProps {
  group: StudyGroup;
  onConferenceEnded: () => void;
}

const VideoConferencePanel = ({ group, onConferenceEnded }: VideoConferencePanelProps) => {
  const [isStarting, setIsStarting] = useState(false);
  const activeSession = group.activeConference;
  
  const handleStartConference = () => {
    setIsStarting(true);
    
    // Create a new video conference session
    const newSession: VideoConferenceSession = {
      id: uuidv4(),
      hostId: "current-user", // In a real app, this would be the current user's ID
      title: "Study Group Session",
      started: new Date().toISOString(),
      status: "active",
      participants: [
        {
          userId: "current-user",
          userName: "John Doe",
          joinedAt: new Date().toISOString(),
          isVideo: true,
          isAudio: true,
          isScreenSharing: false,
          networkQuality: "excellent",
        }
      ],
      roomId: uuidv4(),
      duration: 0, // Initialize with 0 minutes
      settings: {
        allowChat: true,
        allowScreenShare: true,
        muteOnEntry: false,
        waitingRoom: false,
        recordSession: false,
      }
    };
    
    // In a real app, this would connect to a video conferencing service
    setTimeout(() => {
      onConferenceEnded();
      setIsStarting(false);
    }, 1500);
  };
  
  if (!activeSession) {
    return (
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-xl">Video Conference</CardTitle>
          <CardDescription>Start a video conference with group members</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
            <Video className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-lg font-medium mb-2">No active conference</h3>
          <p className="text-muted-foreground text-sm mb-6">Start a new conference to collaborate with your study group members in real-time.</p>
        </CardContent>
        <CardFooter className="flex justify-center pb-6">
          <Button size="lg" onClick={handleStartConference} disabled={isStarting}>
            {isStarting ? "Starting conference..." : "Start New Conference"}
          </Button>
        </CardFooter>
      </Card>
    );
  }
  
  return (
    <Card className="shadow-md">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl flex items-center gap-2">
              Video Conference
              <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-200">Live</Badge>
            </CardTitle>
            <CardDescription>{activeSession.title}</CardDescription>
          </div>
          <Button variant="destructive" size="sm" onClick={onConferenceEnded}>
            End Call
          </Button>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4 pt-4">
        <div className="grid grid-cols-2 gap-2">
          {activeSession.participants.map((participant) => (
            <ParticipantCard key={participant.userId} participant={participant} />
          ))}
        </div>
        
        <div className="flex justify-center mt-4 space-x-2">
          <Button size="icon" variant="outline" className="rounded-full w-10 h-10">
            <Mic className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="outline" className="rounded-full w-10 h-10">
            <Video className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="outline" className="rounded-full w-10 h-10">
            <ScreenShare className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="outline" className="rounded-full w-10 h-10">
            <MessageSquare className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="outline" className="rounded-full w-10 h-10">
            <UserPlus className="h-5 w-5" />
          </Button>
          <Button size="icon" variant="outline" className="rounded-full w-10 h-10">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </CardContent>
      
      <CardFooter className="text-sm text-muted-foreground">
        <div className="flex items-center justify-between w-full">
          <span>Room ID: {activeSession.roomId.slice(0, 8)}...</span>
          <span>{activeSession.participants.length} participants</span>
        </div>
      </CardFooter>
    </Card>
  );
};

interface ParticipantCardProps {
  participant: VideoConferenceParticipant;
}

const ParticipantCard = ({ participant }: ParticipantCardProps) => {
  return (
    <div className="relative h-36 bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
      {participant.isVideo ? (
        <div className="h-full w-full flex items-center justify-center bg-gray-800">
          <Avatar className="h-20 w-20">
            <AvatarImage src={`https://i.pravatar.cc/150?u=${participant.userId}`} />
            <AvatarFallback>{participant.userName.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
      ) : (
        <div className="h-full w-full flex items-center justify-center">
          <div className="text-center">
            <Avatar className="h-16 w-16 mx-auto mb-2">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${participant.userId}`} />
              <AvatarFallback>{participant.userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <p className="text-sm font-medium">{participant.userName}</p>
          </div>
        </div>
      )}
      
      <div className="absolute bottom-2 left-2 flex space-x-1">
        {!participant.isAudio && (
          <div className="bg-gray-900/80 rounded-full p-1">
            <MicOff className="h-3 w-3 text-white" />
          </div>
        )}
        {!participant.isVideo && (
          <div className="bg-gray-900/80 rounded-full p-1">
            <VideoOff className="h-3 w-3 text-white" />
          </div>
        )}
        {participant.isScreenSharing && (
          <div className="bg-primary/80 rounded-full p-1">
            <ScreenShare className="h-3 w-3 text-white" />
          </div>
        )}
      </div>
      
      <div className="absolute top-2 right-2">
        {participant.networkQuality && (
          <Badge variant="outline" className="text-xs border-none bg-black/40 text-white">
            {participant.networkQuality === "excellent" ? "HD" : 
             participant.networkQuality === "good" ? "Good" : 
             participant.networkQuality === "fair" ? "Fair" : "Poor"}
          </Badge>
        )}
      </div>
    </div>
  );
};

export default VideoConferencePanel;
