import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { AssignmentCard } from "@/components/assignment/AssignmentCard";
import { AssignmentFilters } from "@/components/assignment/AssignmentFilters";
import { PostAssignmentModal } from "@/components/assignment/PostAssignmentModal";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { assignmentService, Assignment } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";

const mockAssignments = [
  {
    id: "1",
    title: "Data Structures & Algorithms Assignment",
    description:
      "Implement a binary search tree with insertion, deletion, and traversal methods. Include time complexity analysis and test cases.",
    subject: "Computer Science",
    deadline: "2024-01-20",
    budget: 1500,
    difficulty: "Hard" as const,
    postedBy: "Student A",
    postedAt: "2024-01-10",
    applicants: 2,
  },
  {
    id: "2",
    title: "Marketing Research Report",
    description:
      "Analyze market trends for sustainable products. 2000-word report with references and data visualization required.",
    subject: "Business",
    deadline: "2024-01-18",
    budget: 2000,
    difficulty: "Medium" as const,
    postedBy: "Student B",
    postedAt: "2024-01-09",
    applicants: 1,
  },
  {
    id: "3",
    title: "Chemistry Lab Report",
    description:
      "Complete analysis of organic compound synthesis experiment. Include methodology, results, and discussion sections.",
    subject: "Chemistry",
    deadline: "2024-01-22",
    budget: 750,
    difficulty: "Easy" as const,
    postedBy: "Student C",
    postedAt: "2024-01-11",
    applicants: 0,
  },
];

const subjects = [
  "Computer Science",
  "Business",
  "Chemistry",
  "History",
  "Mathematics",
  "Physics",
  "Literature",
];

const Index = () => {
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 10000]);
  const [difficulty, setDifficulty] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadAssignments();
  }, []);

  const loadAssignments = async () => {
    setLoading(true);
    try {
      const fetchedAssignments = await assignmentService.getAll();
      setAssignments(fetchedAssignments);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load assignments. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter assignments based on current filters
  const filteredAssignments = assignments.filter((assignment) => {
    if (
      selectedSubjects.length > 0 &&
      !selectedSubjects.includes(assignment.subject)
    ) {
      return false;
    }
    if (
      assignment.budget < budgetRange[0] ||
      assignment.budget > budgetRange[1]
    ) {
      return false;
    }
    if (difficulty !== "all" && assignment.difficulty !== difficulty) {
      return false;
    }
    return true;
  });

  // Sort assignments
  const sortedAssignments = [...filteredAssignments].sort((a, b) => {
    switch (sortBy) {
      case "deadline":
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      case "budget-high":
        return b.budget - a.budget;
      case "budget-low":
        return a.budget - b.budget;
      case "newest":
      default:
        return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <Header />

      <main className="container py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-balance mb-4">
            Connect with Students, Complete Assignments
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-balance">
            Find academic assignments that match your skills or post your own
            work for help. Build your portfolio while earning money.
          </p>
          <div className="flex justify-center gap-4">
            <PostAssignmentModal onAssignmentPosted={loadAssignments} />
            <Button size="lg" variant="outline">
              Browse All
            </Button>
          </div>
        </div>

        {/* Platform Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Available Work
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {sortedAssignments.length}
              </div>
              <p className="text-xs text-muted-foreground">
                Current assignments
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Payment Currency
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹ INR</div>
              <p className="text-xs text-muted-foreground">Indian Rupees</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Platform Status
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">Active</div>
              <p className="text-xs text-muted-foreground">Ready for use</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <AssignmentFilters
              subjects={subjects}
              selectedSubjects={selectedSubjects}
              onSubjectChange={setSelectedSubjects}
              budgetRange={budgetRange}
              onBudgetChange={setBudgetRange}
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              sortBy={sortBy}
              onSortChange={setSortBy}
            />
          </div>

          {/* Assignments Grid */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">
                Recent Assignments ({sortedAssignments.length})
              </h2>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="pt-6">
                      <div className="h-6 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-muted rounded w-1/2 mb-4"></div>
                      <div className="h-4 bg-muted rounded w-full mb-2"></div>
                      <div className="h-4 bg-muted rounded w-2/3 mb-4"></div>
                      <div className="h-8 bg-muted rounded w-24"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {sortedAssignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    {...assignment}
                    applicants={assignment.applicants.length}
                  />
                ))}
              </div>
            )}

            {!loading && sortedAssignments.length === 0 && (
              <Card className="p-12 text-center">
                <CardDescription>
                  No assignments match your current filters. Try adjusting your
                  search criteria or post a new assignment.
                </CardDescription>
                <div className="mt-4">
                  <PostAssignmentModal onAssignmentPosted={loadAssignments} />
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
