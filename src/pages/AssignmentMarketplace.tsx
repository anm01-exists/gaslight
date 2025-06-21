import { useState, useEffect } from "react";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Navigation from "@/components/Navigation";
import PostAssignmentModal from "@/components/PostAssignmentModal";
import DemoModeBanner from "@/components/DemoModeBanner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, Assignment, isDemoMode } from "@/lib/supabase";
import { demoService } from "@/lib/demoData";
import MessageService from "@/lib/messageService";
import {
  Clock,
  DollarSign,
  FileText,
  Filter,
  Plus,
  Search,
  Star,
  BookOpen,
  Calculator,
  Code,
  Beaker,
  Globe,
  PenTool,
  Users,
  Zap,
  MessageSquare,
  Calendar,
  ArrowRight,
} from "lucide-react";

const AssignmentMarketplace = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedBudget, setSelectedBudget] = useState("all");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showPostModal, setShowPostModal] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const categories = [
    { id: "all", name: "All Categories", icon: BookOpen },
    { id: "programming", name: "Programming", icon: Code },
    { id: "mathematics", name: "Mathematics", icon: Calculator },
    { id: "science", name: "Science", icon: Beaker },
    { id: "literature", name: "Literature", icon: PenTool },
    { id: "business", name: "Business", icon: Users },
    { id: "engineering", name: "Engineering", icon: Zap },
    { id: "languages", name: "Languages", icon: Globe },
  ];

  // Fetch assignments from database
  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    setError(null);
    try {
      if (isDemoMode) {
        const { data, error } = await demoService.getAssignments();
        if (error) throw error;
        setAssignments(data || []);
      } else {
        const { data, error } = await supabase!
          .from("assignments")
          .select("*")
          .order("created_at", { ascending: false });

        if (error) {
          console.error("Supabase error details:", error);
          console.error("Error message:", error.message);
          console.error("Error code:", error.code);
          setError(`Database error: ${error.message}`);
          throw error;
        }
        setAssignments(data || []);
      }
    } catch (error: any) {
      console.error("Error fetching assignments:", error);
      console.error("Error message:", error?.message);
      console.error("Error details:", JSON.stringify(error, null, 2));

      if (!error.message) {
        setError(
          "Failed to connect to database. Please check if tables are set up correctly.",
        );
      } else {
        setError(error.message);
      }
      setAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200";
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "low":
        return "bg-green-100 text-green-700 border-green-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesSearch =
      assignment.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      assignment.description
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      assignment.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "all" || assignment.category === selectedCategory;

    const matchesBudget =
      selectedBudget === "all" ||
      (selectedBudget === "low" && assignment.budget < 1000) ||
      (selectedBudget === "medium" &&
        assignment.budget >= 1000 &&
        assignment.budget < 2000) ||
      (selectedBudget === "high" && assignment.budget >= 2000);

    return matchesSearch && matchesCategory && matchesBudget;
  });

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />

      {/* Header Section */}
      <section className="bg-background/60 border-b border-border/40">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">
                Assignment <span className="text-gradient">Marketplace</span>
              </h1>
              <p className="text-lg text-muted-foreground">
                Find help with your assignments or offer your expertise to earn
                money
              </p>
            </div>

            <Button
              size="lg"
              className="btn-primary lg:w-auto"
              onClick={() => {
                if (user) {
                  setShowPostModal(true);
                } else {
                  alert("Please login to post assignments");
                }
              }}
            >
              <Plus className="w-5 h-5 mr-2" />
              Post Assignment
            </Button>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        <DemoModeBanner />

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>
              <strong>Error:</strong> {error}
              <br />
              <span className="text-sm mt-2 block">
                Make sure you've run the SQL setup script in your Supabase
                dashboard.
                <a
                  href="https://supabase.com/dashboard/project/nvbabmklzfxpuguifhuq/sql"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline ml-1"
                >
                  Go to SQL Editor
                </a>
              </span>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 space-y-6">
            <Card className="border-0 shadow-student">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Filters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Search
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search assignments..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                {/* Category Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Category
                  </label>
                  <Select
                    value={selectedCategory}
                    onValueChange={setSelectedCategory}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => {
                        const Icon = category.icon;
                        return (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center">
                              <Icon className="w-4 h-4 mr-2" />
                              {category.name}
                            </div>
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>

                {/* Budget Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Budget Range
                  </label>
                  <Select
                    value={selectedBudget}
                    onValueChange={setSelectedBudget}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Budgets</SelectItem>
                      <SelectItem value="low">Under ₹1,000</SelectItem>
                      <SelectItem value="medium">₹1,000 - ₹2,000</SelectItem>
                      <SelectItem value="high">Above ₹2,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Quick Stats */}
                <div className="pt-4 border-t border-border/40">
                  <h4 className="font-medium mb-3">Quick Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Assignments
                      </span>
                      <span className="font-medium">{assignments.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Budget Range
                      </span>
                      <span className="font-medium">₹800 - ₹3,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Platform Status
                      </span>
                      <span className="font-medium text-student-green-600">
                        Demo Mode
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue="browse" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="browse">Browse Assignments</TabsTrigger>
                <TabsTrigger value="my-proposals">My Proposals</TabsTrigger>
              </TabsList>

              <TabsContent value="browse" className="space-y-6">
                {/* Results Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {filteredAssignments.length} assignments found
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Sorted by relevance and deadline
                    </p>
                  </div>

                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Sort by
                  </Button>
                </div>

                {/* Assignment Cards */}
                <div className="space-y-6">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="text-lg">Loading assignments...</div>
                    </div>
                  ) : (
                    filteredAssignments.map((assignment) => (
                      <Card
                        key={assignment.id}
                        className="border-0 shadow-student hover:shadow-student-lg transition-all duration-300 bg-card/80 backdrop-blur"
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className="text-xs">
                                  {
                                    categories.find(
                                      (c) => c.id === assignment.category,
                                    )?.name
                                  }
                                </Badge>
                                <Badge
                                  className={`text-xs border ${getUrgencyColor(assignment.urgency)}`}
                                >
                                  {assignment.urgency} priority
                                </Badge>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(
                                    assignment.created_at,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                              <CardTitle className="text-xl mb-2 hover:text-primary cursor-pointer transition-colors">
                                {assignment.title}
                              </CardTitle>
                              <CardDescription className="text-base leading-relaxed">
                                {assignment.description}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Tags */}
                          <div className="flex flex-wrap gap-2">
                            {assignment.tags.map((tag, index) => (
                              <Badge
                                key={index}
                                variant="outline"
                                className="text-xs"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>

                          {/* Assignment Details */}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <DollarSign className="w-4 h-4 text-student-green-600" />
                              <span className="font-medium">
                                ₹{assignment.budget.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-student-blue-600" />
                              <span>
                                {new Date(
                                  assignment.deadline,
                                ).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-student-orange-600" />
                              <span>
                                {assignment.proposals_count || 0} proposals
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <FileText className="w-4 h-4 text-muted-foreground" />
                              <span>{assignment.attachments || 0} files</span>
                            </div>
                          </div>

                          {/* Student Info & Actions */}
                          <div className="flex items-center justify-between pt-4 border-t border-border/40">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>
                                  {assignment.student_name?.[0] || "S"}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">
                                  {assignment.student_name || "Student"}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Star className="w-3 h-3 fill-student-orange-400 text-student-orange-400" />
                                  <span className="text-xs text-muted-foreground">
                                    {assignment.student_rating || "New"} •{" "}
                                    {assignment.student_course || "Student"}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={async () => {
                                  if (!user) {
                                    alert("Please login to send messages");
                                    return;
                                  }

                                  const message = `Hi! I'm interested in helping with your assignment: "${assignment.title}". I'd like to discuss the requirements and my approach.`;

                                  try {
                                    await MessageService.startAssignmentConversation(
                                      user.id,
                                      assignment.user_id,
                                      assignment.id,
                                      message,
                                    );

                                    alert(
                                      "Message sent! Check your messages to continue the conversation.",
                                    );
                                  } catch (error) {
                                    console.error(
                                      "Error sending message:",
                                      error,
                                    );
                                    alert(
                                      "Failed to send message. Please try again.",
                                    );
                                  }
                                }}
                              >
                                <MessageSquare className="w-4 h-4 mr-2" />
                                Message
                              </Button>
                              <Button
                                size="sm"
                                className="btn-primary"
                                onClick={() =>
                                  alert(
                                    "Proposal submission feature coming soon!",
                                  )
                                }
                              >
                                Submit Proposal
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

                {/* Load More */}
                {filteredAssignments.length > 0 && (
                  <div className="text-center pt-8">
                    <Button variant="outline" size="lg">
                      Load More Assignments
                    </Button>
                  </div>
                )}

                {/* Empty State */}
                {filteredAssignments.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <Search className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No assignments found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Try adjusting your filters or search terms
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                        setSelectedBudget("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="my-proposals">
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">
                    No proposals yet
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    Start applying to assignments to see your proposals here
                  </p>
                  <Button>Browse Assignments</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <PostAssignmentModal
        open={showPostModal}
        onOpenChange={setShowPostModal}
        onSuccess={fetchAssignments}
      />
    </div>
  );
};

export default AssignmentMarketplace;
