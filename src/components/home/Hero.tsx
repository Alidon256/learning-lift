
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ThemeToggle } from "@/components/ThemeToggle";

const Hero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)]"></div>
      
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center space-y-8 animate-fade-in">
          <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-4 animate-pulse-soft">
            AI-Powered Education Tool
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="animate-slide-in inline-block" style={{ animationDelay: "0.1s" }}>Revolutionize</span>{" "}
            <span className="animate-slide-in inline-block" style={{ animationDelay: "0.2s" }}>Your</span>{" "}
            <span className="animate-slide-in inline-block" style={{ animationDelay: "0.3s" }}>Learning</span>{" "}
            <span className="animate-slide-in inline-block" style={{ animationDelay: "0.4s" }}>Experience</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-muted-foreground animate-fade-in" style={{ animationDelay: "0.5s" }}>
            An advanced AI companion that enhances your educational journey with real-time support, personalized insights, and smart content curation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 animate-scale-in" style={{ animationDelay: "0.6s" }}>
            <Button size="lg" asChild className="group animate-float">
              <Link to="/dashboard">
                Start Learning 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="hover:shadow-lg transition-all duration-300">
              <Link to="/assistant">
                Explore Assistant
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
