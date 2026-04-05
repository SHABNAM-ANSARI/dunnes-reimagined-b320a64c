import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, Users, Award, ArrowRight } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

export function Hero() {
  const { getSetting, loading } = useSiteSettings();

  const headline = getSetting("hero_headline", "Welcome to Dunne's Institute");
  const subheadline = getSetting("hero_subheadline", "Where learning is a pleasure");
  const description = getSetting(
    "hero_description",
    "We redefine education with enthusiasm to work towards the creation of a culture that celebrates learning as continuous and integrated with life processes."
  );
  const bgImage = getSetting("hero_bg_image", "");

  const bgStyle = bgImage
    ? { backgroundImage: `url(${bgImage})`, backgroundSize: "cover", backgroundPosition: "center" }
    : {};

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background with overlay */}
      <div className="absolute inset-0 bg-gradient-hero" style={bgStyle}>
        {bgImage && <div className="absolute inset-0 bg-primary/70" />}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMC0zMHY2aDZ2LTZoLTZ6bTAgMTB2Nmg2di02aC02em0wIDEwdjZoNnYtNmgtNnptLTEwLTIwdjZoNnYtNmgtNnptMCAxMHY2aDZ2LTZoLTZ6bTAgMTB2Nmg2di02aC02em0wIDEwdjZoNnYtNmgtNnptLTEwLTMwdjZoNnYtNmgtNnptMCAxMHY2aDZ2LTZoLTZ6bTAgMTB2Nmg2di02aC02em0wIDEwdjZoNnYtNmgtNnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-30" />
      </div>

      <div className="container relative mx-auto px-4 py-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-primary-foreground animate-fade-in">
            <div className="inline-flex items-center gap-2 bg-secondary/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
              <Award className="h-4 w-4 text-secondary" />
              <span className="text-sm font-medium">ISO 9001:2000 Certified Institution</span>
            </div>

            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
              {headline.includes("Dunne") ? (
                <>
                  Welcome to{" "}
                  <span className="text-secondary text-5xl">Dunne's Institute</span>
                </>
              ) : (
                headline
              )}
            </h1>

            <p className="text-lg md:text-xl text-primary-foreground/90 mb-4 font-light italic">
              "{subheadline}"
            </p>

            <p className="text-base md:text-lg text-primary-foreground/80 mb-8 max-w-xl">
              {description}
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Button asChild size="lg" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground shadow-gold">
                <Link to="/admissions">
                  Apply for Admission
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/about">Explore Our Legacy</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              {[
                { icon: GraduationCap, value: "75+", label: "Years of Excellence" },
                { icon: Users, value: "1000+", label: "Students" },
                { icon: Award, value: "ICSE", label: "Affiliated Board" },
              ].map((stat, index) => (
                <div
                  key={stat.label}
                  className="text-center p-4 rounded-lg bg-primary-foreground/5 backdrop-blur-sm"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <stat.icon className="h-6 w-6 text-secondary mx-auto mb-2" />
                  <div className="font-heading text-2xl md:text-3xl font-bold">{stat.value}</div>
                  <div className="text-xs text-primary-foreground/70">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Image/Visual */}
          <div className="hidden lg:block relative animate-slide-up" style={{ animationDelay: "200ms" }}>
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-secondary/20 rounded-full blur-2xl" />
              <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-secondary/20 rounded-full blur-3xl" />
              <div className="relative bg-card/10 backdrop-blur-md rounded-2xl p-8 border border-primary-foreground/10">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 mx-auto rounded-full bg-secondary/20 flex items-center justify-center mb-4">
                    <span className="font-heading text-4xl font-bold text-secondary">DI</span>
                  </div>
                  <h3 className="font-heading text-2xl font-bold text-primary-foreground mb-2">Dunne's Institute</h3>
                  <p className="text-primary-foreground/70 text-sm">Committed to Academic Excellence</p>
                </div>
                <div className="space-y-4">
                  <div className="bg-primary-foreground/5 rounded-lg p-4">
                    <h4 className="font-semibold text-secondary text-sm mb-1">Pre-Primary</h4>
                    <p className="text-xs text-primary-foreground/70">Play Group to Sr. KG</p>
                  </div>
                  <div className="bg-primary-foreground/5 rounded-lg p-4">
                    <h4 className="font-semibold text-secondary text-sm mb-1">Primary & Secondary</h4>
                    <p className="text-xs text-primary-foreground/70">Std 1 to Std 10 (ICSE)</p>
                  </div>
                </div>
                <div className="mt-6 pt-6 border-t border-primary-foreground/10 text-center">
                  <p className="text-xs text-primary-foreground/60">Established 1949 • Parsi Minority Institution</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="hsl(var(--background))" />
        </svg>
      </div>
    </section>
  );
}
