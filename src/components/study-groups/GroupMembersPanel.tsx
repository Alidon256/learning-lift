
import { StudyGroupMember } from "@/models/StudyGroup";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface GroupMembersPanelProps {
  members: StudyGroupMember[];
}

const GroupMembersPanel = ({ members }: GroupMembersPanelProps) => {
  // Sort members by role (admin first) and then by join date
  const sortedMembers = [...members].sort((a, b) => {
    if (a.role === "admin" && b.role !== "admin") return -1;
    if (a.role !== "admin" && b.role === "admin") return 1;
    return new Date(a.joinedAt).getTime() - new Date(b.joinedAt).getTime();
  });
  
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Group Members ({members.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedMembers.map(member => (
            <div key={member.id} className="flex items-center justify-between py-1">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={member.avatar} />
                  <AvatarFallback>{member.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <span className="font-medium text-sm">{member.name}</span>
                    {member.role === "admin" && (
                      <Badge variant="outline" className="ml-2 text-xs h-5">Admin</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Joined {format(new Date(member.joinedAt), "MMM d, yyyy")}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupMembersPanel;
