
import React, { useState, useEffect, useRef } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Home, FileText, Brain, BookOpen, Settings, Sparkles, GraduationCap, Building, Book } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

const NavigationDrawer = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("main");
  const location = useLocation();
  const wrapperRef = useRef<HTMLDivElement>(null);
  
  const closeDrawer = () => setOpen(false);
  
  // Close drawer when route changes
  useEffect(() => {
    closeDrawer();
  }, [location.pathname]);
  
  // Close drawer when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  const navItems = [
    { label: "Dashboard", icon: Home, path: "/dashboard" },
    { label: "Note Taker", icon: FileText, path: "/note-taker" },
    { label: "AI Assistant", icon: Brain, path: "/assistant" },
    { label: "Resources", icon: BookOpen, path: "/resources" },
  ];
  
  const featurePages = [
    { label: "Student Features", icon: GraduationCap, path: "/student-features" },
    { label: "Educator Tools", icon: Book, path: "/educator-tools" },
    { label: "Institution Benefits", icon: Building, path: "/institution-benefits" },
  ];
  
  return (
    <div ref={wrapperRef}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Button 
          variant="outline" 
          size="icon" 
          className="fixed top-4 left-4 z-50 rounded-full h-10 w-10 shadow-md bg-background"
          onClick={() => setOpen(true)}
        >
          <Menu className="h-5 w-5" />
        </Button>
      </motion.div>
      
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left" className="p-0 flex flex-col w-[300px]">
          <SheetHeader className="p-4 text-left border-b">
            <SheetTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              Smart Study Platform
            </SheetTitle>
          </SheetHeader>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="w-full rounded-none grid grid-cols-2 bg-muted/40">
              <TabsTrigger value="main">Main Menu</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
            </TabsList>
            
            <TabsContent value="main" className="flex-1 px-2 py-4 space-y-1 data-[state=inactive]:hidden">
              <AnimatePresence>
                {navItems.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.1, duration: 0.2 }}
                  >
                    <Button
                      variant={location.pathname === item.path ? "default" : "ghost"}
                      className="w-full justify-start relative overflow-hidden group h-10"
                      onClick={closeDrawer}
                      asChild
                    >
                      <Link to={item.path}>
                        <div className="absolute inset-0 bg-primary/10 w-0 group-hover:w-full transition-all duration-300" />
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </Link>
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <Separator className="my-4" />
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: navItems.length * 0.1, duration: 0.2 }}
              >
                <Button
                  variant={location.pathname === "/" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={closeDrawer}
                  asChild
                >
                  <Link to="/">
                    <Home className="h-4 w-4 mr-3" />
                    Home
                  </Link>
                </Button>
              </motion.div>
            </TabsContent>
            
            <TabsContent value="features" className="flex-1 px-2 py-4 space-y-1 data-[state=inactive]:hidden">
              <AnimatePresence>
                {featurePages.map((item, index) => (
                  <motion.div
                    key={item.path}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.1, duration: 0.2 }}
                  >
                    <Button
                      variant={location.pathname === item.path ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={closeDrawer}
                      asChild
                    >
                      <Link to={item.path}>
                        <item.icon className="h-4 w-4 mr-3" />
                        {item.label}
                      </Link>
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              <Separator className="my-4" />
              
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: featurePages.length * 0.1, duration: 0.2 }}
              >
                <Button
                  variant={location.pathname === "/features" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={closeDrawer}
                  asChild
                >
                  <Link to="/features">
                    <Sparkles className="h-4 w-4 mr-3" />
                    All Features
                  </Link>
                </Button>
              </motion.div>
            </TabsContent>
          </Tabs>
          
          <div className="border-t p-4">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.2 }}
              className="flex items-center"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage src="/placeholder.svg" alt="User" />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium">Student User</p>
                <p className="text-xs text-muted-foreground">student@example.com</p>
              </div>
              <Button variant="ghost" size="icon" className="ml-auto">
                <Settings className="h-4 w-4" />
              </Button>
            </motion.div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default NavigationDrawer;
