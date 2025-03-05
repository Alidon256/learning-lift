
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: "🎓",
    title: "Real-Time Lecture Support",
    description: "Get live transcription, automatic note summarization, and key point highlighting during lectures",
    link: "/note-taker"
  },
  {
    icon: "🔍",
    title: "Intelligent Content Curation",
    description: "AI searches for relevant PDFs, videos, and academic articles from trusted sources",
    link: "/dashboard"
  },
  {
    icon: "📊",
    title: "Learning Analytics Dashboard",
    description: "Track attendance, participation, resource usage, and quiz performance with detailed insights",
    link: "/dashboard"
  },
  {
    icon: "🎤",
    title: "Voice Interaction Mode",
    description: "Ask questions verbally and get spoken responses for a natural learning experience",
    link: "/assistant"
  },
  {
    icon: "📚",
    title: "Personalized Study Assistant",
    description: "Get custom study plans, adaptive quizzes, and resources based on your learning style",
    link: "/assistant"
  },
  {
    icon: "💬",
    title: "Virtual Office Hours",
    description: "Access AI assistance outside of class to clarify concepts and get feedback",
    link: "/assistant"
  },
  {
    icon: "🎮",
    title: "Gamified Learning Experience",
    description: "Earn achievements, badges, and track progress through an engaging learning journey",
    link: "/dashboard"
  },
  {
    icon: "🌐",
    title: "Multilingual Support",
    description: "Learn in your preferred language with translation for content and interactions",
    link: "/assistant"
  },
  {
    icon: "👥",
    title: "Collaborative Study Groups",
    description: "Form virtual study sessions with AI-facilitated discussions and resource sharing",
    link: "/dashboard"
  }
];

const Features = () => {
  return (
    <div className="container max-w-7xl py-20 animate-fade-in">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Cutting-Edge Features For Modern Learning</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Our AI-powered educational tools revolutionize how students learn and professors teach
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <div 
            key={index} 
            className="bg-white dark:bg-gray-800 p-8 rounded-2xl neo-morphism transition-all duration-300 hover:translate-y-[-5px] animate-scale-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground mb-4">{feature.description}</p>
            <Button variant="link" asChild className="px-0">
              <Link to={feature.link} className="flex items-center text-primary">
                Explore <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ))}
      </div>
      
      <div className="mt-20 bg-primary/5 rounded-2xl p-10 neo-morphism">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold tracking-tight mb-3">Ready to Transform Your Learning Experience?</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of students and educators who have already elevated their academic journey.
          </p>
        </div>
        
        <div className="flex justify-center gap-4">
          <Button size="lg" asChild>
            <Link to="/dashboard">
              Get Started Now
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/assistant">
              Try the AI Assistant
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Features;
