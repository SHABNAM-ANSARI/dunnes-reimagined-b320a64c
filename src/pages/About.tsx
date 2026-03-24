import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { BookOpen, Users, Star, Award, Target, Lightbulb, GraduationCap } from "lucide-react";
const About = () => {
  return <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Page Header */}
        <section className="bg-gradient-hero py-16 md:py-24">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary-foreground mb-4">
              About Us
            </h1>
            <p className="text-primary-foreground/80 max-w-2xl mx-auto">
              Discover our rich legacy of academic excellence spanning over seven decades
            </p>
          </div>
        </section>

        {/* Introduction */}
        <section className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
                A Word About Ourselves
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                Committed to Academic Excellence
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  We are recognized by the Government of Maharashtra as a Parsi Minority Education Institution. 
                  We redefine Education in a manner, where learning is a pleasure and every child is encouraged to celebrate it.
                </p>
                <p>
                  Ours is a co-educational and cosmopolitan institution which provides Education to all communities 
                  including the foreign students in a very congenial and harmonious environment.
                </p>
                <p>
                  We are in Education field since last over 60 years and yet growing with youthful zest and vigor, 
                  adding new curricular and co-curricular facets, receiving new accolades and building a fine reputation.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* History Section */}
        <section id="history" className="py-16 md:py-24 bg-gradient-section">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
                  Our Heritage
                </span>
                <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-6">
                  A Legacy Since 1949
                </h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Dunne's Institute was initiated by a French lady - <strong className="text-foreground">Madam C. V. Dunne</strong> in 1949.
                  </p>
                  <p>
                    On 6th April, 1956, it was taken over by three eminent and visionary Parsi sisters, viz., 
                    <strong className="text-foreground"> Mrs. Dhun Jimmy Engineer, Mrs. Mahabanoo Sorab Cooper and Mrs. Pearl Noshir Vevaina</strong> 
                    (daughters of late Mr. Behramgore Anklesaria).
                  </p>
                  <p>
                    At present, the institute is being governed by the <strong className="text-foreground">Board of Trustees</strong> - 
                    Mrs. Armaity Khushrushahi, Mr. Viraf Chiniwala and Mrs. Shavin Chiniwala <strong className="text-foreground">General Secretary </strong> - Mrs. Annamma Thomas
                  </p>
                </div>
              </div>
              <div className="bg-card rounded-xl p-8 shadow-lg border">
                <h3 className="font-heading text-xl font-bold text-foreground mb-6">Current Leadership</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Mrs. Kiran Singh</h4>
                      <p className="text-sm text-muted-foreground">Principal (Noted Educationist)</p>
                      <p className="text-sm text-secondary mt-1">
                    </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                      <Award className="h-6 w-6 text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Mr. Shahbehram Khushrushahi</h4>
                      <p className="text-sm text-muted-foreground">Education Advisor</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mission, Vision, Objectives */}
        <section id="mission" className="py-16 md:py-24 bg-card">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
                Our Purpose
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Mission, Vision & Objectives
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-primary rounded-xl p-8 text-primary-foreground">
                <div className="w-14 h-14 rounded-xl bg-secondary/20 flex items-center justify-center mb-6">
                  <Target className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-primary-foreground/80">
                  "The MISSION of the Institute is to develop an all round academic acumen in a dynamically 
                  changing volatile environment, primarily through a process of education and blend of multifaceted activities."
                </p>
              </div>

              <div className="bg-secondary rounded-xl p-8 text-secondary-foreground">
                <div className="w-14 h-14 rounded-xl bg-secondary-foreground/10 flex items-center justify-center mb-6">
                  <Lightbulb className="h-7 w-7" />
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">Our Vision</h3>
                <p>
                  "To be the premier ICSE Institute in moulding and nurturing students to excel in all 
                  spheres and produce good citizens."
                </p>
              </div>

              <div className="bg-card rounded-xl p-8 border shadow-lg">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <Star className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-heading text-2xl font-bold text-foreground mb-4">Our Objectives</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary mt-2" />
                    <span>To facilitate academic excellence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary mt-2" />
                    <span>To promote harmonious development of a student's personality</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="w-2 h-2 rounded-full bg-secondary mt-2" />
                    <span>To encourage innovation and creativity among the students</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Campuses */}
        <section className="py-16 md:py-24 bg-gradient-section">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="inline-block text-secondary font-semibold text-sm uppercase tracking-wider mb-4">
                Our Locations
              </span>
              <h2 className="font-heading text-3xl md:text-4xl font-bold text-foreground">
                Two Prestigious Campuses
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <div className="bg-card rounded-xl p-8 shadow-lg border">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6">
                  <BookOpen className="h-7 w-7 text-primary" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">Pre-Primary Section</h3>
                <p className="text-sm text-secondary mb-4">Play Group, Nursery, Jr. KG & Sr. KG</p>
                <p className="text-muted-foreground text-sm">
                  4th & 5th Floor, K. R. Cama Oriental Institute Building, Opp. Lion Gate, Near Kala Ghoda, Mumbai - 400023
                </p>
              </div>

              <div className="bg-card rounded-xl p-8 shadow-lg border">
                <div className="w-14 h-14 rounded-xl bg-secondary/10 flex items-center justify-center mb-6">
                  <Users className="h-7 w-7 text-secondary" />
                </div>
                <h3 className="font-heading text-xl font-bold text-foreground mb-2">Primary & Secondary Section</h3>
                <p className="text-sm text-secondary mb-4">Std 1 to Std 10 (ICSE Board)</p>
                <p className="text-muted-foreground text-sm">
                  Nathalal Parekh Marg, Admiralty House Wodehouse Road, Colaba Mumbai-400005
                </p>
              </div>
            </div>

            <div className="mt-12 text-center">
              <div className="inline-flex items-center gap-3 bg-card rounded-full px-6 py-3 shadow-md border">
                <Award className="h-5 w-5 text-secondary" />
                <span className="text-sm font-medium text-foreground">
                  ISO 9001:2000 Standard Certified (JAS-ANZ) since 17.09.2005
                </span>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>;
};
export default About;
