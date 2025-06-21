import { Header } from "@/components/layout/Header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  Clock,
  AlertCircle,
  Lightbulb,
  Rocket,
  Target,
  Users,
  Smartphone,
  Video,
  Brain,
  Building,
  Shield,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const Roadmap = () => {
  const phases = [
    {
      phase: "Phase 1: Foundation",
      status: "completed",
      progress: 100,
      timeline: "Q4 2024",
      description: "Core platform functionality and user authentication",
      features: [
        {
          name: "User Authentication & Profiles",
          status: "completed",
          icon: CheckCircle,
        },
        {
          name: "Assignment Posting & Management",
          status: "completed",
          icon: CheckCircle,
        },
        {
          name: "Notes Upload & Sharing",
          status: "completed",
          icon: CheckCircle,
        },
        {
          name: "Basic Messaging System",
          status: "completed",
          icon: CheckCircle,
        },
        {
          name: "Engineering Category Organization",
          status: "completed",
          icon: CheckCircle,
        },
        { name: "Responsive Design", status: "completed", icon: CheckCircle },
      ],
    },
    {
      phase: "Phase 2: Enhanced Features",
      status: "in-progress",
      progress: 60,
      timeline: "Q1 2025",
      description: "Advanced functionality and user experience improvements",
      features: [
        {
          name: "Real-time Notifications",
          status: "completed",
          icon: CheckCircle,
        },
        {
          name: "Advanced Search & Filtering",
          status: "completed",
          icon: CheckCircle,
        },
        {
          name: "File Upload & Storage (Supabase)",
          status: "in-progress",
          icon: Clock,
        },
        { name: "Payment Integration", status: "planning", icon: AlertCircle },
        {
          name: "Rating & Review System",
          status: "planning",
          icon: AlertCircle,
        },
        { name: "Email Notifications", status: "planning", icon: AlertCircle },
      ],
    },
    {
      phase: "Phase 3: Community Features",
      status: "planning",
      progress: 0,
      timeline: "Q2 2025",
      description:
        "Building a strong student community and collaboration tools",
      features: [
        { name: "Study Groups Creation", status: "planning", icon: Users },
        { name: "Discussion Forums", status: "planning", icon: Users },
        { name: "Mentorship Matching", status: "planning", icon: Users },
        { name: "Event Calendar", status: "planning", icon: Users },
        { name: "Achievement System", status: "planning", icon: Target },
        { name: "Leaderboards", status: "planning", icon: Target },
      ],
    },
    {
      phase: "Phase 4: Advanced Technology",
      status: "future",
      progress: 0,
      timeline: "Q3-Q4 2025",
      description: "Cutting-edge features and platform expansion",
      features: [
        {
          name: "Mobile App (iOS/Android)",
          status: "future",
          icon: Smartphone,
        },
        { name: "Video Tutoring Integration", status: "future", icon: Video },
        { name: "AI Study Assistant", status: "future", icon: Brain },
        { name: "University Partnerships", status: "future", icon: Building },
        { name: "Advanced Analytics", status: "future", icon: Zap },
        {
          name: "API for Third-party Integration",
          status: "future",
          icon: Zap,
        },
      ],
    },
  ];

  const criticalTasks = [
    {
      title: "Database Migration to Supabase",
      priority: "Critical",
      assignee: "Backend Team",
      deadline: "January 2025",
      description:
        "Complete migration from mock data to Supabase with all security policies",
      status: "in-progress",
    },
    {
      title: "Payment Gateway Integration",
      priority: "High",
      assignee: "Full-stack Team",
      deadline: "February 2025",
      description: "Implement secure payment processing for assignments",
      status: "planning",
    },
    {
      title: "File Upload Security",
      priority: "Critical",
      assignee: "Security Team",
      deadline: "January 2025",
      description:
        "Ensure secure file uploads with virus scanning and size limits",
      status: "in-progress",
    },
    {
      title: "Mobile Responsiveness Audit",
      priority: "Medium",
      assignee: "Frontend Team",
      deadline: "January 2025",
      description: "Complete mobile experience optimization across all devices",
      status: "planning",
    },
  ];

  const technicalDebt = [
    {
      item: "Replace mock authentication with Supabase Auth",
      impact: "Security & Scalability",
      effort: "High",
    },
    {
      item: "Implement proper error boundaries",
      impact: "User Experience",
      effort: "Medium",
    },
    {
      item: "Add comprehensive unit tests",
      impact: "Code Quality",
      effort: "High",
    },
    {
      item: "Optimize bundle size and performance",
      impact: "Performance",
      effort: "Medium",
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500/10 text-green-600 border-green-200";
      case "in-progress":
        return "bg-blue-500/10 text-blue-600 border-blue-200";
      case "planning":
        return "bg-yellow-500/10 text-yellow-600 border-yellow-200";
      case "future":
        return "bg-gray-500/10 text-gray-600 border-gray-200";
      default:
        return "bg-gray-500/10 text-gray-600 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return CheckCircle;
      case "in-progress":
        return Clock;
      case "planning":
        return AlertCircle;
      case "future":
        return Lightbulb;
      default:
        return AlertCircle;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <Header />

      <main className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <Badge variant="secondary" className="mb-4">
            <Rocket className="h-3 w-3 mr-1" />
            Development Roadmap
          </Badge>
          <h1 className="text-4xl font-bold mb-4">
            StudyHub Development Roadmap
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Our transparent development plan for building the ultimate student
            collaboration platform. Track our progress and see what's coming
            next.
          </p>
        </div>

        {/* Development Phases */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Development Phases</h2>
          <div className="space-y-8">
            {phases.map((phase, index) => {
              const StatusIcon = getStatusIcon(phase.status);
              return (
                <Card key={index} className="overflow-hidden">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <StatusIcon className="h-5 w-5" />
                          <span>{phase.phase}</span>
                        </CardTitle>
                        <CardDescription>{phase.description}</CardDescription>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(phase.status)}>
                          {phase.status.replace("-", " ")}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {phase.timeline}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span>Progress</span>
                        <span>{phase.progress}%</span>
                      </div>
                      <Progress value={phase.progress} className="h-2" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {phase.features.map((feature, featureIndex) => {
                        const FeatureIcon = feature.icon;
                        return (
                          <div
                            key={featureIndex}
                            className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50"
                          >
                            <FeatureIcon
                              className={`h-4 w-4 ${
                                feature.status === "completed"
                                  ? "text-green-600"
                                  : feature.status === "in-progress"
                                    ? "text-blue-600"
                                    : feature.status === "planning"
                                      ? "text-yellow-600"
                                      : "text-gray-600"
                              }`}
                            />
                            <span className="text-sm">{feature.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Critical Tasks */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">
            Critical Tasks & Priorities
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {criticalTasks.map((task, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{task.title}</CardTitle>
                    <Badge
                      variant={
                        task.priority === "Critical"
                          ? "destructive"
                          : task.priority === "High"
                            ? "default"
                            : "secondary"
                      }
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <CardDescription>{task.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Assignee:</span>
                      <span>{task.assignee}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Deadline:</span>
                      <span>{task.deadline}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge
                        variant="outline"
                        className={getStatusColor(task.status)}
                      >
                        {task.status.replace("-", " ")}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Technical Debt */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">
            Technical Debt & Improvements
          </h2>
          <Card>
            <CardHeader>
              <CardTitle>Areas for Improvement</CardTitle>
              <CardDescription>
                Technical debt items that need to be addressed for long-term
                maintainability
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {technicalDebt.map((debt, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div>
                      <h4 className="font-medium">{debt.item}</h4>
                      <p className="text-sm text-muted-foreground">
                        Impact: {debt.impact}
                      </p>
                    </div>
                    <Badge variant="outline">{debt.effort} Effort</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* How to Contribute */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-4">
                Want to Contribute?
              </CardTitle>
              <CardDescription className="text-lg max-w-2xl mx-auto">
                Help us build the future of student collaboration. Every
                contribution matters, from code to feedback to spreading the
                word.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button asChild>
                  <Link to="/contributors">
                    <Users className="h-4 w-4 mr-2" />
                    Join Contributors
                  </Link>
                </Button>
                <Button variant="outline" asChild>
                  <a
                    href="https://github.com/studyhub"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View on GitHub
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Current Focus */}
        <section>
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">
                Current Focus: Production Readiness
              </CardTitle>
              <CardDescription>
                Our immediate priority is making StudyHub production-ready with
                real database integration
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Shield className="h-4 w-4 mr-2" />
                    Security & Authentication
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Supabase authentication integration</li>
                    <li>• Row-level security policies</li>
                    <li>• File upload security</li>
                    <li>• Input validation & sanitization</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3 flex items-center">
                    <Zap className="h-4 w-4 mr-2" />
                    Performance & Scalability
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Database optimization</li>
                    <li>• Image compression & CDN</li>
                    <li>• Bundle size optimization</li>
                    <li>• Real-time features</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
};

export default Roadmap;
