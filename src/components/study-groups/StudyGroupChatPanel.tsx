
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { StudyGroup, StudyGroupMessage, StudyGroupAttachment } from "@/models/StudyGroup";
import { 
  Send, 
  Paperclip, 
  Image as ImageIcon, 
  File, 
  Link, 
  Smile, 
  MoreVertical,
  Edit,
  Trash2,
  Download
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { studyGroupService } from "@/services/StudyGroupService";
import { toast } from "@/components/ui/use-toast";
import { format, formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface StudyGroupChatPanelProps {
  group: StudyGroup;
  onMessageSent: (updatedGroup: StudyGroup) => void;
}

const EMOJIS = ["👍", "❤️", "😊", "🎉", "👏", "🙌", "🤔", "👨‍🎓", "👩‍🎓", "📚", "✏️", "🧠"];

const StudyGroupChatPanel = ({ group, onMessageSent }: StudyGroupChatPanelProps) => {
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [attachments, setAttachments] = useState<StudyGroupAttachment[]>([]);
  const [replyingTo, setReplyingTo] = useState<StudyGroupMessage | null>(null);
  const [editingMessage, setEditingMessage] = useState<StudyGroupMessage | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!editingMessage) {
      scrollToBottom();
    }
  }, [group.messages, editingMessage]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async () => {
    if (editingMessage) {
      handleUpdateMessage();
      return;
    }
    
    if (!messageInput.trim() && attachments.length === 0) return;
    
    setIsSending(true);
    try {
      // In a real app, you would handle attachments upload here
      
      const updatedGroup = await studyGroupService.addMessage(group.id, messageInput);
      onMessageSent(updatedGroup);
      setMessageInput("");
      setAttachments([]);
      setReplyingTo(null);
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

  const handleUpdateMessage = async () => {
    if (!editingMessage) return;
    
    setIsSending(true);
    try {
      // In a real app, you would implement the update functionality in your service
      toast({
        title: "Feature Coming Soon",
        description: "Message editing will be available in the next update",
      });
      setEditingMessage(null);
      setMessageInput("");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update message",
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
    
    if (e.key === "Escape" && editingMessage) {
      setEditingMessage(null);
      setMessageInput("");
    }
  };

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    // In a real app, you would handle file uploads to your storage service
    // This is a mock implementation
    const newAttachments: StudyGroupAttachment[] = Array.from(files).map(file => ({
      id: `attachment-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      type: file.type.startsWith('image/') ? 'image' : 'document',
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
    }));
    
    setAttachments([...attachments, ...newAttachments]);
    
    // Reset the input to allow selecting the same file again
    e.target.value = '';
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments(attachments.filter(att => att.id !== id));
  };

  const handleAddEmoji = (emoji: string) => {
    setMessageInput(prev => prev + emoji);
  };

  const handleReplyToMessage = (message: StudyGroupMessage) => {
    setReplyingTo(message);
    setEditingMessage(null);
  };

  const handleEditMessage = (message: StudyGroupMessage) => {
    setEditingMessage(message);
    setMessageInput(message.content);
    setReplyingTo(null);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const isCurrentUser = (userId: string) => userId === "current-user";

  return (
    <div className="flex flex-col h-full border rounded-lg overflow-hidden">
      <div className="p-3 border-b bg-muted/30">
        <h3 className="font-medium">Group Chat</h3>
        <p className="text-xs text-muted-foreground">
          {group.members.length} members • {group.messages.length} messages
        </p>
      </div>
      
      <ScrollArea className="flex-grow p-4">
        {group.messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
            No messages yet. Start the conversation!
          </div>
        ) : (
          <div className="space-y-4">
            {group.messages.map((message) => (
              <MessageBubble 
                key={message.id} 
                message={message} 
                onReply={() => handleReplyToMessage(message)}
                onEdit={() => handleEditMessage(message)}
                isEditing={editingMessage?.id === message.id}
              />
            ))}
            <div ref={chatEndRef} />
          </div>
        )}
      </ScrollArea>
      
      <div className="border-t">
        {/* Reply indicator */}
        {replyingTo && (
          <div className="px-3 py-2 bg-muted/30 border-b flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-muted-foreground mb-1">
                Replying to <span className="font-medium">{replyingTo.userName}</span>
              </p>
              <p className="text-sm truncate">{replyingTo.content}</p>
            </div>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-6 w-6" 
              onClick={handleCancelReply}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
        
        {/* Attachments preview */}
        {attachments.length > 0 && (
          <div className="px-3 py-2 flex gap-2 overflow-x-auto border-b">
            {attachments.map(attachment => (
              <div 
                key={attachment.id}
                className="relative group bg-muted rounded-md p-2 min-w-[100px]"
              >
                {attachment.type === 'image' ? (
                  <div className="h-12 w-12 mx-auto mb-1">
                    <img 
                      src={attachment.url} 
                      alt={attachment.name} 
                      className="h-full w-full object-cover rounded-md"
                    />
                  </div>
                ) : (
                  <div className="h-12 w-12 mx-auto mb-1 bg-primary/10 rounded-md flex items-center justify-center">
                    <File className="h-6 w-6 text-primary" />
                  </div>
                )}
                <p className="text-xs truncate max-w-[100px] text-center">
                  {attachment.name}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 absolute -top-1 -right-1 bg-background border rounded-full opacity-0 group-hover:opacity-100"
                  onClick={() => handleRemoveAttachment(attachment.id)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        )}
        
        {/* Input area */}
        <div className="p-3">
          <div className="flex items-end gap-2">
            <div className="flex-1">
              <Textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={editingMessage 
                  ? "Edit your message..." 
                  : "Type your message..."}
                className="min-h-[60px] resize-none"
                disabled={isSending}
              />
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center gap-1">
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                  />
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8" 
                          onClick={handleFileButtonClick}
                          disabled={isSending}
                        >
                          <Paperclip className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">Attach File</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ImageIcon className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Image</DialogTitle>
                        <DialogDescription>
                          Upload an image to share with the group
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="border-2 border-dashed rounded-lg p-6 text-center">
                          <ImageIcon className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                          <p className="text-sm text-muted-foreground mb-2">
                            Drag and drop an image here or click to browse
                          </p>
                          <Button size="sm">Choose Image</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Link className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Add Link</DialogTitle>
                        <DialogDescription>
                          Share a link with the group
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <label htmlFor="link-url" className="text-sm font-medium">
                            URL
                          </label>
                          <input
                            id="link-url"
                            type="url"
                            placeholder="https://example.com"
                            className="w-full p-2 rounded-md border"
                          />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="link-title" className="text-sm font-medium">
                            Title (Optional)
                          </label>
                          <input
                            id="link-title"
                            type="text"
                            placeholder="Link title"
                            className="w-full p-2 rounded-md border"
                          />
                        </div>
                        <Button className="w-full">Add Link</Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                  
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Smile className="h-4 w-4" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-2" align="start">
                      <div className="flex flex-wrap gap-2 max-w-[200px]">
                        {EMOJIS.map(emoji => (
                          <button
                            key={emoji}
                            className="text-lg hover:bg-muted p-1 rounded-md transition-colors"
                            onClick={() => handleAddEmoji(emoji)}
                          >
                            {emoji}
                          </button>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                
                <Button 
                  className="gap-2" 
                  size="sm"
                  onClick={handleSendMessage} 
                  disabled={(!messageInput.trim() && attachments.length === 0) || isSending}
                >
                  {editingMessage ? (
                    <>
                      <Edit className="h-4 w-4" />
                      Update
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Send
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface MessageBubbleProps {
  message: StudyGroupMessage;
  onReply: () => void;
  onEdit: () => void;
  isEditing: boolean;
}

const MessageBubble = ({ message, onReply, onEdit, isEditing }: MessageBubbleProps) => {
  const isCurrentUser = message.userId === "current-user";
  
  return (
    <div className={`group flex items-start gap-2 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
      <Avatar className="h-8 w-8 mt-1">
        <AvatarImage src={message.userAvatar} />
        <AvatarFallback>
          {message.userName.substring(0, 2).toUpperCase()}
        </AvatarFallback>
      </Avatar>
      
      <div className="max-w-[80%]">
        <div className={`flex items-center gap-2 mb-1 ${isCurrentUser ? "flex-row-reverse" : ""}`}>
          <span className="text-xs font-medium">{message.userName}</span>
          <span className="text-xs text-muted-foreground">
            {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
          </span>
          {message.isEdited && (
            <span className="text-xs text-muted-foreground">(edited)</span>
          )}
          
          <div className={`opacity-0 group-hover:opacity-100 transition-opacity ${isCurrentUser ? "mr-auto" : "ml-auto"}`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <MoreVertical className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={isCurrentUser ? "end" : "start"}>
                <DropdownMenuItem onClick={onReply}>Reply</DropdownMenuItem>
                {isCurrentUser && (
                  <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigator.clipboard.writeText(message.content)}>
                  Copy Text
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        
        <div className={`
          p-3 rounded-lg
          ${isEditing ? "border-2 border-primary" : ""}
          ${isCurrentUser
            ? "bg-primary text-primary-foreground rounded-tr-none"
            : "bg-muted rounded-tl-none"
          }
        `}>
          <p className="text-sm whitespace-pre-wrap">{message.content}</p>
          
          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-2 space-y-2">
              {message.attachments.map((attachment) => (
                <div 
                  key={attachment.id}
                  className={`rounded-md overflow-hidden border ${isCurrentUser ? "border-primary-foreground/20" : "border-muted-foreground/20"}`}
                >
                  {attachment.type === 'image' ? (
                    <div className="relative">
                      <img 
                        src={attachment.url} 
                        alt={attachment.name} 
                        className="max-h-40 object-contain rounded-md"
                      />
                      <div className="absolute inset-0 bg-black opacity-0 hover:opacity-10 transition-opacity" />
                    </div>
                  ) : (
                    <div className="flex items-center p-2 gap-2">
                      <div className={`h-10 w-10 rounded-md flex items-center justify-center ${isCurrentUser ? "bg-primary-foreground/20" : "bg-background"}`}>
                        <File className="h-5 w-5" />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-xs font-medium truncate">{attachment.name}</p>
                        {attachment.size && (
                          <p className="text-xs text-muted-foreground">
                            {Math.round(attachment.size / 1024)} KB
                          </p>
                        )}
                      </div>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                            >
                              <Download className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Download</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {message.reactions.map((reaction) => (
                <button
                  key={reaction.emoji}
                  className={`
                    text-xs px-1.5 py-0.5 rounded-full flex items-center gap-1
                    ${isCurrentUser ? "bg-primary-foreground/20 hover:bg-primary-foreground/30" : "bg-background hover:bg-muted-foreground/10"}
                  `}
                >
                  <span>{reaction.emoji}</span>
                  <span>{reaction.count}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyGroupChatPanel;
