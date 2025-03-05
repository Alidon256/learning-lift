
import { MoreHorizontal, File } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  date: string;
  type: "lecture" | "study" | "project"
}

const notes: Note[] = [
  {
    id: "note1",
    title: "AI Fundamentals",
    content: "Lecture notes on artificial intelligence concepts including narrow AI vs general AI, machine learning basics, and ethical considerations.",
    date: "October 12, 2023",
    type: "lecture"
  },
  {
    id: "note2",
    title: "Data Structures",
    content: "Review of binary trees, heaps, and graph algorithms. Implementation details and time complexity analysis for each structure.",
    date: "October 10, 2023",
    type: "study"
  },
  {
    id: "note3",
    title: "Machine Learning Project",
    content: "Project meeting notes - decided on implementing a recommendation system using collaborative filtering. Tasks assigned to team members.",
    date: "October 8, 2023",
    type: "project"
  },
  {
    id: "note4",
    title: "Neural Networks",
    content: "Detailed explanation of backpropagation algorithm with mathematical derivation. Implementation notes from hands-on session.",
    date: "October 5, 2023",
    type: "lecture"
  }
];

const NoteCard = ({ note }: { note: Note }) => {
  const getTypeLabel = () => {
    switch (note.type) {
      case "lecture":
        return "Lecture Notes";
      case "study":
        return "Study Notes";
      case "project":
        return "Project Notes";
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl neo-morphism h-full animate-scale-in">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="py-1 px-2 bg-primary/10 text-primary text-xs font-medium rounded">
            {getTypeLabel()}
          </div>
        </div>
        <button className="p-1 hover:bg-secondary rounded-full">
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>
      
      <h3 className="text-lg font-medium mt-4 mb-2">{note.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-3">{note.content}</p>
      
      <div className="flex justify-between items-center mt-4">
        <span className="text-xs text-muted-foreground">{note.date}</span>
      </div>
    </div>
  );
};

const RecentNotes = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {notes.map((note) => (
        <NoteCard key={note.id} note={note} />
      ))}
    </div>
  );
};

export default RecentNotes;
