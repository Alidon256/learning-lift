
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LucideIcon, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export interface SuggestedTool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  prompt: string;
}

interface SuggestedToolsProps {
  tools: SuggestedTool[];
  onSelect: (prompt: string) => void;
}

export const SuggestedTools = ({ tools, onSelect }: SuggestedToolsProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4" />
        <span>Suggested tools</span>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {tools.map((tool, index) => (
          <motion.div
            key={tool.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.3 }}
          >
            <ToolCard tool={tool} onSelect={onSelect} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const ToolCard = ({ tool, onSelect }: { tool: SuggestedTool; onSelect: (prompt: string) => void }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 cursor-pointer group" onClick={() => onSelect(tool.prompt)}>
      <CardContent className="p-4 flex items-start gap-3">
        <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0 transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
          <tool.icon className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-medium text-sm">{tool.name}</h3>
          <p className="text-xs text-muted-foreground mt-1">{tool.description}</p>
        </div>
      </CardContent>
    </Card>
  );
};
