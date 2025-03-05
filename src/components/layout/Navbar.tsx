
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";

const Navbar = () => {
  const { theme, setTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link
            to="/"
            className="flex items-center space-x-2 text-2xl font-bold text-primary animate-fade-in"
          >
            <span className="text-gradient">LearningLift</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Home
            </Link>
            <Link
              to="/features"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              to="/dashboard"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              to="/assistant"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Assistant
            </Link>
            <Link
              to="/note-taker"
              className="text-sm font-medium hover:text-primary transition-colors"
            >
              Note Taker
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button size="sm" className="ml-4 animate-pulse-soft">
              Sign In
            </Button>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-4 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background border-t animate-fade-in">
          <div className="px-4 py-2 space-y-1">
            <Link
              to="/"
              className="block py-2 text-base font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/features"
              className="block py-2 text-base font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/dashboard"
              className="block py-2 text-base font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/assistant"
              className="block py-2 text-base font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Assistant
            </Link>
            <Link
              to="/note-taker"
              className="block py-2 text-base font-medium hover:text-primary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Note Taker
            </Link>
            <Button className="w-full mt-4">Sign In</Button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
