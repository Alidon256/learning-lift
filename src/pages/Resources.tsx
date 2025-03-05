
import { ArrowLeft, BookOpen, ExternalLink, FileText, Video } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const resources = [
  {
    type: "pdf",
    title: "Introduction to Machine Learning",
    author: "Stanford University",
    description: "A comprehensive guide to the fundamental concepts of machine learning algorithms.",
    link: "#",
    date: "March 15, 2023"
  },
  {
    type: "video",
    title: "Neural Networks Explained",
    author: "MIT OpenCourseWare",
    description: "Visual explanation of how neural networks work and their applications in AI.",
    link: "#",
    date: "April 22, 2023"
  },
  {
    type: "pdf",
    title: "Advanced Natural Language Processing",
    author: "Berkeley AI Research",
    description: "Deep dive into NLP techniques used in modern language models.",
    link: "#",
    date: "January 10, 2023"
  },
  {
    type: "article",
    title: "The Future of Educational Technology",
    author: "Journal of Educational Research",
    description: "Research on how AI is transforming education and what to expect in the coming years.",
    link: "#",
    date: "May 5, 2023"
  },
  {
    type: "video",
    title: "Building Transformer Models from Scratch",
    author: "Google AI Research",
    description: "Step-by-step tutorial on implementing transformer architecture for language processing.",
    link: "#",
    date: "February 28, 2023"
  },
  {
    type: "article",
    title: "Ethics in Artificial Intelligence",
    author: "ACM Digital Library",
    description: "Discussion on ethical considerations when developing and deploying AI systems.",
    link: "#",
    date: "June 12, 2023"
  }
];

const getResourceIcon = (type: string) => {
  switch(type) {
    case "pdf":
      return <FileText className="h-5 w-5 text-red-500" />;
    case "video":
      return <Video className="h-5 w-5 text-blue-500" />;
    case "article":
      return <BookOpen className="h-5 w-5 text-green-500" />;
    default:
      return <FileText className="h-5 w-5" />;
  }
};

const Resources = () => {
  return (
    <div className="container max-w-6xl mx-auto py-12 px-4 animate-fade-in">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">AI-Curated Resources</h1>
      </div>
      
      <p className="text-muted-foreground mb-8 max-w-3xl">
        Our AI has compiled the most relevant and high-quality resources to support your learning journey. 
        All materials are vetted from trusted academic sources and updated regularly.
      </p>

      <Tabs defaultValue="all" className="mb-8">
        <TabsList className="mb-6">
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="pdfs">PDFs</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource, index) => (
              <Card key={index} className="neo-morphism overflow-hidden animate-scale-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    {getResourceIcon(resource.type)}
                    <span className="text-xs text-muted-foreground">{resource.date}</span>
                  </div>
                  <CardTitle className="mt-2">{resource.title}</CardTitle>
                  <CardDescription>By {resource.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{resource.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={resource.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center">
                      View Resource
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
        
        <TabsContent value="pdfs" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.filter(r => r.type === "pdf").map((resource, index) => (
              <Card key={index} className="neo-morphism overflow-hidden animate-scale-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    {getResourceIcon(resource.type)}
                    <span className="text-xs text-muted-foreground">{resource.date}</span>
                  </div>
                  <CardTitle className="mt-2">{resource.title}</CardTitle>
                  <CardDescription>By {resource.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{resource.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={resource.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center">
                      View Resource
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.filter(r => r.type === "video").map((resource, index) => (
              <Card key={index} className="neo-morphism overflow-hidden animate-scale-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    {getResourceIcon(resource.type)}
                    <span className="text-xs text-muted-foreground">{resource.date}</span>
                  </div>
                  <CardTitle className="mt-2">{resource.title}</CardTitle>
                  <CardDescription>By {resource.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{resource.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={resource.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center">
                      View Resource
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="articles" className="animate-fade-in">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.filter(r => r.type === "article").map((resource, index) => (
              <Card key={index} className="neo-morphism overflow-hidden animate-scale-in" style={{ animationDelay: `${index * 0.05}s` }}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    {getResourceIcon(resource.type)}
                    <span className="text-xs text-muted-foreground">{resource.date}</span>
                  </div>
                  <CardTitle className="mt-2">{resource.title}</CardTitle>
                  <CardDescription>By {resource.author}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm">{resource.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <a href={resource.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center">
                      View Resource
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Resources;
