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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  User,
  Edit,
  Trophy,
  Clock,
  DollarSign,
  BookOpen,
  CheckCircle,
  Star,
  Calendar,
  Target,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Profile = () => {
  const userStats = {
    name: "Your Name",
    email: "your.email@university.edu",
    major: "Your Major",
    year: "Your Year",
    joinDate: "Join Date",
    totalEarnings: 0,
    activeAssignments: 0,
    completedAssignments: 0,
    averageRating: 0,
    successRate: 0,
  };

  const activeAssignments = [
    {
      id: "1",
      title: "Machine Learning Algorithm Implementation",
      subject: "Computer Science",
      deadline: "2024-01-22",
      budget: 300,
      progress: 65,
      status: "In Progress",
      client: "Sarah M.",
    },
    {
      id: "2",
      title: "Database Design Project",
      subject: "Computer Science",
      deadline: "2024-01-25",
      budget: 200,
      progress: 30,
      status: "Just Started",
      client: "John D.",
    },
    {
      id: "3",
      title: "Web Development Portfolio",
      subject: "Computer Science",
      deadline: "2024-01-28",
      budget: 400,
      progress: 80,
      status: "Almost Done",
      client: "Emily R.",
    },
  ];

  const recentEarnings: Array<{
    id: string;
    assignment: string;
    amount: number;
    date: string;
    client: string;
  }> = [];

  const skills = [
    "JavaScript",
    "React",
    "Python",
    "Machine Learning",
    "Database Design",
    "UI/UX Design",
    "Data Analysis",
    "Algorithm Design",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <Header />

      <main className="container py-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder-avatar.jpg" />
                <AvatarFallback className="text-2xl">AJ</AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h1 className="text-3xl font-bold">{userStats.name}</h1>
                    <p className="text-muted-foreground">{userStats.email}</p>
                    <div className="flex items-center space-x-4 mt-2">
                      <Badge variant="secondary">
                        {userStats.major} • {userStats.year}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Member since {userStats.joinDate}
                      </span>
                    </div>
                  </div>
                  <Button className="mt-4 sm:mt-0">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      ₹{userStats.totalEarnings}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Total Earnings
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {userStats.completedAssignments}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Completed
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <span className="text-2xl font-bold text-primary">
                        {userStats.averageRating}
                      </span>
                      <Star className="h-5 w-5 fill-primary text-primary" />
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Avg Rating
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">
                      {userStats.successRate}%
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Success Rate
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
            <TabsTrigger value="skills">Skills</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Trophy className="h-5 w-5" />
                    <span>Academic Progress</span>
                  </CardTitle>
                  <CardDescription>
                    Your academic achievements and milestones
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Profile Completion
                      </span>
                      <span className="text-sm text-muted-foreground">85%</span>
                    </div>
                    <Progress value={85} />
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Skill Verification
                      </span>
                      <span className="text-sm text-muted-foreground">70%</span>
                    </div>
                    <Progress value={70} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Target className="h-5 w-5" />
                    <span>Recent Activity</span>
                  </CardTitle>
                  <CardDescription>
                    Your latest platform interactions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">
                        Completed assignment review
                      </span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        2h ago
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm">Received payment ($250)</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        1d ago
                      </span>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-primary rounded-full"></div>
                      <span className="text-sm">Updated profile skills</span>
                      <span className="text-xs text-muted-foreground ml-auto">
                        3d ago
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Earnings */}
          <TabsContent value="earnings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    This Month
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">₹0</div>
                  <p className="text-xs text-muted-foreground">
                    Start earning today
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Currency
                  </CardTitle>
                  <Target className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">INR</div>
                  <p className="text-xs text-muted-foreground">Indian Rupees</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Earnings
                  </CardTitle>
                  <Trophy className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ₹{userStats.totalEarnings}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Complete work to earn
                  </p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Recent Payments</CardTitle>
                <CardDescription>
                  Your completed assignments and earnings will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {recentEarnings.length > 0 ? (
                  <div className="space-y-4">
                    {recentEarnings.map((earning) => (
                      <div
                        key={earning.id}
                        className="flex items-center justify-between py-2"
                      >
                        <div>
                          <p className="font-medium">{earning.assignment}</p>
                          <p className="text-sm text-muted-foreground">
                            Client: {earning.client} • {earning.date}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-success">
                            +₹{earning.amount}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No payments yet. Complete assignments to start earning!
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Skills */}
          <TabsContent value="skills" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Your Skills</span>
                </CardTitle>
                <CardDescription>
                  Skills and subjects you're proficient in
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-medium mb-3">Technical Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button className="w-full" variant="outline">
                      <BookOpen className="h-4 w-4 mr-2" />
                      Add New Skill
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;
