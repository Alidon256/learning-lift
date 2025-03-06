
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
  PanelLeft
} from "lucide-react";
import { ThemeToggle } from "@/components/ThemeToggle";

interface NavItem {
  name: string;
  icon: React.ElementType;
  path: string;
  description?: string;
}

const mainNavItems: NavItem[] = [
  { name: "Home", icon: Home, path: "/", description: "Return to homepage" },
  { name: "Dashboard", icon: Layers, path: "/dashboard", description: "Your personal dashboard" },
  { name: "Assistant", icon: MessageSquare, path: "/assistant", description: "Chat with your AI assistant" },
  { name: "Note Taker", icon: Book, path: "/note-taker", description: "Record and transcribe lectures" },
];

const resourcesNavItems: NavItem[] = [
  { name: "Features", icon: BookMarked, path: "/features", description: "Explore all features" },
  { name: "Resources", icon: BookOpen, path: "/resources", description: "Educational resources" },
  { name: "Student Features", icon: GraduationCap, path: "/student-features", description: "Features for students" },
  { name: "Educator Tools", icon: CalendarDays, path: "/educator-tools", description: "Tools for educators" },
  { name: "Institution Benefits", icon: Building, path: "/institution-benefits", description: "Benefits for institutions" },
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
  
  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };
  
  const NavItemComponent = ({ item }: { item: NavItem }) => {
    const isActive = location.pathname === item.path;
    
    return (
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start gap-3 px-3 py-6",
          isActive && "bg-primary/10 text-primary font-medium"
        )}
        onClick={() => handleNavigation(item.path)}
      >
        <item.icon className={cn("h-5 w-5", isActive && "text-primary")} />
        <span>{item.name}</span>
      </Button>
    );
  };
  
  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="fixed top-4 left-4 z-50"
        onClick={() => setIsOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="h-5 w-5" />
      </Button>
      
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
              className="fixed top-0 left-0 z-50 h-full w-80 bg-background border-r overflow-y-auto neo-morphism"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex flex-col h-full p-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <PanelLeft className="h-5 w-5" />
                    </div>
                    <h2 className="text-xl font-bold">StudyMate</h2>
                  </div>
                  
                  <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)} aria-label="Close navigation">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
                
                <nav className="space-y-6 flex-1">
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 px-3">Main</h3>
                    <div className="space-y-1">
                      {mainNavItems.map((item) => (
                        <NavItemComponent key={item.name} item={item} />
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-muted-foreground mb-3 px-3">Resources</h3>
                    <div className="space-y-1">
                      {resourcesNavItems.map((item) => (
                        <NavItemComponent key={item.name} item={item} />
                      ))}
                    </div>
                  </div>
                </nav>
                
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <Button 
                      variant="outline" 
                      size="sm"
                      className="flex items-center gap-2"
                      onClick={() => handleNavigation("/settings")}
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Button>
                    
                    <ThemeToggle />
                  </div>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavigationDrawer;
