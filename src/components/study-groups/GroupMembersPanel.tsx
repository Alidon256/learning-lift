
import { StudyGroupMember } from "@/models/StudyGroup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format, formatDistanceToNow } from "date-fns";
import { Clock, MoreHorizontal, Shield, User } from "lucide-react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface GroupMembersPanelProps {
  members: StudyGroupMember[];
}

const GroupMembersPanel = ({ members }: GroupMembersPanelProps) => {
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
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">Group Members ({members.length})</CardTitle>
          <Badge variant="outline" className="bg-green-500/10 text-green-500">
            {onlineCount} Online
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[420px] pr-4">
          <div className="space-y-3">
            {sortedMembers.map(member => (
              <MemberItem key={member.id} member={member} />
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};

interface MemberItemProps {
  member: StudyGroupMember;
}

const MemberItem = ({ member }: MemberItemProps) => {
  const statusColors = {
    online: "bg-green-500",
    busy: "bg-red-500",
    away: "bg-amber-500",
    offline: "bg-gray-400"
  };
  
  const statusColor = member.status ? statusColors[member.status] : statusColors.offline;
  
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
            title={member.status ? member.status.charAt(0).toUpperCase() + member.status.slice(1) : "Offline"}
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
                <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                  Message
                </DropdownMenuItem>
                {member.status === "online" && (
                  <DropdownMenuItem className="flex items-center gap-2 cursor-pointer">
                    Invite to Video Call
                  </DropdownMenuItem>
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
