
export interface StudyGroupMember {
  id: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'member';
  joinedAt: string;
}

export interface StudyGroupMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: string;
}

export interface StudyGroupSession {
  id: string;
  title: string;
  date: string;
  duration: number; // in minutes
  topic: string;
  isCompleted: boolean;
}

export interface StudyGroupResource {
  id: string;
  title: string;
  type: 'link' | 'file' | 'note';
  url?: string;
  addedBy: string;
  addedAt: string;
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
}
