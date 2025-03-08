
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StudyGroup, StudyGroupMessage } from "@/models/StudyGroup";
import { Send, User, Bot } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { studyGroupService } from "@/services/StudyGroupService";
import { toast } from "@/components/ui/use-toast";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";

interface StudyGroupChatPanelProps {
  group: StudyGroup;
  onMessageSent: (updatedGroup: StudyGroup) => void;
}

const StudyGroupChatPanel = ({ group, onMessageSent }: StudyGroupChatPanelProps) => {
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [group.messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim()) return;
    
    setIsSending(true);
    try {
      const updatedGroup = await studyGroupService.addMessage(group.id, messageInput);
      onMessageSent(updatedGroup);
      setMessageInput("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden">
      <div className="p-3 border-b bg-muted/30">
        <h3 className="font-medium">Group Chat</h3>
      </div>
      
      <ScrollArea className="flex-grow p-4">
        {group.messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-4">
            {group.messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            <div ref={chatEndRef} />
          </div>
        )}
      </ScrollArea>
      
      <div className="p-3 border-t">
        <div className="flex items-end gap-2">
          <Textarea
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type your message..."
            className="min-h-[60px] resize-none"
            disabled={isSending}
          />
          <Button 
            size="icon" 
            onClick={handleSendMessage} 
            disabled={!messageInput.trim() || isSending}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

interface MessageBubbleProps {
  message: StudyGroupMessage;
}

const MessageBubble = ({ message }: MessageBubbleProps) => {
  const isCurrentUser = message.userId === "current-user";
  
  return (
    <div className={`flex items-start gap-2 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
      <Avatar className="h-8 w-8">
        <AvatarImage src={message.userAvatar} />
        <AvatarFallback>
          {message.userName.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className={`max-w-[80%] ${isCurrentUser ? "bg-primary text-primary-foreground" : "bg-muted"} p-3 rounded-lg`}>
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs font-medium">{message.userName}</span>
          <span className="text-xs opacity-70">
            {format(new Date(message.timestamp), "h:mm a")}
          </span>
        </div>
        <p className="text-sm whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
};

export default StudyGroupChatPanel;
