
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
  LineChart, 
  CalendarDays, 
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
  Search
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";
import { 
  Tooltip, 
  TooltipContent, 
  TooltipProvider, 
  TooltipTrigger 
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string;
  description?: string;
  badge?: string;
  isNew?: boolean;
}

const mainNavItems: NavItem[] = [
  { name: "Home", icon: Home, path: "/", description: "Return to homepage" },
  { name: "Dashboard", icon: Layers, path: "/dashboard", description: "Your personal dashboard" },
  { 
    name: "Assistant", 
    icon: MessageSquare, 
    path: "/assistant", 
    description: "Chat with your AI assistant",
    badge: "AI"
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
    icon: BarChart, 
    path: "/analytics", 
    description: "Track your study progress",
    isNew: true
  },
];

const resourcesNavItems: NavItem[] = [
  { name: "Features", icon: BookMarked, path: "/features", description: "Explore all features" },
  { name: "Resources", icon: BookOpen, path: "/resources", description: "Educational resources" },
  { name: "Study Groups", icon: Users, path: "/study-groups", description: "Join study groups", isNew: true },
  { name: "Student Features", icon: GraduationCap, path: "/student-features", description: "Features for students" },
  { name: "Educator Tools", icon: CalendarDays, path: "/educator-tools", description: "Tools for educators" },
  { name: "Institution Benefits", icon: Building, path: "/institution-benefits", description: "Benefits for institutions" },
];

const helpNavItems: NavItem[] = [
  { name: "Help Center", icon: HelpCircle, path: "/help", description: "Get help and support" },
  { name: "Tutorials", icon: FileText, path: "/tutorials", description: "Learn how to use the platform" },
  { name: "Achievements", icon: Award, path: "/achievements", description: "View your learning achievements" },
];

const NavigationDrawer = () => {
  const [isOpen, setIsOpen] = useState(false);
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
            "w-full justify-start gap-3 px-3 py-6 relative",
            isActive && "bg-primary/10 text-primary font-medium"
          )}
          onClick={() => handleNavigation(item.path)}
        >
          <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
          <span>{item.name}</span>
          
          {item.badge && (
            <Badge variant="outline" className="ml-auto bg-primary/10 text-primary text-[10px]">
              {item.badge}
            </Badge>
          )}
          
          {item.isNew && (
            <Badge className="ml-auto bg-green-500 text-white text-[10px]">
              NEW
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
              className="fixed top-4 left-4 z-50 h-9 w-9 rounded-full bg-background/80 backdrop-blur-sm shadow-md"
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
              className="fixed top-0 left-0 z-50 h-full w-80 bg-background border-r overflow-y-auto neo-morphism"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col h-full p-4">
                <motion.div 
                  className="flex items-center justify-between mb-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center gap-3">
                    <motion.div 
                      className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center text-primary"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <PanelLeft className="h-5 w-5" />
                    </motion.div>
                    <h2 className="text-xl font-bold">StudyMate</h2>
                    <Badge variant="outline" className="ml-2 px-1.5 py-0 text-xs">v2.0</Badge>
                  </div>
                  
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close navigation" className="rounded-full h-8 w-8">
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </motion.div>
                
                <nav className="space-y-6 flex-1 overflow-y-auto">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 px-3 flex items-center">
                      <span>Main</span>
                      <div className="h-px flex-grow bg-border/60 ml-3"></div>
                    </h3>
                    <div className="space-y-1">
                      {mainNavItems.map((item, index) => (
                        <motion.div 
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 + index * 0.05 }}
                        >
                          <NavItemComponent item={item} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 px-3 flex items-center">
                      <span>Resources</span>
                      <div className="h-px flex-grow bg-border/60 ml-3"></div>
                    </h3>
                    <div className="space-y-1">
                      {resourcesNavItems.map((item, index) => (
                        <motion.div 
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 + index * 0.05 }}
                        >
                          <NavItemComponent item={item} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 px-3 flex items-center">
                      <span>Help</span>
                      <div className="h-px flex-grow bg-border/60 ml-3"></div>
                    </h3>
                    <div className="space-y-1">
                      {helpNavItems.map((item, index) => (
                        <motion.div 
                          key={item.name}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + index * 0.05 }}
                        >
                          <NavItemComponent item={item} />
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                </nav>
                
                <motion.div 
                  className="border-t pt-4 mt-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-center justify-between">
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
                    
                    <motion.div whileHover={{ rotate: 15 }}>
                      <ThemeToggle />
                    </motion.div>
                  </div>
                  <div className="mt-4 text-xs text-center text-muted-foreground">
                    <p>© 2023 StudyMate. All rights reserved.</p>
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
