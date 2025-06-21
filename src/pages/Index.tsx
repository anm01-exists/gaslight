import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/Navigation";
import {
  GraduationCap,
  BookOpen,
  Briefcase,
  MessageSquare,
  Star,
  Users,
  Clock,
  ArrowRight,
  CheckCircle,
  TrendingUp,
  Shield,
  Zap,
} from "lucide-react";

const Index = () => {
  const features = [
    {
      icon: GraduationCap,
      title: "Assignment Exchange",
      description:
        "Post assignments you need help with or offer your expertise to earn money. Connect with talented students and tutors.",
      color: "bg-student-blue-50 text-student-blue-600",
      href: "/assignments",
      stats: "Assignment marketplace",
    },
    {
      icon: Briefcase,
      title: "Home & Hostel Services",
      description:
        "Find reliable service providers for plumbing, electricals, cleaning, and more. Rated by fellow students.",
      color: "bg-student-green-50 text-student-green-600",
      href: "/services",
      stats: "Coming soon",
    },
    {
      icon: BookOpen,
      title: "Study Resources",
      description:
        "Share and access study materials, notes, and resources organized by course, semester, and subject.",
      color: "bg-student-orange-50 text-student-orange-600",
      href: "/resources",
      stats: "Coming soon",
    },
  ];

  const stats = [
    { label: "Active Students", value: "Growing", icon: Users },
    { label: "Platform Features", value: "4+", icon: CheckCircle },
    { label: "Service Categories", value: "3+", icon: TrendingUp },
    { label: "Response Goal", value: "< 2 hours", icon: Clock },
  ];

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 pt-16 pb-24">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm">
              🎓 Student-focused platform
            </Badge>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Your Campus <span className="text-gradient">Marketplace</span>
              <br />
              for Everything
            </h1>

            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
              From assignment help to hostel services, from study resources to
              earning opportunities. StudyHub is your one-stop platform for
              student life.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link to="/assignments">
                <Button size="lg" className="btn-primary text-lg px-8 py-4">
                  <GraduationCap className="w-5 h-5 mr-2" />
                  Browse Assignments
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="text-lg px-8 py-4">
                <MessageSquare className="w-5 h-5 mr-2" />
                Learn More
              </Button>
            </div>

            {/* Stats Bar */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <Icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                    <div className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {stat.label}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-background/60">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for{" "}
              <span className="text-gradient">Student Life</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From academic support to daily services, we've got you covered
              with a platform designed by students, for students.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="card-hover border-0 shadow-student bg-card/80 backdrop-blur"
                >
                  <CardHeader className="pb-4">
                    <div
                      className={`w-12 h-12 rounded-xl ${feature.color} flex items-center justify-center mb-4`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <Badge variant="secondary" className="w-fit text-xs">
                      {feature.stats}
                    </Badge>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <CardDescription className="text-base mb-6 leading-relaxed">
                      {feature.description}
                    </CardDescription>
                    <Link to={feature.href}>
                      <Button variant="outline" className="w-full group">
                        Explore
                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust & Safety Section */}
      <section className="py-16 bg-card/40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-6">
              Safe, Secure, and Student-Friendly
            </h3>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <Shield className="w-8 h-8 mx-auto mb-3 text-student-green-600" />
                <h4 className="font-semibold mb-2">Verified Profiles</h4>
                <p className="text-sm text-muted-foreground">
                  All users verified with college ID and phone number
                </p>
              </div>
              <div className="text-center">
                <Zap className="w-8 h-8 mx-auto mb-3 text-student-blue-600" />
                <h4 className="font-semibold mb-2">Instant Payments</h4>
                <p className="text-sm text-muted-foreground">
                  Secure payment gateway with instant settlements
                </p>
              </div>
              <div className="text-center">
                <MessageSquare className="w-8 h-8 mx-auto mb-3 text-student-orange-600" />
                <h4 className="font-semibold mb-2">24/7 Support</h4>
                <p className="text-sm text-muted-foreground">
                  Student support team available round the clock
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Get Started?
          </h3>
          <p className="text-xl opacity-90 mb-8 max-w-2xl mx-auto">
            Join our growing student community and start exploring opportunities
            to learn and help each other.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/assignments">
              <Button
                size="lg"
                variant="secondary"
                className="text-lg px-8 py-4"
              >
                Start Browsing
              </Button>
            </Link>
            <Link to="/assignments">
              <Button
                size="lg"
                variant="outline"
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary"
              >
                Post Assignment
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border/40 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-student-beige-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">StudyHub</span>
              </div>
              <p className="text-muted-foreground text-sm">
                Empowering students with opportunities to learn, earn, and grow
                together.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Platform</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link to="/assignments" className="hover:text-foreground">
                    Assignments
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-foreground">
                    Services
                  </Link>
                </li>
                <li>
                  <Link to="/resources" className="hover:text-foreground">
                    Resources
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-foreground">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Help Center
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Safety Guide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    FAQs
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#" className="hover:text-foreground">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-foreground">
                    Cookie Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 StudyHub. Made with ❤️ for students, by students.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
