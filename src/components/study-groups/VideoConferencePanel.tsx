
import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { VideoConferenceSession, VideoConferenceParticipant, StudyGroup } from "@/models/StudyGroup";
import { Mic, MicOff, Video, VideoOff, PhoneOff, MonitorUp, MessageSquare, Users, Settings, Share2 } from "lucide-react";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { toast } from '@/components/ui/use-toast';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

interface VideoConferencePanelProps {
  group: StudyGroup;
  onConferenceEnded?: () => void;
}

const VideoConferencePanel = ({ group, onConferenceEnded }: VideoConferencePanelProps) => {
  const [isJoiningCall, setIsJoiningCall] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [activeConference, setActiveConference] = useState<VideoConferenceSession | null>(group.activeConference || null);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeTab, setActiveTab] = useState<'call' | 'chat' | 'participants'>('call');

  // Mock participants data - in a real app, this would come from a real-time service
  const [participants, setParticipants] = useState<VideoConferenceParticipant[]>(
    activeConference?.participants || [
      {
        userId: 'u1',
        userName: 'Alex Johnson',
        joinedAt: new Date().toISOString(),
        isVideo: true,
        isAudio: true,
        isScreenSharing: false
      },
      {
        userId: 'current-user',
        userName: 'Current User',
        joinedAt: new Date().toISOString(),
        isVideo: true,
        isAudio: true,
        isScreenSharing: false
      }
    ]
  );

  // References for video elements
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRefs = useRef<{ [key: string]: HTMLVideoElement }>({});

  // Mock function to start video conference - in a real app, this would connect to a WebRTC service
  const startVideoConference = async () => {
    setIsJoiningCall(true);
    
    try {
      // In a real app, you would:
      // 1. Connect to your video conferencing service (WebRTC, Twilio, etc.)
      // 2. Get local media streams
      // 3. Join a room
      // 4. Connect with other participants
      
      // Simulate the process with a delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock getting user media
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          
          // In a real app, you would now initialize WebRTC connections here
          
          // Create a mock active conference
          const newConference: VideoConferenceSession = {
            id: 'vc-' + Date.now(),
            hostId: 'current-user',
            title: `${group.name} Conference`,
            started: new Date().toISOString(),
            status: 'active',
            participants: participants,
            roomId: 'room-' + Date.now(),
            settings: {
              allowChat: true,
              allowScreenShare: true,
              muteOnEntry: false,
              waitingRoom: false,
              recordSession: false
            }
          };
          
          setActiveConference(newConference);
          setIsInCall(true);
          
          toast({
            title: "Call Connected",
            description: "You've joined the video conference",
          });
        } catch (err) {
          console.error("Error accessing media devices:", err);
          toast({
            title: "Camera/Microphone Error",
            description: "Could not access your camera or microphone",
            variant: "destructive"
          });
        }
      } else {
        toast({
          title: "Not Supported",
          description: "Video conferencing is not supported in this browser",
          variant: "destructive"
        });
      }
    } finally {
      setIsJoiningCall(false);
    }
  };

  const endCall = () => {
    // In a real app, you would:
    // 1. Disconnect from the video conferencing service
    // 2. Release media streams
    // 3. Update the UI
    
    // Stop local video
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const tracks = (localVideoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach(track => track.stop());
      localVideoRef.current.srcObject = null;
    }
    
    setIsInCall(false);
    setActiveConference(null);
    
    if (onConferenceEnded) {
      onConferenceEnded();
    }
    
    toast({
      title: "Call Ended",
      description: "You've left the video conference",
    });
  };

  const toggleMic = () => {
    setIsMicOn(!isMicOn);
    
    // In a real app, you would toggle the audio track here
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const audioTrack = (localVideoRef.current.srcObject as MediaStream)
        .getAudioTracks()[0];
      
      if (audioTrack) {
        audioTrack.enabled = !isMicOn;
      }
    }
  };

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    
    // In a real app, you would toggle the video track here
    if (localVideoRef.current && localVideoRef.current.srcObject) {
      const videoTrack = (localVideoRef.current.srcObject as MediaStream)
        .getVideoTracks()[0];
      
      if (videoTrack) {
        videoTrack.enabled = !isVideoOn;
      }
    }
  };

  const toggleScreenShare = async () => {
    // In a real app, you would implement screen sharing here using the Screen Capture API
    try {
      if (!isScreenSharing) {
        // This is a mock implementation - in a real app, you would actually capture the screen
        toast({
          title: "Screen Sharing Started",
          description: "Others can now see your screen",
        });
      } else {
        toast({
          title: "Screen Sharing Stopped",
          description: "Your screen is no longer visible to others",
        });
      }
      
      setIsScreenSharing(!isScreenSharing);
    } catch (err) {
      console.error("Error sharing screen:", err);
      toast({
        title: "Screen Sharing Error",
        description: "Could not share your screen",
        variant: "destructive"
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Study Session Video Conference</CardTitle>
            <CardDescription>
              Connect with your study group members in real-time
            </CardDescription>
          </div>
          {isInCall && (
            <Badge className="bg-green-500/20 text-green-600">
              Active Call • {participants.length} Participants
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {!isInCall ? (
          <div className="text-center py-10">
            <div className="mx-auto mb-6 bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center">
              <Video className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Start a Video Conference</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Connect with your study group members in real-time to discuss topics, review material, and collaborate.
            </p>
            <Button 
              size="lg" 
              onClick={startVideoConference} 
              disabled={isJoiningCall}
            >
              {isJoiningCall ? "Connecting..." : "Start Video Conference"}
            </Button>
          </div>
        ) : (
          <div>
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
              <TabsList className="mb-4">
                <TabsTrigger value="call">Video Call</TabsTrigger>
                <TabsTrigger value="chat">Chat</TabsTrigger>
                <TabsTrigger value="participants">Participants</TabsTrigger>
              </TabsList>
              
              <TabsContent value="call" className="mt-0">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                  {/* Local video - current user */}
                  <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
                    {isVideoOn ? (
                      <video
                        ref={localVideoRef}
                        className="w-full h-full object-cover mirror-mode"
                        autoPlay
                        muted
                        playsInline
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-muted">
                        <Avatar className="h-20 w-20">
                          <AvatarImage src="https://i.pravatar.cc/150?u=current" />
                          <AvatarFallback>CU</AvatarFallback>
                        </Avatar>
                      </div>
                    )}
                    <div className="absolute bottom-2 left-2 flex items-center gap-1">
                      <Badge className="bg-primary/80">You</Badge>
                      {!isMicOn && (
                        <Badge className="bg-red-500/80">
                          <MicOff className="h-3 w-3 mr-1" />
                          Muted
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {/* Remote videos - other participants */}
                  {participants
                    .filter(p => p.userId !== 'current-user')
                    .map((participant) => (
                      <div 
                        key={participant.userId} 
                        className="relative bg-muted rounded-lg overflow-hidden aspect-video"
                      >
                        <div className="w-full h-full flex items-center justify-center bg-muted">
                          <Avatar className="h-20 w-20">
                            <AvatarImage src={`https://i.pravatar.cc/150?u=${participant.userId}`} />
                            <AvatarFallback>
                              {participant.userName.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="absolute bottom-2 left-2 flex items-center gap-1">
                          <Badge className="bg-secondary/80">{participant.userName}</Badge>
                          {!participant.isAudio && (
                            <Badge className="bg-red-500/80">
                              <MicOff className="h-3 w-3 mr-1" />
                              Muted
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
                
                {/* Video controls */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant={isMicOn ? "outline" : "secondary"} 
                          size="icon" 
                          onClick={toggleMic}
                        >
                          {isMicOn ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isMicOn ? "Mute Microphone" : "Unmute Microphone"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant={isVideoOn ? "outline" : "secondary"} 
                          size="icon" 
                          onClick={toggleVideo}
                        >
                          {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isVideoOn ? "Turn Off Camera" : "Turn On Camera"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant={isScreenSharing ? "secondary" : "outline"} 
                          size="icon" 
                          onClick={toggleScreenShare}
                        >
                          <MonitorUp className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isScreenSharing ? "Stop Screen Sharing" : "Share Screen"}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => setActiveTab('chat')}
                        >
                          <MessageSquare className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Open Chat</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="icon" 
                          onClick={() => setActiveTab('participants')}
                        >
                          <Users className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>View Participants</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="icon">
                        <Settings className="h-5 w-5" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Call Settings</DialogTitle>
                        <DialogDescription>
                          Adjust your video conference settings
                        </DialogDescription>
                      </DialogHeader>
                      <div className="py-4">
                        <p className="text-sm text-muted-foreground">
                          Settings panel would include options for camera, microphone selection, audio levels,
                          background effects, etc.
                        </p>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="destructive" 
                          size="icon" 
                          onClick={endCall}
                        >
                          <PhoneOff className="h-5 w-5" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>End Call</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
                
                <div className="text-center">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" className="gap-2">
                        <Share2 className="h-4 w-4" />
                        Invite Others
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Invite to Conference</DialogTitle>
                        <DialogDescription>
                          Share this link with others to join the call
                        </DialogDescription>
                      </DialogHeader>
                      <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <code className="text-xs flex-1 truncate">
                          https://studyapp.com/join/{activeConference?.roomId}
                        </code>
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => {
                            navigator.clipboard.writeText(`https://studyapp.com/join/${activeConference?.roomId}`);
                            toast({
                              title: "Copied!",
                              description: "Link copied to clipboard",
                            });
                          }}
                        >
                          Copy
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </TabsContent>
              
              <TabsContent value="chat" className="mt-0">
                <div className="h-[400px] flex flex-col border rounded-md overflow-hidden">
                  <div className="p-3 border-b bg-muted/30">
                    <h3 className="font-medium">Conference Chat</h3>
                  </div>
                  
                  <ScrollArea className="flex-grow p-4">
                    <div className="text-center text-muted-foreground text-sm py-10">
                      Chat messages will appear here during the conference
                    </div>
                  </ScrollArea>
                  
                  <div className="p-3 border-t">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Type a message..."
                        className="flex-grow rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                      />
                      <Button size="sm">Send</Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="participants" className="mt-0">
                <div className="bg-card border rounded-md p-4">
                  <h3 className="font-medium mb-3">Participants ({participants.length})</h3>
                  <ScrollArea className="h-[350px]">
                    <div className="space-y-2">
                      {participants.map(participant => (
                        <div key={participant.userId} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`https://i.pravatar.cc/150?u=${participant.userId}`} />
                              <AvatarFallback>
                                {participant.userName.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="text-sm font-medium">
                                {participant.userName}
                                {participant.userId === 'current-user' && " (You)"}
                              </div>
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {participant.isScreenSharing && (
                                  <Badge variant="outline" className="text-xs h-5 px-1">
                                    Sharing Screen
                                  </Badge>
                                )}
                                {!participant.isAudio && (
                                  <span className="flex items-center">
                                    <MicOff className="h-3 w-3 mr-1" />
                                    Muted
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {participant.userId === activeConference?.hostId && (
                            <Badge variant="outline" className="text-xs">Host</Badge>
                          )}
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VideoConferencePanel;
