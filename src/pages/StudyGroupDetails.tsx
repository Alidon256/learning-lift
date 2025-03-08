
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { StudyGroup } from "@/models/StudyGroup";
import { studyGroupService } from "@/services/StudyGroupService";
import NavigationDrawer from "@/components/layout/NavigationDrawer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { Loader2, ArrowLeft, Users, Calendar, BookOpen, Shield, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/components/ui/use-toast";
import { Separator } from "@/components/ui/separator";
import StudyGroupChatPanel from "@/components/study-groups/StudyGroupChatPanel";
import UpcomingSessionsPanel from "@/components/study-groups/UpcomingSessionsPanel";
import ResourcesPanel from "@/components/study-groups/ResourcesPanel";
import GroupMembersPanel from "@/components/study-groups/GroupMembersPanel";
import VideoConferencePanel from "@/components/study-groups/VideoConferencePanel";
import AddResourceDialog from "@/components/study-groups/AddResourceDialog";
import AddSessionDialog from "@/components/study-groups/AddSessionDialog";
import { format } from "date-fns";

const StudyGroupDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [studyGroup, setStudyGroup] = useState<StudyGroup | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchStudyGroup(id);
    }
  }, [id]);

  const fetchStudyGroup = async (groupId: string) => {
    setIsLoading(true);
    try {
      const group = await studyGroupService.getStudyGroupById(groupId);
      if (group) {
        // Add mock status for UI demo
        const enhancedMembers = group.members.map(member => ({
          ...member,
          status: Math.random() > 0.5 ? 'online' : 'offline',
          lastSeen: member.status === 'offline' ? 
            new Date(Date.now() - Math.floor(Math.random() * 48) * 60 * 60 * 1000).toISOString() : 
            undefined
        }));
        
        setStudyGroup({
          ...group,
          members: enhancedMembers
        });
      } else {
        toast({
          title: "Group not found",
          description: "The study group you're looking for doesn't exist.",
          variant: "destructive",
        });
        navigate("/study-groups");
      }
    } catch (error) {
      console.error("Error fetching study group:", error);
      toast({
        title: "Error",
        description: "Failed to load study group details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinGroup = async () => {
    if (!id || !studyGroup) return;
    
    setIsJoining(true);
    try {
      const updatedGroup = await studyGroupService.joinStudyGroup(id);
      setStudyGroup(updatedGroup);
      toast({
        title: "Joined group",
        description: `You've successfully joined "${studyGroup.name}".`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to join the study group.",
        variant: "destructive",
      });
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveGroup = async () => {
    if (!id || !studyGroup) return;
    
    setIsLeaving(true);
    try {
      const updatedGroup = await studyGroupService.leaveStudyGroup(id);
      setStudyGroup(updatedGroup);
      toast({
        title: "Left group",
        description: `You've left "${studyGroup.name}".`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: (error as Error).message || "Failed to leave the study group.",
        variant: "destructive",
      });
    } finally {
      setIsLeaving(false);
    }
  };

  const isCurrentUserMember = studyGroup?.members.some(member => member.id === "current-user");
  const isCurrentUserAdmin = studyGroup?.members.some(member => member.id === "current-user" && member.role === "admin");
  const onlineMembers = studyGroup?.members.filter(member => member.status === 'online').length || 0;

  if (isLoading) {
    return (
      <>
        <NavigationDrawer />
        <div className="container max-w-6xl py-12">
          <div className="h-60 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading study group details...</p>
          </div>
        </div>
      </>
    );
  }

  if (!studyGroup) {
    return null; // This should not happen due to navigation in fetchStudyGroup
  }

  return (
    <>
      <NavigationDrawer />
      
      <motion.div 
        className="container max-w-6xl py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-2 mb-6">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate("/study-groups")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-semibold">Back to Study Groups</h2>
          <div className="ml-auto">
            <ThemeToggle />
          </div>
        </div>

        {studyGroup.coverImage && (
          <div className="h-48 md:h-64 w-full overflow-hidden rounded-xl mb-6">
            <img 
              src={studyGroup.coverImage} 
              alt={studyGroup.name} 
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-3xl font-bold">{studyGroup.name}</h1>
              <Badge className="bg-primary/20 text-primary">{studyGroup.subject}</Badge>
              {studyGroup.isPublic ? (
                <Badge variant="outline">Public</Badge>
              ) : (
                <Badge variant="outline">Private</Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-2">{studyGroup.description}</p>
            <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                {studyGroup.members.length} members • {onlineMembers} online
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Created {format(new Date(studyGroup.createdAt), "MMM d, yyyy")}
              </div>
            </div>
          </div>

          {isCurrentUserMember ? (
            <div className="flex gap-2">
              {isCurrentUserAdmin && (
                <>
                  <AddSessionDialog 
                    groupId={studyGroup.id} 
                    onSessionAdded={() => fetchStudyGroup(studyGroup.id)}
                  />
                  <AddResourceDialog 
                    groupId={studyGroup.id} 
                    onResourceAdded={() => fetchStudyGroup(studyGroup.id)}
                  />
                </>
              )}
              <Button 
                variant="outline" 
                onClick={handleLeaveGroup} 
                disabled={isLeaving}
              >
                {isLeaving ? "Leaving..." : "Leave Group"}
              </Button>
            </div>
          ) : (
            <Button 
              onClick={handleJoinGroup} 
              disabled={isJoining}
            >
              {isJoining ? "Joining..." : "Join Group"}
            </Button>
          )}
        </div>

        <Tabs defaultValue="chat" className="mt-6">
          <TabsList className="mb-4">
            <TabsTrigger value="chat" className="flex items-center gap-1">
              Chat
            </TabsTrigger>
            <TabsTrigger value="video" className="flex items-center gap-1">
              <Video className="h-4 w-4 mr-1" />
              Video Conference
            </TabsTrigger>
            <TabsTrigger value="sessions" className="flex items-center gap-1">
              Sessions
            </TabsTrigger>
            <TabsTrigger value="resources" className="flex items-center gap-1">
              Resources
            </TabsTrigger>
            <TabsTrigger value="members" className="flex items-center gap-1">
              Members
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="chat" className="mt-0">
            {isCurrentUserMember ? (
              <div className="h-[calc(70vh-200px)]">
                <StudyGroupChatPanel 
                  group={studyGroup} 
                  onMessageSent={setStudyGroup}
                />
              </div>
            ) : (
              <div className="bg-muted/30 p-6 rounded-lg text-center">
                <Shield className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium mb-2">Members Only</h3>
                <p className="text-muted-foreground mb-4">You need to join this group to participate in the chat.</p>
                <Button onClick={handleJoinGroup} disabled={isJoining}>
                  {isJoining ? "Joining..." : "Join Group"}
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="video" className="mt-0">
            {isCurrentUserMember ? (
              <VideoConferencePanel
                group={studyGroup}
                onConferenceEnded={() => fetchStudyGroup(studyGroup.id)}
              />
            ) : (
              <div className="bg-muted/30 p-6 rounded-lg text-center">
                <Video className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
                <h3 className="text-lg font-medium mb-2">Members Only</h3>
                <p className="text-muted-foreground mb-4">You need to join this group to participate in video conferences.</p>
                <Button onClick={handleJoinGroup} disabled={isJoining}>
                  {isJoining ? "Joining..." : "Join Group"}
                </Button>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="sessions" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <UpcomingSessionsPanel sessions={studyGroup.sessions} />
              </div>
              <div>
                {isCurrentUserAdmin && (
                  <div className="bg-muted/30 p-4 rounded-lg mb-4">
                    <h3 className="font-medium mb-2">Admin Controls</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      As an admin, you can schedule new study sessions for the group.
                    </p>
                    <AddSessionDialog 
                      groupId={studyGroup.id} 
                      onSessionAdded={() => fetchStudyGroup(studyGroup.id)}
                    />
                  </div>
                )}
                
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Study Session Tips</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Set clear objectives for each session</li>
                    <li>• Take short breaks every 25-30 minutes</li>
                    <li>• Rotate discussion leaders for different topics</li>
                    <li>• Use the chat to share insights during sessions</li>
                    <li>• Follow up with summary notes after each session</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="resources" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <ResourcesPanel resources={studyGroup.resources} />
              </div>
              <div>
                {isCurrentUserMember && (
                  <div className="bg-muted/30 p-4 rounded-lg mb-4">
                    <h3 className="font-medium mb-2">Share Resources</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Help your group by sharing useful links, files, or study notes.
                    </p>
                    <AddResourceDialog 
                      groupId={studyGroup.id} 
                      onResourceAdded={() => fetchStudyGroup(studyGroup.id)}
                    />
                  </div>
                )}
                
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Resource Guidelines</h3>
                  <ul className="text-sm text-muted-foreground space-y-2">
                    <li>• Share resources relevant to the group's subject</li>
                    <li>• Include a clear title that describes the content</li>
                    <li>• Consider adding a short description when sharing</li>
                    <li>• Verify that links are working before sharing</li>
                    <li>• Respect copyright and intellectual property</li>
                  </ul>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="members" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <GroupMembersPanel members={studyGroup.members} />
              </div>
              <div>
                <div className="bg-muted/30 p-4 rounded-lg">
                  <h3 className="font-medium mb-2">Group Roles</h3>
                  <div className="space-y-3 text-sm">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">Admin</Badge>
                        <span className="font-medium">Group Administrator</span>
                      </div>
                      <p className="text-muted-foreground">
                        Can schedule sessions, manage resources, and moderate the group.
                      </p>
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant="outline">Member</Badge>
                        <span className="font-medium">Regular Member</span>
                      </div>
                      <p className="text-muted-foreground">
                        Can participate in discussions, attend sessions, and share resources.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </>
  );
};

export default StudyGroupDetails;
