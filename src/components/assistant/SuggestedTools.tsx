
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon, Sparkles, ChevronRight, Filter, X } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export interface SuggestedTool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  prompt: string;
  isPopular?: boolean;
  category?: string;
}

interface SuggestedToolsProps {
  tools: SuggestedTool[];
  onSelect: (prompt: string) => void;
}

export const SuggestedTools = ({ tools, onSelect }: SuggestedToolsProps) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  
  // Get unique categories
  const categories = Array.from(new Set(tools.map(tool => tool.category).filter(Boolean)));
  
  // Filter tools by category
  const filteredTools = selectedCategory 
    ? tools.filter(tool => tool.category === selectedCategory)
    : tools;
    
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };
  
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Sparkles className="h-4 w-4 text-primary" />
          <span>Suggested tools</span>
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          className="text-xs flex items-center gap-1.5"
          onClick={() => setIsFilterExpanded(!isFilterExpanded)}
        >
          <Filter className="h-3 w-3" />
          {isFilterExpanded ? "Hide filters" : "Filter tools"}
        </Button>
      </div>
      
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ 
          height: isFilterExpanded ? "auto" : 0,
          opacity: isFilterExpanded ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
        className="overflow-hidden"
      >
        <div className="py-2 flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === null ? "default" : "outline"}
            className={cn(
              "cursor-pointer transition-all hover:scale-105",
              selectedCategory === null ? "bg-primary" : "hover:bg-primary/10"
            )}
            onClick={() => setSelectedCategory(null)}
          >
            All tools
          </Badge>
          
          {categories.map(category => (
            <Badge
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              className={cn(
                "cursor-pointer transition-all hover:scale-105",
                selectedCategory === category ? "bg-primary" : "hover:bg-primary/10"
              )}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
              {selectedCategory === category && (
                <X className="ml-1 h-3 w-3 cursor-pointer" onClick={(e) => {
                  e.stopPropagation();
                  setSelectedCategory(null);
                }} />
              )}
            </Badge>
          ))}
        </div>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
        variants={container}
        initial="hidden"
        animate="show"
        key={selectedCategory || "all"} // Re-render animation when category changes
      >
        {filteredTools.map((tool) => (
          <motion.div
            key={tool.id}
            variants={item}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <ToolCard tool={tool} onSelect={onSelect} />
          </motion.div>
        ))}
        
        {filteredTools.length === 0 && (
          <motion.div 
            className="col-span-2 text-center py-10 text-muted-foreground text-sm"
            variants={item}
          >
            No tools found in this category
          </motion.div>
        )}
      </motion.div>
      
      <motion.div 
        className="mt-4 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.3 }}
      >
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-muted-foreground hover:text-primary"
          onClick={() => onSelect("What can you help me with?")}
        >
          See all capabilities
          <ChevronRight className="h-3 w-3 ml-1" />
        </Button>
      </motion.div>
    </div>
  );
};

const ToolCard = ({ tool, onSelect }: { tool: SuggestedTool; onSelect: (prompt: string) => void }) => {
  return (
    <Card 
      className="overflow-hidden transition-all duration-300 hover:shadow-md border-primary/10 hover:border-primary/30 cursor-pointer group" 
      onClick={() => onSelect(tool.prompt)}
    >
      <CardContent className="p-4 flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <tool.icon className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium text-sm">{tool.name}</h3>
            {tool.isPopular && (
              <Badge variant="secondary" className="text-[9px] py-0 h-4 px-1.5">Popular</Badge>
            )}
            {tool.category && (
              <Badge variant="outline" className="text-[9px] py-0 h-4 px-1.5 ml-auto">{tool.category}</Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};
