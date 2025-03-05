
import { 
  BookOpen, Search, BarChart4, Mic, BookText, MessageSquare, GraduationCap, Users, Building
} from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: BookOpen,
    title: "Real-Time Lecture Support",
    description: "Get live transcription, automatic note summarization, and key point highlighting during lectures",
    link: "/note-taker"
  },
  {
    icon: Search,
    title: "Intelligent Content Curation",
    description: "AI searches for relevant PDFs, videos, and academic articles from trusted sources",
    link: "/resources"
  },
  {
    icon: BarChart4,
    title: "Learning Analytics Dashboard",
    description: "Track attendance, participation, resource usage, and quiz performance with detailed insights",
    link: "/dashboard"
  },
  {
    icon: Mic,
    title: "Voice Interaction Mode",
    description: "Ask questions verbally and get spoken responses for a natural learning experience",
    link: "/assistant"
  },
  {
    icon: BookText,
    title: "Personalized Study Assistant",
    description: "Get custom study plans, adaptive quizzes, and resources based on your learning style",
    link: "/assistant"
  },
  {
    icon: MessageSquare,
    title: "Virtual Office Hours",
    description: "Access AI assistance outside of class to clarify concepts and get feedback",
    link: "/assistant"
  }
];

const userGroups = [
  {
    icon: GraduationCap,
    title: "Students",
    description: "Enhance your learning experience with AI-powered assistance, note-taking, and personalized study plans.",
    link: "Student Features",
    linkPath: "/student-features"
  },
  {
    icon: Users,
    title: "Educators",
    description: "Gain valuable insights into student performance, automate content creation, and improve teaching methods.",
    link: "Educator Tools",
    linkPath: "/educator-tools"
  },
  {
    icon: Building,
    title: "Institutions",
    description: "Transform your educational offerings with cutting-edge AI technology that improves outcomes and satisfaction.",
    link: "Institution Benefits",
    linkPath: "/institution-benefits"
  }
];

const Features = () => {
  return (
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Cutting-Edge Features For Modern Learning
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Designed from the ground up to enhance every aspect of your educational journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index} 
              className="feature-card animate-scale-in" 
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="feature-icon">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground mb-4">{feature.description}</p>
              <Link 
                to={feature.link} 
                className="text-primary hover:underline inline-flex items-center"
              >
                Learn more <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>

        <div className="mt-32">
          <div className="text-center mb-16 animate-fade-in">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
              Perfect For Everyone in Education
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {userGroups.map((group, index) => (
              <div 
                key={index} 
                className="feature-card text-center animate-scale-in" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-4">
                  <div className="feature-icon rounded-full">
                    <group.icon className="h-6 w-6" />
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3">{group.title}</h3>
                <p className="text-muted-foreground mb-6">{group.description}</p>
                <Button variant="outline" size="sm" asChild>
                  <Link to={group.linkPath}>{group.link}</Link>
                </Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
