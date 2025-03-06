
import { FC, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LucideIcon } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export interface SuggestedTool {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  prompt: string;
  isPopular?: boolean;
  category: string;
}

interface SuggestedToolsProps {
  tools: SuggestedTool[];
  onSelect: (prompt: string) => void;
}

export const SuggestedTools: FC<SuggestedToolsProps> = ({ tools, onSelect }) => {
  const [category, setCategory] = useState<string>("all");
  
  const categories = ["all", ...Array.from(new Set(tools.map(tool => tool.category)))];
  
  const filteredTools = category === "all" 
    ? tools 
    : tools.filter(tool => tool.category === category);

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Quick tools & templates</h3>
        <Tabs defaultValue="all" value={category} onValueChange={setCategory} className="h-8">
          <TabsList className="h-8">
            {categories.map(cat => (
              <TabsTrigger 
                key={cat} 
                value={cat}
                className="text-xs h-8 px-2 capitalize"
              >
                {cat}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>
      
      <ScrollArea className="h-auto max-h-[280px]">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filteredTools.map((tool) => (
            <motion.div
              key={tool.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className="cursor-pointer hover:bg-muted/40 transition-colors overflow-hidden"
                onClick={() => onSelect(tool.prompt)}
              >
                <CardContent className="p-3 flex items-start gap-3">
                  <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <tool.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1 flex-wrap">
                      <h4 className="font-medium text-sm truncate">{tool.name}</h4>
                      {tool.isPopular && (
                        <Badge variant="outline" className="h-5 text-[10px] bg-green-500/10 text-green-500 border-green-200">
                          Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">{tool.description}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
