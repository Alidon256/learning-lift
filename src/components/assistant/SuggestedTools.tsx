
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon, Sparkles, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

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
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4 text-primary" />
        <span>Suggested tools</span>
      </div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {tools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <ToolCard tool={tool} onSelect={onSelect} />
          </motion.div>
        ))}
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
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md border-primary/10 hover:border-primary/30 cursor-pointer group" onClick={() => onSelect(tool.prompt)}>
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
