
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { StudyGroup } from "@/models/StudyGroup";
import { studyGroupService } from "@/services/StudyGroupService";
import NavigationDrawer from "@/components/layout/NavigationDrawer";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { Loader2, GraduationCap, Users, Search, BookOpen, UsersRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import StudyGroupCard from "@/components/study-groups/StudyGroupCard";
import CreateStudyGroupDialog from "@/components/study-groups/CreateStudyGroupDialog";

const StudyGroups = () => {
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [filteredGroups, setFilteredGroups] = useState<StudyGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudyGroups();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const filtered = studyGroups.filter(group => 
        group.name.toLowerCase().includes(query) || 
        group.description.toLowerCase().includes(query) || 
        group.subject.toLowerCase().includes(query)
      );
      setFilteredGroups(filtered);
    } else {
      setFilteredGroups(studyGroups);
    }
  }, [searchQuery, studyGroups]);

  const fetchStudyGroups = async () => {
    setIsLoading(true);
    try {
      const groups = await studyGroupService.getStudyGroups();
      setStudyGroups(groups);
      setFilteredGroups(groups);
    } catch (error) {
      console.error("Error fetching study groups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCreateGroup = () => {
    fetchStudyGroups();
  };

  return (
    <>
      <NavigationDrawer />
      
      <motion.div 
        className="container max-w-6xl py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <motion.div 
              className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary"
              whileHover={{ scale: 1.05, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
            >
              <UsersRound className="h-6 w-6" />
            </motion.div>
            <div>
              <h1 className="text-2xl font-bold">Study Groups</h1>
              <p className="text-sm text-muted-foreground">Join or create groups to study together with peers</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <CreateStudyGroupDialog onGroupCreated={handleCreateGroup} />
            <ThemeToggle />
          </div>
        </div>

        <div className="bg-muted/30 p-4 rounded-lg mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, subject, or description..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-9"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="h-60 flex flex-col items-center justify-center">
            <Loader2 className="h-8 w-8 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground">Loading study groups...</p>
          </div>
        ) : (
          <>
            {filteredGroups.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGroups.map(group => (
                  <StudyGroupCard key={group.id} group={group} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 space-y-4">
                <GraduationCap className="h-12 w-12 text-muted-foreground mx-auto" />
                {searchQuery ? (
                  <>
                    <h3 className="text-lg font-medium">No matching study groups found</h3>
                    <p className="text-muted-foreground">Try a different search term or create a new group</p>
                  </>
                ) : (
                  <>
                    <h3 className="text-lg font-medium">No study groups yet</h3>
                    <p className="text-muted-foreground">Create your first study group to get started</p>
                    <Button 
                      onClick={() => document.querySelector<HTMLButtonElement>('[aria-label="Create Study Group"]')?.click()}
                      className="mt-2"
                    >
                      Create a Study Group
                    </Button>
                  </>
                )}
              </div>
            )}
          </>
        )}

        <Separator className="my-10" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-muted/30 p-6 rounded-lg flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Users className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Collaborative Learning</h3>
              <p className="text-sm text-muted-foreground">
                Study groups allow you to learn with peers, share knowledge, and maintain motivation through accountability.
              </p>
            </div>
          </div>
          
          <div className="bg-muted/30 p-6 rounded-lg flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <GraduationCap className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Improve Retention</h3>
              <p className="text-sm text-muted-foreground">
                Teaching concepts to others reinforces your own understanding and helps identify knowledge gaps.
              </p>
            </div>
          </div>
          
          <div className="bg-muted/30 p-6 rounded-lg flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h3 className="font-medium mb-1">Diverse Perspectives</h3>
              <p className="text-sm text-muted-foreground">
                Gain insights from different viewpoints and approaches to solving problems and understanding material.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default StudyGroups;
