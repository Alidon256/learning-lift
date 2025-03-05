
import { ArrowLeft, ArrowRight, BookOpen, Brain, GraduationCap, Lightbulb, MessageSquare, Mic } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: BookOpen,
    title: "AI-Powered Note Taking",
    description: "Automatically capture and organize lecture notes with AI transcription and summarization.",
    link: "/note-taker"
  },
  {
    icon: Brain,
    title: "Personalized Learning Paths",
    description: "Get custom study recommendations based on your learning style and performance.",
    link: "/assistant"
  },
  {
    icon: MessageSquare,
    title: "24/7 Study Assistance",
    description: "Ask questions anytime and receive instant explanations tailored to your understanding.",
    link: "/assistant"
  },
  {
    icon: Mic,
    title: "Voice Learning Mode",
    description: "Study hands-free with voice-activated queries and spoken responses.",
    link: "/assistant"
  },
  {
    icon: Lightbulb,
    title: "Adaptive Quizzing",
    description: "Practice with questions that adapt to your knowledge level for efficient learning.",
    link: "/dashboard"
  }
];

const StudentFeatures = () => {
  return (
    <div className="container max-w-6xl mx-auto py-12 px-4 animate-fade-in">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Student Features</h1>
      </div>
      
      <div className="flex items-center justify-center mb-16">
        <div className="bg-primary/10 rounded-full p-8 animate-pulse-soft">
          <GraduationCap className="h-16 w-16 text-primary" />
        </div>
      </div>
      
      <p className="text-muted-foreground mb-12 max-w-3xl mx-auto text-center text-lg">
        Empower your educational journey with AI tools designed specifically for students.
        Our platform helps you learn more effectively, stay organized, and excel in your studies.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {features.map((feature, index) => (
          <Card key={index} className="neo-morphism overflow-hidden hover:shadow-lg transition-all duration-300 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{feature.title}</CardTitle>
              <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="outline" className="w-full group">
                <Link to={feature.link}>
                  Try it now
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="bg-accent/50 rounded-2xl p-8 max-w-4xl mx-auto neo-morphism">
        <h3 className="text-2xl font-semibold mb-4 text-center">Ready to Transform Your Learning Experience?</h3>
        <p className="text-muted-foreground mb-6 text-center">
          Join thousands of students who have already improved their grades and reduced study time.
        </p>
        <div className="flex justify-center">
          <Button size="lg" asChild>
            <Link to="/dashboard">Get Started Today</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StudentFeatures;
