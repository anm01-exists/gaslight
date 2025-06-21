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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Github,
  Heart,
  Code,
  Lightbulb,
  Users,
  Star,
  ExternalLink,
  GitBranch,
  Coffee,
} from "lucide-react";
import { Link } from "react-router-dom";

const Contributors = () => {
  const coreTeam = [
    {
      name: "Development Team",
      role: "Platform Creators",
      description: "Building StudyHub for students, by students",
      avatar: "DT",
      contributions: ["Architecture", "Frontend", "Backend", "Design"],
      github: "https://github.com/studyhub",
    },
  ];

  const contributionTypes = [
    {
      icon: Code,
      title: "Code Contributors",
      description:
        "Developers who contribute features, bug fixes, and improvements",
      count: "Open to all",
      color: "bg-blue-500/10 text-blue-600",
    },
    {
      icon: Lightbulb,
      title: "Feature Designers",
      description:
        "UX/UI designers and product managers who shape user experience",
      count: "Join us",
      color: "bg-purple-500/10 text-purple-600",
    },
    {
      icon: Users,
      title: "Community Managers",
      description: "Students who help moderate and grow our community",
      count: "Volunteer",
      color: "bg-green-500/10 text-green-600",
    },
    {
      icon: Coffee,
      title: "Beta Testers",
      description:
        "Early users who test features and provide valuable feedback",
      count: "Active",
      color: "bg-orange-500/10 text-orange-600",
    },
  ];

  const upcomingFeatures = [
    {
      title: "Mobile App",
      description: "Native iOS and Android applications",
      status: "Planning",
      priority: "High",
    },
    {
      title: "Video Tutoring",
      description: "Integrated video calling for live help sessions",
      status: "Research",
      priority: "Medium",
    },
    {
      title: "AI Study Assistant",
      description: "Smart recommendations and study planning",
      status: "Concept",
      priority: "High",
    },
    {
      title: "University Integration",
      description: "Official partnerships with educational institutions",
      status: "Planning",
      priority: "Medium",
    },
  ];

  const howToContribute = [
    {
      step: "1",
      title: "Join Our Community",
      description:
        "Start by exploring the platform and understanding our mission",
    },
    {
      step: "2",
      title: "Find Your Area",
      description:
        "Choose whether you want to contribute code, design, content, or community management",
    },
    {
      step: "3",
      title: "Get Involved",
      description: "Pick up tasks from our roadmap or suggest new features",
    },
    {
      step: "4",
      title: "Make Impact",
      description: "Help build the future of student collaboration",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />

      <main className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Heart className="h-3 w-3 mr-1" />
            Built by Students, For Students
          </Badge>
          <h1 className="text-4xl font-bold mb-4">Contributors & Community</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            StudyHub is an open-source project powered by passionate students
            who believe in collaborative learning and helping each other
            succeed.
          </p>
        </div>

        {/* Core Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Core Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreTeam.map((member, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <Avatar className="w-16 h-16 mx-auto mb-4">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback className="text-lg">
                      {member.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <CardTitle>{member.name}</CardTitle>
                  <CardDescription>{member.role}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    {member.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-4 justify-center">
                    {member.contributions.map((contribution) => (
                      <Badge
                        key={contribution}
                        variant="outline"
                        className="text-xs"
                      >
                        {contribution}
                      </Badge>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Github className="h-4 w-4 mr-2" />
                      GitHub
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Contribution Types */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Ways to Contribute
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {contributionTypes.map((type, index) => {
              const Icon = type.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${type.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{type.title}</CardTitle>
                        <Badge variant="secondary">{type.count}</Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{type.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* How to Contribute */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            How to Get Started
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {howToContribute.map((item, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                    {item.step}
                  </div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {item.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Upcoming Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Roadmap & Upcoming Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingFeatures.map((feature, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                    <div className="flex space-x-2">
                      <Badge
                        variant={
                          feature.priority === "High" ? "default" : "secondary"
                        }
                      >
                        {feature.priority}
                      </Badge>
                      <Badge variant="outline">{feature.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Open Source Info */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-4">
                Open Source & Transparent
              </CardTitle>
              <CardDescription className="text-lg max-w-2xl mx-auto">
                StudyHub is built in the open. Every feature, bug fix, and
                improvement is developed transparently with the community.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="text-center">
                  <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold">Star on GitHub</h4>
                  <p className="text-sm text-muted-foreground">
                    Show your support
                  </p>
                </div>
                <div className="text-center">
                  <GitBranch className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold">Fork & Contribute</h4>
                  <p className="text-sm text-muted-foreground">
                    Submit pull requests
                  </p>
                </div>
                <div className="text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold">Join Discussions</h4>
                  <p className="text-sm text-muted-foreground">
                    Share ideas & feedback
                  </p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <a
                    href="https://github.com/studyhub"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Github className="h-4 w-4 mr-2" />
                    View on GitHub
                  </a>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/roadmap">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    See Full Roadmap
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Call to Action */}
        <section className="text-center">
          <Card className="p-12">
            <CardContent>
              <h2 className="text-3xl font-bold mb-4">Ready to Contribute?</h2>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Whether you're a developer, designer, or just passionate about
                education, there's a place for you in the StudyHub community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" asChild>
                  <a href="mailto:contribute@studyhub.com">
                    <Heart className="h-5 w-5 mr-2" />
                    Get Involved
                  </a>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/login">Join StudyHub</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Contributors;
