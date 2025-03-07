
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/Dashboard";
import Assistant from "./pages/Assistant";
import NoteTaker from "./pages/NoteTaker";
import Features from "./pages/Features";
import Resources from "./pages/Resources";
import StudentFeatures from "./pages/StudentFeatures";
import EducatorTools from "./pages/EducatorTools";
import InstitutionBenefits from "./pages/InstitutionBenefits";
import NavigationDrawer from "@/components/layout/NavigationDrawer";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark">
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <NavigationDrawer />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/assistant" element={<Assistant />} />
            <Route path="/note-taker" element={<NoteTaker />} />
            <Route path="/features" element={<Features />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/student-features" element={<StudentFeatures />} />
            <Route path="/educator-tools" element={<EducatorTools />} />
            <Route path="/institution-benefits" element={<InstitutionBenefits />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
