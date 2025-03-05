
import { ArrowLeft, ArrowRight, Building, LineChart, Shield, TrendingUp, UsersRound, Wallet } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const benefits = [
  {
    icon: TrendingUp,
    title: "Improved Learning Outcomes",
    description: "Enhanced student performance with personalized AI learning paths and real-time support.",
    statistic: "27% average grade improvement"
  },
  {
    icon: Wallet,
    title: "Cost Efficiency",
    description: "Reduce operational costs while enhancing educational quality and instructor effectiveness.",
    statistic: "32% reduction in administrative costs"
  },
  {
    icon: UsersRound,
    title: "Higher Retention Rates",
    description: "Keep students engaged and supported through AI interventions that identify at-risk students.",
    statistic: "18% improvement in retention"
  },
  {
    icon: LineChart,
    title: "Data-Driven Insights",
    description: "Make informed decisions about curriculum and teaching methods with comprehensive analytics.",
    statistic: "Access to 50+ institutional metrics"
  },
  {
    icon: Shield,
    title: "Compliance & Security",
    description: "Full FERPA compliance with enterprise-grade security protocols for student data protection.",
    statistic: "SOC 2 Type II certified"
  }
];

const InstitutionBenefits = () => {
  return (
    <div className="container max-w-6xl mx-auto py-12 px-4 animate-fade-in">
      <div className="flex items-center mb-8">
        <Button variant="ghost" size="sm" asChild className="mr-4">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Institution Benefits</h1>
      </div>
      
      <div className="flex items-center justify-center mb-16">
        <div className="bg-primary/10 rounded-full p-8 animate-pulse-soft">
          <Building className="h-16 w-16 text-primary" />
        </div>
      </div>
      
      <p className="text-muted-foreground mb-12 max-w-3xl mx-auto text-center text-lg">
        Transform your educational institution with our comprehensive AI platform.
        From improved student outcomes to operational efficiency, our solution offers measurable benefits.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
        {benefits.map((benefit, index) => (
          <Card key={index} className="neo-morphism overflow-hidden hover:shadow-lg transition-all duration-300 animate-scale-in" style={{ animationDelay: `${index * 0.1}s` }}>
            <CardHeader>
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <benefit.icon className="h-6 w-6 text-primary" />
              </div>
              <CardTitle>{benefit.title}</CardTitle>
              <CardDescription>{benefit.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-accent/40 p-3 rounded-lg text-center mt-2">
                <p className="font-semibold text-foreground">{benefit.statistic}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <div className="bg-accent/50 rounded-2xl p-8 max-w-4xl mx-auto neo-morphism">
        <h3 className="text-2xl font-semibold mb-4 text-center">Ready to Transform Your Institution?</h3>
        <p className="text-muted-foreground mb-6 text-center">
          Schedule a demo with our team to see how our AI platform can address your specific institutional needs.
        </p>
        <div className="flex justify-center gap-4 flex-wrap">
          <Button size="lg" asChild>
            <Link to="/contact">Request Demo</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/pricing">View Enterprise Pricing</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default InstitutionBenefits;
