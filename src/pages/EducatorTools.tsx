
import { ArrowLeft, ArrowRight, BarChart4, Brain, FileText, PenTool, Presentation, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const tools = [
  {
    icon: BarChart4,
    title: "Learning Analytics Dashboard",
    description: "Access detailed insights into student performance and engagement throughout your courses.",
    link: "/dashboard"
  },
  {
    icon: Presentation,
    title: "AI Presentation Creator",
    description: "Generate dynamic, visually appealing slides from your lecture notes with one click.",
    link: "/assistant"
  },
  {
    icon: FileText,
    title: "Content Generation",
    description: "Create quizzes, assignments, and supplementary materials tailored to your curriculum.",
    link: "/assistant"
  },
  {
    icon: Brain,
    title: "Personalized Teaching Insights",
    description: "Receive suggestions for improving lecture delivery based on student engagement data.",
    link: "/dashboard"
  },
  {
    icon: PenTool,
    title: "Automated Grading",
    description: "Save time with AI-powered grading that provides consistent and detailed feedback.",
    link: "/assistant"
  }
];

const EducatorTools = () => {
  return (
    <div className="container max-w-6xl mx-auto py-12 px-4 animate-fade-in">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Educator Tools</h1>
      </div>
      
      <div className="flex items-center justify-center mb-16">
        <div className="bg-primary/10 rounded-full p-8 animate-pulse-soft">
          <Users className="h-16 w-16 text-primary" />
        </div>
      </div>
      
      <p className="text-muted-foreground mb-12 max-w-3xl mx-auto text-center text-lg">
        Transform your teaching approach with powerful AI tools designed for educators.
        Reduce administrative workload and focus on what matters most - inspiring your students.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {tools.map((tool, index) => (
          <Card key={index} className="neo-morphism overflow-hidden hover:shadow-lg transition-all duration-300 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <tool.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{tool.title}</CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button asChild variant="outline" className="w-full group">
                <Link to={tool.link}>
                  Explore tool
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      
      <div className="bg-accent/50 rounded-2xl p-8 max-w-4xl mx-auto neo-morphism">
        <h3 className="text-2xl font-semibold mb-4 text-center">Ready to Revolutionize Your Teaching?</h3>
        <p className="text-muted-foreground mb-6 text-center">
          Join educators worldwide who are using AI to enhance learning outcomes and teaching efficiency.
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

export default EducatorTools;
