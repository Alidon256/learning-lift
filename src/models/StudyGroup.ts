export interface StudyGroupMember {
  id: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'member';
  joinedAt: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: string;
  isTyping?: boolean;
}

export interface StudyGroupMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
  attachments?: StudyGroupAttachment[];
  reactions?: StudyGroupReaction[];
  isEdited?: boolean;
  replyTo?: {
    messageId: string;
    content: string;
    userName: string;
  };
  readBy?: string[]; // list of user IDs who have read the message
}

export interface StudyGroupAttachment {
  id: string;
  type: 'image' | 'document' | 'audio' | 'link';
  url: string;
  name: string;
  size?: number;
  thumbnailUrl?: string;
}

export interface StudyGroupReaction {
  emoji: string;
  count: number;
  users: string[]; // user IDs
}

export interface StudyGroupSession {
  id: string;
  title: string;
  date: string;
  duration: number; // in minutes
  topic: string;
  isCompleted: boolean;
  videoConferenceUrl?: string;
  host?: string; // user ID of the host
  attendees?: string[]; // user IDs of attendees
  notes?: string;
  chatHistory?: StudyGroupMessage[];
  duration?: number; // in minutes
  quality?: 'SD' | 'HD' | 'Full HD';
  recordingUrl?: string;
}

export interface StudyGroupResource {
  id: string;
  title: string;
  type: 'link' | 'file' | 'note';
  url?: string;
  addedBy: string;
  addedAt: string;
  description?: string;
  tags?: string[];
  likes?: number;
}

export interface VideoConferenceSession {
  id: string;
  hostId: string;
  title: string;
  started: string;
  status: 'scheduled' | 'active' | 'ended';
  participants: VideoConferenceParticipant[];
  roomId: string;
  password?: string;
  settings: {
    allowChat: boolean;
    allowScreenShare: boolean;
    muteOnEntry: boolean;
    waitingRoom: boolean;
    recordSession: boolean;
  };
  chatHistory?: StudyGroupMessage[];
  duration?: number; // in minutes
  quality?: 'SD' | 'HD' | 'Full HD';
  recordingUrl?: string;
}

export interface VideoConferenceParticipant {
  userId: string;
  userName: string;
  joinedAt: string;
  leftAt?: string;
  isVideo: boolean;
  isAudio: boolean;
  isScreenSharing: boolean;
  networkQuality?: 'excellent' | 'good' | 'fair' | 'poor';
  raisedHand?: boolean;
  pinnedBy?: string[]; // list of user IDs who have pinned this participant
}

export interface StudyGroup {
  id: string;
  name: string;
  description: string;
  subject: string;
  createdAt: string;
  members: StudyGroupMember[];
  messages: StudyGroupMessage[];
  sessions: StudyGroupSession[];
  resources: StudyGroupResource[];
  isPublic: boolean;
  coverImage?: string;
  activeConference?: VideoConferenceSession;
}

export interface StudyGroupAnalytics {
  totalSessions: number;
  totalHoursStudied: number;
  activeMembers: number;
  resourcesShared: number;
  participation: {
    userId: string;
    userName: string;
    sessionsAttended: number;
    messagesCount: number;
    resourcesShared: number;
  }[];
}

export interface StudyGroupTag {
  id: string;
  name: string;
  color: string;
}

export interface StudyGroupPoll {
  id: string;
  createdBy: string;
  question: string;
  options: {
    id: string;
    text: string;
    votes: string[]; // user IDs
  }[];
  createdAt: string;
  expiresAt?: string;
  isActive: boolean;
}

export interface StudyGroupQuiz {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  questions: {
    id: string;
    question: string;
    options: string[];
    correctOption: number;
    explanation?: string;
  }[];
  attempts: {
    userId: string;
    userName: string;
    score: number;
    completedAt: string;
  }[];
}

export interface StudyGroupEvent {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location?: string;
  isVirtual: boolean;
  meetingLink?: string;
  createdBy: string;
  attendees: {
    userId: string;
    status: 'going' | 'maybe' | 'not-going';
  }[];
}

export interface StudyGroupFlashcardDeck {
  id: string;
  title: string;
  description: string;
  createdBy: string;
  createdAt: string;
  tags: string[];
  cards: {
    id: string;
    front: string;
    back: string;
  }[];
}

export interface StudyGroupGoal {
  id: string;
  title: string;
  description: string;
  dueDate?: string;
  status: 'not-started' | 'in-progress' | 'completed';
  assignedTo: string[];
  createdBy: string;
  createdAt: string;
}

export interface StudyGroupDirectMessage {
  id: string;
  senderId: string;
  recipientId: string;
  content: string;
  timestamp: string;
  isRead: boolean;
  attachments?: StudyGroupAttachment[];
}

export interface BreakoutRoom {
  id: string;
  name: string;
  participants: string[]; // user IDs
  createdAt: string;
  duration?: number; // in minutes
  topic?: string;
}

export interface PresentationSlide {
  id: string;
  imageUrl: string;
  notes?: string;
  order: number;
}

export interface SharedPresentation {
  id: string;
  title: string;
  createdBy: string;
  createdAt: string;
  currentSlide: number;
  slides: PresentationSlide[];
}

export interface WhiteboardItem {
  id: string;
  type: 'text' | 'drawing' | 'shape' | 'image';
  content: any; // specific to the type
  position: { x: number; y: number };
  size?: { width: number; height: number };
  createdBy: string;
  createdAt: string;
}

export interface SharedWhiteboard {
  id: string;
  title: string;
  createdBy: string;
  createdAt: string;
  items: WhiteboardItem[];
}
