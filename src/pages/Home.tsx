import { Header } from "@/components/layout/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  Users,
  TrendingUp,
  Star,
  ArrowRight,
  CheckCircle,
  MessageCircle,
  FileText,
  User,
} from "lucide-react";
import { Link } from "react-router-dom";

const Home = () => {
  const features = [
    {
      icon: BookOpen,
      title: "Browse Assignments",
      description: "Find academic work that matches your skills and interests",
      link: "/assignments",
    },
    {
      icon: FileText,
      title: "Share Notes",
      description: "Upload and access engineering study materials",
      link: "/notes",
    },
    {
      icon: MessageCircle,
      title: "Connect",
      description: "Communicate directly with students and collaborators",
      link: "/messages",
    },
    {
      icon: User,
      title: "Your Profile",
      description: "Track your progress and manage your academic portfolio",
      link: "/profile",
    },
  ];

  const stats = [
    {
      number: "Growing",
      label: "Student Community",
      icon: Users,
    },
    {
      number: "Secure",
      label: "Payments in ₹",
      icon: TrendingUp,
    },
    {
      number: "Quality",
      label: "Work Delivered",
      icon: Star,
    },
    {
      number: "Verified",
      label: "Students Only",
      icon: CheckCircle,
    },
  ];

  const testimonials = [
    {
      name: "Student A",
      major: "Computer Science",
      text: "Great platform for connecting with fellow students who need help with assignments.",
      rating: 5,
    },
    {
      name: "Student B",
      major: "Mechanical Engineering",
      text: "Easy to find relevant projects that match my skills and academic interests.",
      rating: 5,
    },
    {
      name: "Student C",
      major: "Electrical Engineering",
      text: "The engineering notes section helps me find study materials from other students.",
      rating: 5,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <Header />

      <main>
        {/* Hero Section */}
        <section className="container px-4 py-16 md:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <Badge
              variant="secondary"
              className="mb-4 text-primary bg-primary/10"
            >
              Welcome to StudyHub
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-6xl font-bold text-balance mb-6">
              Connect, Collaborate, and
              <span className="text-primary"> Succeed</span> Together
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
              Join a community where students help students. Post assignments,
              share knowledge, and earn money while building your academic
              portfolio.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/login">
                <Button
                  size="lg"
                  className="flex items-center space-x-2 w-full sm:w-auto"
                >
                  <span>Get Started</span>
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/assignments">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Browse Assignments
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="container px-4 py-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <Icon className="h-8 w-8 text-primary mx-auto mb-2" />
                    <div className="text-3xl font-bold text-primary">
                      {stat.number}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Features Section */}
        <section className="container px-4 py-16">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-base md:text-lg text-muted-foreground max-w-2xl mx-auto">
              Our platform provides all the tools you need to excel in your
              academic journey while helping fellow students.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={index}
                  className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <CardHeader className="text-center">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <Link to={feature.link}>
                      <Button variant="outline" className="w-full">
                        Explore
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* How It Works */}
        <section className="container py-16 bg-gradient-to-r from-primary/5 to-primary/10 rounded-3xl mx-4 md:mx-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">How StudyHub Works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Simple steps to start earning and learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Sign Up & Profile</h3>
              <p className="text-muted-foreground">
                Create your account and showcase your skills and academic
                interests
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Find & Apply</h3>
              <p className="text-muted-foreground">
                Browse assignments that match your expertise and apply to help
                other students
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Earn & Learn</h3>
              <p className="text-muted-foreground">
                Complete work, get paid, and build your academic portfolio
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="container py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">What Students Say</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Real experiences from our community members
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-primary text-primary"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4">
                    "{testimonial.text}"
                  </p>
                  <div>
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.major}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="container py-16 text-center">
          <Card className="p-12 bg-gradient-to-r from-primary/5 to-primary/10">
            <CardContent>
              <h2 className="text-3xl font-bold mb-4">
                Ready to Start Your Academic Journey?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Join thousands of students who are already earning money,
                sharing knowledge, and building their futures together.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/login">
                  <Button size="lg" className="min-w-[200px]">
                    Join StudyHub Today
                  </Button>
                </Link>
                <Link to="/assignments">
                  <Button size="lg" variant="outline" className="min-w-[200px]">
                    Explore Assignments
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Home;
