import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, ArrowRight } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function ContactSection() {
  const { getSetting } = useSiteSettings();

  const phone1 = getSetting("contact_phone_1", "+91 7020981168");
  const email = getSetting("contact_email", "dunnesschool@gmail.com");
  const address = getSetting("school_address", "Nathalal Parekh Marg, Admiralty House Wodehouse Road, Colaba Mumbai-400005");

  return <section className="py-16 md:py-24 bg-gradient-section">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
            Get in Touch
          </span>
          <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-4">
            Contact Us
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about admissions or our programs? 
            We'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Primary Campus */}
          <div className="bg-card rounded-xl p-6 shadow-lg border">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground mb-2">
              Primary & Secondary Campus
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              {address}
            </p>
            <p className="text-xs text-muted-foreground">
              Std 1 to Std 10 (ICSE Board)
            </p>
          </div>

          {/* Pre-Primary Campus */}
          <div className="bg-card rounded-xl p-6 shadow-lg border">
            <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
              <MapPin className="h-6 w-6 text-secondary" />
            </div>
            <h3 className="font-heading text-lg font-bold text-foreground mb-2">
              Pre-Primary Campus
            </h3>
            <p className="text-muted-foreground text-sm mb-4">
              4th & 5th Floor, K. R. Cama Oriental Institute Building, Opp. Lion Gate, Near Kala Ghoda, Mumbai - 400023
            </p>
            <p className="text-xs text-muted-foreground">
              Play Group to Sr. Kindergarten
            </p>
          </div>

          {/* Contact Info */}
          <div className="bg-primary rounded-xl p-6 text-primary-foreground shadow-lg">
            <h3 className="font-heading text-lg font-bold mb-4">
              Quick Contact
            </h3>
            <div className="space-y-4">
              <a href={`tel:${phone1.replace(/\s/g, '')}`} className="flex items-center gap-3 hover:text-secondary transition-colors">
                <Phone className="h-5 w-5" />
                <span>{phone1}</span>
              </a>
              <a href={`mailto:${email}`} className="flex items-center gap-3 hover:text-secondary transition-colors">
                <Mail className="h-5 w-5" />
                <span>{email}</span>
              </a>
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5" />
                <span>Mon - Sat: 8:00 AM - 4:00 PM</span>
              </div>
            </div>
            <div className="mt-6">
              <Link to="/contact">
                <Button variant="secondary" className="w-full font-bold">
                  Send Us an Enquiry <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>;
}
