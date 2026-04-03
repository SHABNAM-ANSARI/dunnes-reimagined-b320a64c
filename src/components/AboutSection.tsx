import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { BookOpen, Users, Star, ArrowRight } from "lucide-react";
export function AboutSection() {
  return <section className="py-16 md:py-24 bg-gradient-section">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
              About Our Institute
            </span>
            <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
              A Legacy of Excellence Since{" "}
              <span className="text-primary">1949</span>
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Dunne's Institute was initiated by a French lady - <strong>Madam C. V. Dunne</strong> in 1949. 
              On 6th April, 1956, it was taken over by three eminent and visionary Parsi sisters, viz., 
              Mrs. Dhun Jimmy Engineer, Mrs. Mahabanoo Sorab Cooper and Mrs. Pearl Noshir Vevaina.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              We are recognized by the Government of Maharashtra as a Parsi Minority Education Institution. 
              Ours is a co-educational and cosmopolitan institution providing education to all communities 
              including foreign students in a very congenial and harmonious environment.
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[{
              icon: BookOpen,
              title: "ICSE Board",
              desc: "Affiliated curriculum"
            }, {
              icon: Users,
              title: "Co-Educational",
              desc: "Inclusive learning"
            }, {
              icon: Star,
              title: "60+ Years",
              desc: "Of excellence"
            }].map(item => <div key={item.title} className="flex items-start gap-3 p-4 rounded-lg bg-card shadow-sm">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <item.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground text-sm">{item.title}</h4>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>)}
            </div>

            <Button asChild className="bg-primary hover:bg-primary/90">
              <Link to="/about">
                Learn More About Us
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="bg-primary rounded-xl p-5 sm:p-6 text-primary-foreground shadow-lg">
                  <h3 className="font-heading text-3xl sm:text-4xl font-bold mb-2">75+</h3>
                  <p className="text-sm text-primary-foreground/80">Years of Excellence</p>
                </div>
                <div className="bg-card rounded-xl p-5 sm:p-6 shadow-lg border">
                  <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground mb-2">Our Mission</h3>
                  <p className="text-sm text-muted-foreground">
                    To develop all-round academic acumen in a dynamically changing environment through education and multifaceted activities.
                  </p>
                </div>
              </div>
              <div className="space-y-4 sm:pt-8">
                <div className="bg-secondary rounded-xl p-5 sm:p-6 text-secondary-foreground shadow-gold">
                  <h3 className="font-heading text-lg sm:text-xl font-bold mb-2">Our Vision</h3>
                  <p className="text-sm">
                    To be the premier ICSE Institute in moulding and nurturing students to excel in all spheres.
                  </p>
                </div>
                <div className="bg-card rounded-xl p-5 sm:p-6 shadow-lg border">
                  <h4 className="font-heading text-base sm:text-lg font-bold text-foreground mb-3">Current Leadership</h4>
                  <div className="space-y-3 text-sm">
                    <div className="text-muted-foreground">
                      <p className="font-semibold text-foreground">Principal:</p>
                      <p className="mt-1">Mrs. Kiran Singh</p>
                    </div>
                    <div className="text-muted-foreground">
                      <p className="font-semibold text-foreground">Education Advisor:</p>
                      <p className="mt-1">Mr. Shahbehram Khushrushahi</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>;
}