
import { StudyGroup, StudyGroupMember, StudyGroupMessage, StudyGroupResource, StudyGroupSession } from "@/models/StudyGroup";
import { v4 as uuidv4 } from "uuid";

// Mock data for study groups
const MOCK_STUDY_GROUPS: StudyGroup[] = [
  {
    id: "sg-1",
    name: "Advanced Calculus Group",
    description: "A study group focused on advanced calculus topics including multivariable calculus and differential equations.",
    subject: "Mathematics",
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
    members: [
      {
        id: "u1",
        name: "Alex Johnson",
        avatar: "https://i.pravatar.cc/150?u=a1",
        role: "admin",
        joinedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "u2",
        name: "Jamie Smith",
        avatar: "https://i.pravatar.cc/150?u=a2",
        role: "member",
        joinedAt: new Date(Date.now() - 28 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "u3",
        name: "Taylor Brown",
        avatar: "https://i.pravatar.cc/150?u=a3",
        role: "member",
        joinedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    messages: [
      {
        id: "m1",
        userId: "u1",
        userName: "Alex Johnson",
        userAvatar: "https://i.pravatar.cc/150?u=a1",
        content: "Hi everyone! Welcome to our calculus study group. Let's start by introducing ourselves and sharing what topics we're most interested in.",
        timestamp: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "m2",
        userId: "u2",
        userName: "Jamie Smith",
        userAvatar: "https://i.pravatar.cc/150?u=a2",
        content: "Hi, I'm Jamie. I'm really interested in learning more about vector calculus and applications in physics.",
        timestamp: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    sessions: [
      {
        id: "ses1",
        title: "Vector Calculus Review",
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 90,
        topic: "Review of vector calculus concepts and practice problems",
        isCompleted: false,
      },
      {
        id: "ses2",
        title: "Differential Equations Workshop",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 120,
        topic: "Solving first and second-order differential equations",
        isCompleted: false,
      },
    ],
    resources: [
      {
        id: "r1",
        title: "Vector Calculus Cheat Sheet",
        type: "file",
        url: "https://example.com/vector-calc-sheet.pdf",
        addedBy: "u1",
        addedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "r2",
        title: "MIT OpenCourseWare - Multivariable Calculus",
        type: "link",
        url: "https://ocw.mit.edu/courses/mathematics/18-02-multivariable-calculus-fall-2007/",
        addedBy: "u2",
        addedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    isPublic: true,
    coverImage: "https://images.unsplash.com/photo-1518133910546-b6c2fb7d79e3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: "sg-2",
    name: "Organic Chemistry Study Circle",
    description: "A group dedicated to mastering organic chemistry concepts, mechanisms, and problem-solving techniques.",
    subject: "Chemistry",
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
    members: [
      {
        id: "u4",
        name: "Jordan Lee",
        avatar: "https://i.pravatar.cc/150?u=a4",
        role: "admin",
        joinedAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "u5",
        name: "Casey Wilson",
        avatar: "https://i.pravatar.cc/150?u=a5",
        role: "member",
        joinedAt: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    messages: [
      {
        id: "m3",
        userId: "u4",
        userName: "Jordan Lee",
        userAvatar: "https://i.pravatar.cc/150?u=a4",
        content: "Hello chemistry enthusiasts! I've created this group to help us prepare for the upcoming organic chem exams.",
        timestamp: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    sessions: [
      {
        id: "ses3",
        title: "Reaction Mechanisms Deep Dive",
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 120,
        topic: "SN1, SN2, E1, and E2 mechanisms in detail",
        isCompleted: false,
      },
    ],
    resources: [
      {
        id: "r3",
        title: "Organic Chemistry Mechanisms Flowchart",
        type: "file",
        url: "https://example.com/ochem-mechanisms.pdf",
        addedBy: "u4",
        addedAt: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    isPublic: true,
    coverImage: "https://images.unsplash.com/photo-1603126857599-f6e157fa2fe6?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
  {
    id: "sg-3",
    name: "World Literature Book Club",
    description: "A group for discussing world literature classics and contemporary works from diverse authors and cultures.",
    subject: "Literature",
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
    members: [
      {
        id: "u6",
        name: "Riley Garcia",
        avatar: "https://i.pravatar.cc/150?u=a6",
        role: "admin",
        joinedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      },
      {
        id: "u7",
        name: "Avery Kim",
        avatar: "https://i.pravatar.cc/150?u=a7",
        role: "member",
        joinedAt: new Date(Date.now() - 55 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
    messages: [],
    sessions: [
      {
        id: "ses4",
        title: "One Hundred Years of Solitude Discussion",
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        duration: 90,
        topic: "Themes, symbolism, and magical realism in Gabriel García Márquez's masterpiece",
        isCompleted: false,
      },
    ],
    resources: [],
    isPublic: true,
    coverImage: "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  },
];

let studyGroups = [...MOCK_STUDY_GROUPS];

export const studyGroupService = {
  getStudyGroups: () => {
    return Promise.resolve([...studyGroups]);
  },
  
  getStudyGroupById: (id: string) => {
    const group = studyGroups.find(group => group.id === id);
    return Promise.resolve(group ? { ...group } : null);
  },
  
  createStudyGroup: (group: Omit<StudyGroup, 'id' | 'createdAt' | 'members' | 'messages' | 'sessions' | 'resources'>) => {
    const newGroup: StudyGroup = {
      ...group,
      id: uuidv4(),
      createdAt: new Date().toISOString(),
      members: [
        {
          id: "current-user", // In a real app, this would be the authenticated user's ID
          name: "Current User",
          avatar: "https://i.pravatar.cc/150?u=current",
          role: "admin",
          joinedAt: new Date().toISOString(),
        }
      ],
      messages: [],
      sessions: [],
      resources: [],
    };
    
    studyGroups = [...studyGroups, newGroup];
    return Promise.resolve({ ...newGroup });
  },
  
  joinStudyGroup: (groupId: string) => {
    const groupIndex = studyGroups.findIndex(group => group.id === groupId);
    if (groupIndex === -1) {
      return Promise.reject(new Error("Study group not found"));
    }
    
    const newMember = {
      id: "current-user", // In a real app, this would be the authenticated user's ID
      name: "Current User",
      avatar: "https://i.pravatar.cc/150?u=current",
      role: "member" as const,
      joinedAt: new Date().toISOString(),
    };
    
    // Check if user is already a member
    if (studyGroups[groupIndex].members.some(member => member.id === newMember.id)) {
      return Promise.reject(new Error("You're already a member of this group"));
    }
    
    const updatedGroup = {
      ...studyGroups[groupIndex],
      members: [...studyGroups[groupIndex].members, newMember],
    };
    
    studyGroups = studyGroups.map(group => 
      group.id === groupId ? updatedGroup : group
    );
    
    return Promise.resolve({ ...updatedGroup });
  },
  
  leaveStudyGroup: (groupId: string) => {
    const groupIndex = studyGroups.findIndex(group => group.id === groupId);
    if (groupIndex === -1) {
      return Promise.reject(new Error("Study group not found"));
    }
    
    const currentUserId = "current-user"; // In a real app, this would be the authenticated user's ID
    
    // Check if user is a member
    if (!studyGroups[groupIndex].members.some(member => member.id === currentUserId)) {
      return Promise.reject(new Error("You're not a member of this group"));
    }
    
    const updatedGroup = {
      ...studyGroups[groupIndex],
      members: studyGroups[groupIndex].members.filter(member => member.id !== currentUserId),
    };
    
    studyGroups = studyGroups.map(group => 
      group.id === groupId ? updatedGroup : group
    );
    
    return Promise.resolve({ ...updatedGroup });
  },
  
  addMessage: (groupId: string, content: string) => {
    const groupIndex = studyGroups.findIndex(group => group.id === groupId);
    if (groupIndex === -1) {
      return Promise.reject(new Error("Study group not found"));
    }
    
    const currentUser = {
      id: "current-user", // In a real app, this would be the authenticated user's ID
      name: "Current User",
      avatar: "https://i.pravatar.cc/150?u=current",
    };
    
    const newMessage = {
      id: uuidv4(),
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      content,
      timestamp: new Date().toISOString(),
    };
    
    const updatedGroup = {
      ...studyGroups[groupIndex],
      messages: [...studyGroups[groupIndex].messages, newMessage],
    };
    
    studyGroups = studyGroups.map(group => 
      group.id === groupId ? updatedGroup : group
    );
    
    return Promise.resolve({ ...updatedGroup });
  },
  
  addStudySession: (groupId: string, session: Omit<StudyGroupSession, 'id' | 'isCompleted'>) => {
    const groupIndex = studyGroups.findIndex(group => group.id === groupId);
    if (groupIndex === -1) {
      return Promise.reject(new Error("Study group not found"));
    }
    
    const newSession: StudyGroupSession = {
      ...session,
      id: uuidv4(),
      isCompleted: false,
    };
    
    const updatedGroup = {
      ...studyGroups[groupIndex],
      sessions: [...studyGroups[groupIndex].sessions, newSession],
    };
    
    studyGroups = studyGroups.map(group => 
      group.id === groupId ? updatedGroup : group
    );
    
    return Promise.resolve({ ...updatedGroup });
  },
  
  addResource: (groupId: string, resource: Omit<StudyGroupResource, 'id' | 'addedBy' | 'addedAt'>) => {
    const groupIndex = studyGroups.findIndex(group => group.id === groupId);
    if (groupIndex === -1) {
      return Promise.reject(new Error("Study group not found"));
    }
    
    const newResource: StudyGroupResource = {
      ...resource,
      id: uuidv4(),
      addedBy: "current-user", // In a real app, this would be the authenticated user's ID
      addedAt: new Date().toISOString(),
    };
    
    const updatedGroup = {
      ...studyGroups[groupIndex],
      resources: [...studyGroups[groupIndex].resources, newResource],
    };
    
    studyGroups = studyGroups.map(group => 
      group.id === groupId ? updatedGroup : group
    );
    
    return Promise.resolve({ ...updatedGroup });
  },
};
