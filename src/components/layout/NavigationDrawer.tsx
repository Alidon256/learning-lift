
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  Home, 
  Book, 
  MessageSquare, 
  BookOpen, 
  Settings, 
  Menu, 
  X,
  BookMarked,
  Layers,
  GraduationCap,
  Building,
  PanelLeft,
  HelpCircle,
  FileText,
  Users,
  BarChart,
  Award,
  Search,
  BrainCircuit,
  ActivitySquare,
  Lightbulb,
  Rocket,
  DoorOpen
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string;
  description?: string;
  badge?: string;
  isNew?: boolean;
  isUpdated?: boolean;
}

const mainNavItems: NavItem[] = [
  { name: "Home", icon: Home, path: "/", description: "Return to homepage" },
  { name: "Dashboard", icon: Layers, path: "/dashboard", description: "Your personal dashboard" },
  { 
    name: "Smart Assistant", 
    icon: BrainCircuit, 
    path: "/assistant", 
    description: "Chat with your AI assistant",
    badge: "Gemini",
    isUpdated: true
  },
  { name: "Note Taker", icon: Book, path: "/note-taker", description: "Record and transcribe lectures" },
  { 
    name: "Search", 
    icon: Search, 
    path: "/search", 
    description: "Search across all your study materials",
    isNew: true
  },
  { 
    name: "Analytics", 
    icon: ActivitySquare, 
    path: "/analytics", 
    description: "Track your study progress",
    isNew: true
  },
];

const resourcesNavItems: NavItem[] = [
  { name: "Features", icon: Rocket, path: "/features", description: "Explore all features" },
  { name: "Resources", icon: BookOpen, path: "/resources", description: "Educational resources" },
  { name: "Study Groups", icon: Users, path: "/study-groups", description: "Join study groups", isNew: true },
  { name: "Student Features", icon: GraduationCap, path: "/student-features", description: "Features for students" },
  { name: "Educator Tools", icon: Lightbulb, path: "/educator-tools", description: "Tools for educators" },
  { name: "Institution Benefits", icon: Building, path: "/institution-benefits", description: "Benefits for institutions" },
];

const helpNavItems: NavItem[] = [
  { name: "Help Center", icon: HelpCircle, path: "/help", description: "Get help and support" },
  { name: "Tutorials", icon: FileText, path: "/tutorials", description: "Learn how to use the platform" },
  { name: "Achievements", icon: Award, path: "/achievements", description: "View your learning achievements" },
];

const NavigationDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("main");
  const navigate = useNavigate();
  const location = useLocation();
  
  // Close drawer on route change
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);
  
  // Close drawer on escape key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsOpen(false);
    };
    
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);
  
  // Close drawer when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && e.target instanceof HTMLElement) {
        const drawerElement = document.getElementById("navigation-drawer");
        if (drawerElement && !drawerElement.contains(e.target) && 
           !e.target.closest('[aria-label="Open navigation"]')) {
          setIsOpen(false);
        }
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);
  
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };
  
  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <motion.div
        whileHover={{ x: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-start gap-3 px-3 py-5 relative rounded-xl",
            isActive && "bg-primary text-primary-foreground font-medium"
          )}
          onClick={() => handleNavigation(item.path)}
        >
          <item.icon className={cn("h-5 w-5", isActive && "text-primary-foreground")} />
          <span>{item.name}</span>
          
          {item.badge && (
            <Badge variant={isActive ? "outline" : "secondary"} 
              className={cn(
                "ml-auto text-[10px]",
                isActive && "bg-white/20 text-primary-foreground border-primary-foreground"
              )}
            >
              {item.badge}
            </Badge>
          )}
          
          {item.isNew && (
            <Badge className="ml-auto bg-green-500 text-white text-[10px]">
              NEW
            </Badge>
          )}
          
          {item.isUpdated && !item.isNew && (
            <Badge className="ml-auto bg-blue-500 text-white text-[10px]">
              UPDATED
            </Badge>
          )}
        </Button>
      </motion.div>
    );
  };
  
  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="ghost" 
              size="icon" 
              className="fixed top-4 left-4 z-50 h-10 w-10 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
              onClick={() => setIsOpen(true)}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="right">
            <p>Navigation Menu</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
      
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            
            <motion.aside
              id="navigation-drawer"
              className="fixed top-0 left-0 z-50 h-full w-80 bg-background border-r overflow-hidden rounded-r-xl shadow-xl"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col h-full">
                <motion.div 
                  className="flex items-center justify-between p-4 border-b"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="h-10 w-10 rounded-xl bg-primary flex items-center justify-center text-primary-foreground"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <BrainCircuit className="h-5 w-5" />
                    </motion.div>
                    <div>
                      <h2 className="text-xl font-bold">StudyMate</h2>
                      <p className="text-xs text-muted-foreground">AI-powered study assistant</p>
                    </div>
                  </div>
                  
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close navigation" className="rounded-full h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </motion.div>
                
                {/* Navigation sections */}
                <div className="flex border-b overflow-x-auto scrollbar-none">
                  {[
                    { id: "main", label: "Main" },
                    { id: "resources", label: "Resources" },
                    { id: "help", label: "Help" }
                  ].map((section) => (
                    <Button
                      key={section.id}
                      variant="ghost"
                      className={cn(
                        "flex-1 rounded-none border-b-2 border-transparent py-2 px-0",
                        activeSection === section.id && "border-primary text-primary font-medium"
                      )}
                      onClick={() => setActiveSection(section.id)}
                    >
                      {section.label}
                    </Button>
                  ))}
                </div>
                
                {/* Scrollable content */}
                <div className="flex-1 overflow-y-auto p-3">
                  <AnimatePresence mode="wait">
                    {activeSection === "main" && (
                      <motion.div
                        key="main-section"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2"
                      >
                        {mainNavItems.map((item, index) => (
                          <motion.div 
                            key={item.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <NavItemComponent item={item} />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                    
                    {activeSection === "resources" && (
                      <motion.div
                        key="resources-section"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2"
                      >
                        {resourcesNavItems.map((item, index) => (
                          <motion.div 
                            key={item.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <NavItemComponent item={item} />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                    
                    {activeSection === "help" && (
                      <motion.div
                        key="help-section"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-2"
                      >
                        {helpNavItems.map((item, index) => (
                          <motion.div 
                            key={item.name}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <NavItemComponent item={item} />
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
                
                {/* Footer */}
                <motion.div 
                  className="p-4 border-t bg-muted/30"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-2"
                        onClick={() => handleNavigation("/settings")}
                      >
                        <Settings className="h-4 w-4" />
                        Settings
                      </Button>
                    </motion.div>
                    
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="flex items-center gap-2 text-red-500 border-red-200 hover:bg-red-50 dark:hover:bg-red-950"
                      >
                        <DoorOpen className="h-4 w-4" />
                        Sign Out
                      </Button>
                    </motion.div>
                  </div>
                  
                  <Separator className="my-3" />
                  
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">© 2023 StudyMate</p>
                    <ThemeToggle />
                  </div>
                </motion.div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavigationDrawer;
