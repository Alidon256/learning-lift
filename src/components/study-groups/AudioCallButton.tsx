
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { StudyGroup, StudyGroupMember } from "@/models/StudyGroup";
import { Phone, PhoneOff, Mic, MicOff, Volume2, VolumeX } from "lucide-react";

interface AudioCallButtonProps {
  group: StudyGroup;
  onlineMembers: StudyGroupMember[];
}

const AudioCallButton = ({ group, onlineMembers }: AudioCallButtonProps) => {
  const [isDialing, setIsDialing] = useState(false);
  const [isInCall, setIsInCall] = useState(false);
  const [activeParticipants, setActiveParticipants] = useState<StudyGroupMember[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [callTimer, setCallTimer] = useState<NodeJS.Timeout | null>(null);

  const startCall = () => {
    setIsDialing(true);
    
    // Simulate connecting to other members
    setTimeout(() => {
      // In a real app, this would connect to a WebRTC or other audio streaming service
      setIsDialing(false);
      setIsInCall(true);
      
      // Add the current user and a random selection of online members
      const currentUser: StudyGroupMember = {
        id: 'current-user',
        name: 'You',
        role: 'member',
        joinedAt: new Date().toISOString(),
        status: 'online'
      };
      
      // Randomly select 1-3 other online members to join the call
      const otherParticipants = onlineMembers
        .filter(member => member.id !== 'current-user')
        .sort(() => 0.5 - Math.random())
        .slice(0, Math.floor(Math.random() * 3) + 1);
      
      setActiveParticipants([currentUser, ...otherParticipants]);
      
      // Start call timer
      const timer = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      setCallTimer(timer);
      
      toast({
        title: "Call Connected",
        description: "Audio call has started",
      });
    }, 2000);
  };

  const endCall = () => {
    setIsInCall(false);
    setActiveParticipants([]);
    
    // Clear the timer
    if (callTimer) {
      clearInterval(callTimer);
      setCallTimer(null);
    }
    
    setCallDuration(0);
    
    toast({
      title: "Call Ended",
      description: "Audio call has ended",
    });
  };

  const formatCallDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    // In a real app, this would toggle the audio track
  };

  const toggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    // In a real app, this would toggle the output device
  };

  return (
    <>
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2" 
        onClick={startCall}
        disabled={isDialing || isInCall || onlineMembers.length === 0}
      >
        <Phone className="h-4 w-4" />
        Audio Call
      </Button>
      
      <Dialog open={isDialing || isInCall} onOpenChange={(open) => {
        if (!open && isInCall) {
          endCall();
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {isDialing ? "Connecting..." : `Audio Call - ${formatCallDuration(callDuration)}`}
            </DialogTitle>
            <DialogDescription>
              {isDialing 
                ? "Connecting to group members" 
                : `${activeParticipants.length} participants in call`}
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-6">
            {isDialing ? (
              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center animate-pulse mb-4">
                  <Phone className="h-8 w-8 text-primary" />
                </div>
                <p>Calling group members...</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-wrap justify-center gap-4 mb-6">
                  {activeParticipants.map((participant) => (
                    <div key={participant.id} className="flex flex-col items-center">
                      <div className="relative">
                        <Avatar className="h-16 w-16 border-2 border-primary/20">
                          <AvatarImage src={participant.avatar || `https://i.pravatar.cc/150?u=${participant.id}`} />
                          <AvatarFallback>{participant.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-background
                          ${participant.id === 'current-user' && isMuted ? 'bg-red-500' : 'bg-green-500'}`} 
                        />
                      </div>
                      <span className="text-sm mt-2">{participant.id === 'current-user' ? 'You' : participant.name}</span>
                      {participant.id === 'current-user' && isMuted && (
                        <Badge variant="outline" className="mt-1 text-xs">Muted</Badge>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center gap-4">
                  <Button
                    variant={isMuted ? "secondary" : "outline"}
                    size="icon"
                    onClick={toggleMute}
                  >
                    {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
                  </Button>
                  
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={endCall}
                  >
                    <PhoneOff className="h-5 w-5" />
                  </Button>
                  
                  <Button
                    variant={isSpeakerOn ? "outline" : "secondary"}
                    size="icon"
                    onClick={toggleSpeaker}
                  >
                    {isSpeakerOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AudioCallButton;
