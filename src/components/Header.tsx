import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Phone, Mail, MapPin, Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import schoolLogo from "@/assets/school-logo.jpeg";
const navigation = [{
  name: "Home",
  href: "/"
}, {
  name: "About Us",
  href: "/about",
  children: [{
    name: "Introduction",
    href: "/about"
  }, {
    name: "Mission & Vision",
    href: "/about#mission"
  }, {
    name: "Our History",
    href: "/about#history"
  }]
}, {
  name: "Activities",
  href: "/activities"
}, {
  name: "Admissions",
  href: "/admissions"
}, {
  name: "Gallery",
  href: "/gallery"
}, {
  name: "Contact",
  href: "/contact"
}];
export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  return <header className="sticky top-0 z-50 w-full">
      {/* Top bar with contact info */}
      <div className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between py-2 text-sm">
            <div className="flex flex-wrap items-center gap-4 md:gap-6">
              <a href="tel:7020981168" className="flex items-center gap-1.5 hover:text-secondary transition-colors">
                <Phone className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">+91 7020981168</span>
              </a>
              <a href="mailto:dunnesschool@gmail.com" className="flex items-center gap-1.5 hover:text-secondary transition-colors">
                <Mail className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">dunnesschool@gmail.com</span>
              </a>
              
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-xs md:text-sm">
                <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="hidden md:inline">Colaba, Mumbai</span>
              </div>
              <a 
                href="https://www.instagram.com/dunnes_institute_high_school?utm_source=qr&igsh=ZHN1dW41b3gwMDZm" 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:text-secondary transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation */}
      <nav className="bg-card/95 backdrop-blur-md border-b shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative">
                <img src={schoolLogo} alt="Dunne's Institute Logo" className="w-14 h-14 object-contain rounded-lg shadow-lg group-hover:shadow-xl transition-shadow" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-heading text-xl md:text-2xl font-bold text-primary leading-tight">
                  Dunne's Institute
                </h1>
                <p className="text-xs text-muted-foreground">Committed to Academic Excellence</p>
              </div>
            </Link>

            {/* Desktop navigation */}
            <div className="hidden lg:flex items-center gap-1">
              {navigation.map(item => <Link key={item.name} to={item.href} className={cn("px-4 py-2 text-sm font-medium rounded-md transition-colors", location.pathname === item.href ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted hover:text-primary")}>
                  {item.name}
                </Link>)}
            </div>

            {/* CTA Button */}
            <div className="hidden lg:flex items-center gap-4">
              <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary hover:text-primary-foreground">
                <Link to="/parent">Parent Login</Link>
              </Button>
              <Button asChild className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-gold">
                <Link to="/contact">Enquire Now</Link>
              </Button>
            </div>

            {/* Mobile menu button */}
            <button type="button" className="lg:hidden p-2 rounded-md text-foreground hover:bg-muted" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && <div className="lg:hidden border-t bg-card animate-slide-up">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navigation.map(item => <Link key={item.name} to={item.href} className={cn("block px-4 py-3 rounded-md text-sm font-medium transition-colors", location.pathname === item.href ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-muted")} onClick={() => setMobileMenuOpen(false)}>
                  {item.name}
                </Link>)}
              <Button asChild variant="outline" className="w-full border-primary text-primary">
                <Link to="/parent" onClick={() => setMobileMenuOpen(false)}>
                  Parent Login
                </Link>
              </Button>
              <Button asChild className="w-full mt-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
                  Enquire Now
                </Link>
              </Button>
            </div>
          </div>}
      </nav>
    </header>;
}
