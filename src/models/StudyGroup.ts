
export interface StudyGroupMember {
  id: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'member';
  joinedAt: string;
  status?: 'online' | 'offline' | 'away' | 'busy';
  lastSeen?: string;
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
}

export interface VideoConferenceParticipant {
  userId: string;
  userName: string;
  joinedAt: string;
  leftAt?: string;
  isVideo: boolean;
  isAudio: boolean;
  isScreenSharing: boolean;
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
