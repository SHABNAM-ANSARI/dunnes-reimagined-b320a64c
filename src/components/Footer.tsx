import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, Clock, Award, Instagram } from "lucide-react";
import schoolLogo from "@/assets/school-logo.jpeg";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function Footer() {
  const { getSetting } = useSiteSettings();

  const instagramUrl = getSetting(
    "instagram_url",
    "https://www.instagram.com/dunnes_institute_icse_school?utm_source=qr&igsh=ZHN1dW41b3gwMDZm"
  );
  const principalName = getSetting("principal_name", "Mrs. Kiran Singh");
  const contactPhone = getSetting("principal_contact", "+91 7020981168");

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* School Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-4">
              <img src={schoolLogo} alt="Dunne's Institute Logo" className="w-12 h-12 object-contain rounded" />
              <div>
                <h3 className="font-heading text-xl font-bold">Dunne's Institute</h3>
                <p className="text-xs text-primary-foreground/70">Since 1949</p>
              </div>
            </div>
            <p className="text-sm text-primary-foreground/80 leading-relaxed">
              Committed to Academic Excellence. We redefine education where learning is a pleasure and every child is encouraged to celebrate it.
            </p>
            <div className="flex items-center gap-2 mt-4">
              <Award className="h-5 w-5 text-secondary" />
              <span className="text-sm">ISO 9001:2000 Certified</span>
            </div>
            <div className="mt-4">
              <a href={instagramUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary-foreground/80 hover:text-secondary transition-colors">
                <Instagram className="h-5 w-5" />
                <span className="text-sm">Follow us on Instagram</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { name: "About Us", href: "/about" },
                { name: "Admissions", href: "/admissions" },
                { name: "School Activities", href: "/activities" },
                { name: "Photo Gallery", href: "/gallery" },
                { name: "Contact Us", href: "/contact" },
                { name: "Privacy Policy", href: "/privacy-policy" },
              ].map((link) => (
                <li key={link.name}>
                  <Link to={link.href} className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                <span className="text-sm text-primary-foreground/80">
                  Nathalal Parekh Marg, Admiralty House Wodehouse Road, Colaba Mumbai-400005
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-secondary flex-shrink-0" />
               <a href="tel:+917020981168" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
               +91 7020981168   
                </a>               
              </li>
              <li className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-secondary flex-shrink-0" />
                <a href="mailto:dunnesschool@gmail.com" className="text-sm text-primary-foreground/80 hover:text-secondary transition-colors">
                  dunnesschool@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-secondary flex-shrink-0" />
                <span className="text-sm text-primary-foreground/80">Mon - Sat: 8:00 AM - 4:00 PM</span>
              </li>
            </ul>
          </div>

          {/* Campuses */}
          <div>
            <h4 className="font-heading text-lg font-semibold mb-4">Our Campuses</h4>
            <div className="space-y-4">
              <div>
                <h5 className="font-semibold text-secondary text-sm">Pre-Primary Section</h5>
                <p className="text-xs text-primary-foreground/70 mt-1">
                  K. R. Cama Oriental Institute Building, Opp. Lion Gate, Near Kala Ghoda, Mumbai - 400023
                </p>
              </div>
              <div>
                <h5 className="font-semibold text-secondary text-sm">Primary & Secondary Section</h5>
                <p className="text-xs text-primary-foreground/70 mt-1">
                  Admiralty House, Wodehouse Road, Colaba, Mumbai - 400005
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-primary-foreground/10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-primary-foreground/60">
            <p>© {new Date().getFullYear()} Dunne's Institute. All rights reserved.</p>
            <p>Principal: {principalName} (Noted Educationist)</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
