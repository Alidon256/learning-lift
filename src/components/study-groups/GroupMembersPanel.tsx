
import { StudyGroupMember } from "@/models/StudyGroup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import { 
  Clock, 
  MoreHorizontal, 
  Shield, 
  User, 
  MessageSquare,
  Video,
  UserPlus,
  Mail,
  Star
} from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface GroupMembersPanelProps {
  members: StudyGroupMember[];
  onInviteToVideoCall?: (memberId: string) => void;
  onSendDirectMessage?: (memberId: string) => void;
  isAdmin?: boolean;
}

const GroupMembersPanel = ({ 
  members, 
  onInviteToVideoCall, 
  onSendDirectMessage,
  isAdmin = false 
}: GroupMembersPanelProps) => {
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Sort members by status (online first), then by role (admin first), then by join date
  const sortedMembers = [...members].sort((a, b) => {
    // Online status takes precedence
    if (a.status === "online" && b.status !== "online") return -1;
    if (a.status !== "online" && b.status === "online") return 1;
    
    // Then role
    if (a.role === "admin" && b.role !== "admin") return -1;
    if (a.role !== "admin" && b.role === "admin") return 1;
    
    // Then join date
    return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
  });
  
  // Count online members
  const onlineCount = members.filter(m => m.status === "online").length;
  
  // Filter members by status if filter is active
  const filteredMembers = filterStatus 
    ? sortedMembers.filter(m => m.status === filterStatus)
    : sortedMembers;
  
  const handlePromoteToAdmin = (memberId: string) => {
    toast({
      title: "Action taken",
      description: "Member promoted to admin successfully",
    });
  };
  
  const handleRemoveMember = (memberId: string) => {
    toast({
      title: "Action taken",
      description: "Member removed from group",
    });
  };
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Group Members ({members.length})</CardTitle>
          <Badge variant="outline" className="bg-green-500/10 text-green-500">
            {onlineCount} Online
          </Badge>
        </div>
        
        <div className="flex gap-2 mt-2">
          <Button 
            variant={filterStatus === null ? "secondary" : "outline"} 
            size="sm" 
            onClick={() => setFilterStatus(null)}
            className="text-xs h-7 px-2"
          >
            All
          </Button>
          <Button 
            variant={filterStatus === "online" ? "secondary" : "outline"} 
            size="sm" 
            onClick={() => setFilterStatus("online")}
            className="text-xs h-7 px-2"
          >
            Online
          </Button>
          <Button 
            variant={filterStatus === "offline" ? "secondary" : "outline"} 
            size="sm" 
            onClick={() => setFilterStatus("offline")}
            className="text-xs h-7 px-2"
          >
            Offline
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[420px] pr-4">
          <div className="space-y-3">
            {filteredMembers.map(member => (
              <MemberItem 
                key={member.id} 
                member={member} 
                onInviteToVideoCall={onInviteToVideoCall}
                onSendDirectMessage={onSendDirectMessage}
                isAdmin={isAdmin}
                onPromoteToAdmin={handlePromoteToAdmin}
                onRemoveMember={handleRemoveMember}
              />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

interface MemberItemProps {
  member: StudyGroupMember;
  onInviteToVideoCall?: (memberId: string) => void;
  onSendDirectMessage?: (memberId: string) => void;
  onPromoteToAdmin?: (memberId: string) => void;
  onRemoveMember?: (memberId: string) => void;
  isAdmin?: boolean;
}

const MemberItem = ({ 
  member, 
  onInviteToVideoCall, 
  onSendDirectMessage,
  onPromoteToAdmin,
  onRemoveMember,
  isAdmin 
}: MemberItemProps) => {
  const statusColors = {
    online: "bg-green-500",
    busy: "bg-red-500",
    away: "bg-amber-500",
    offline: "bg-gray-400"
  };
  
  const status = member.status || "offline";
  const statusColor = statusColors[status];
  
  const isCurrentUser = member.id === "current-user";
  
  return (
    <div className="flex items-center justify-between py-1 group rounded-md p-2 hover:bg-muted/50 transition-colors">
      <div className="flex items-center gap-3">
        <div className="relative">
          <Avatar className="h-10 w-10 border border-border">
            <AvatarImage src={member.avatar} />
            <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
          <span
            className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-background ${statusColor}`}
            title={status.charAt(0).toUpperCase() + status.slice(1)}
          />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">
              {member.name} {isCurrentUser && "(You)"}
            </span>
            {member.role === "admin" && (
              <Badge variant="outline" className="text-xs h-5 flex items-center gap-1">
                <Shield className="h-3 w-3" /> Admin
              </Badge>
            )}
          </div>
          <div className="flex items-center text-xs text-muted-foreground gap-2">
            <span>Joined {format(new Date(member.joinedAt), "MMM d, yyyy")}</span>
            {member.status !== "online" && member.lastSeen && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                Last seen {formatDistanceToNow(new Date(member.lastSeen), { addSuffix: true })}
              </span>
            )}
          </div>
        </div>
      </div>
      
      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
              <User className="h-4 w-4" /> View Profile
            </DropdownMenuItem>
            {!isCurrentUser && (
              <>
                <DropdownMenuItem 
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => onSendDirectMessage && onSendDirectMessage(member.id)}
                >
                  <MessageSquare className="h-4 w-4" /> Message
                </DropdownMenuItem>
                {member.status === "online" && (
                  <DropdownMenuItem 
                    className="flex items-center gap-2 cursor-pointer"
                    onClick={() => onInviteToVideoCall && onInviteToVideoCall(member.id)}
                  >
                    <Video className="h-4 w-4" /> Invite to Video Call
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  <Mail className="h-4 w-4" /> Email
                </DropdownMenuItem>
                {isAdmin && member.role !== "admin" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="flex items-center gap-2 cursor-pointer text-blue-500"
                      onClick={() => onPromoteToAdmin && onPromoteToAdmin(member.id)}
                    >
                      <Star className="h-4 w-4" /> Promote to Admin
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      className="flex items-center gap-2 cursor-pointer text-red-500"
                      onClick={() => onRemoveMember && onRemoveMember(member.id)}
                    >
                      <UserPlus className="h-4 w-4" /> Remove from Group
                    </DropdownMenuItem>
                  </>
                )}
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default GroupMembersPanel;
