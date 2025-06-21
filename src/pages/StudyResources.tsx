import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Navigation from "@/components/Navigation";
import DemoModeBanner from "@/components/DemoModeBanner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase, StudyResource, isDemoMode } from "@/lib/supabase";
import {
  BookOpen,
  FileText,
  Video,
  Download,
  Upload,
  Search,
  Star,
  Eye,
  Filter,
  Plus,
  CheckCircle,
} from "lucide-react";

const StudyResources = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [resources, setResources] = useState<StudyResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const categories = [
    { id: "all", name: "All Resources", icon: BookOpen },
    { id: "notes", name: "Study Notes", icon: FileText },
    { id: "papers", name: "Previous Papers", icon: BookOpen },
    { id: "videos", name: "Video Lectures", icon: Video },
    { id: "books", name: "Reference Books", icon: BookOpen },
  ];

  const courses = [
    { id: "all", name: "All Courses" },
    { id: "B.Tech", name: "B.Tech" },
    { id: "B.Tech CSE", name: "B.Tech CSE" },
    { id: "MBA", name: "MBA" },
    { id: "B.Com", name: "B.Com" },
    { id: "B.Sc", name: "B.Sc" },
  ];

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    if (isDemoMode) {
      setResources([]);
      setLoading(false);
      return;
    }

    setError(null);
    try {
      const { data, error } = await supabase!
        .from("study_resources")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase error:", error);
        setError(`Database error: ${error.message}`);
        throw error;
      }
      setResources(data || []);
    } catch (error: any) {
      console.error("Error fetching resources:", error);
      setError(error.message);
      setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) =>
        tag.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesCategory =
      selectedCategory === "all" || resource.category === selectedCategory;

    const matchesCourse =
      selectedCourse === "all" ||
      resource.course.toLowerCase().includes(selectedCourse.toLowerCase());

    return matchesSearch && matchesCategory && matchesCourse;
  });

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "notes":
        return "bg-student-blue-50 text-student-blue-600";
      case "papers":
        return "bg-student-green-50 text-student-green-600";
      case "videos":
        return "bg-student-orange-50 text-student-orange-600";
      case "books":
        return "bg-student-beige-50 text-student-beige-600";
      default:
        return "bg-gray-50 text-gray-600";
    }
  };

  const handleDownload = (resourceId: string) => {
    if (!user) {
      alert("Please login to download resources");
      return;
    }
    alert(`Download functionality coming soon! Resource ID: ${resourceId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-background">
      <Navigation />

      {/* Header */}
      <section className="bg-background/60 border-b border-border/40">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              Study <span className="text-gradient">Resources</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Access and share study materials, notes, and resources with your
              fellow students. Learn together, grow together.
            </p>
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
                Make sure you've run the complete database setup script.
              </span>
            </AlertDescription>
          </Alert>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="lg:w-80 space-y-6">
            <Card className="border-0 shadow-student">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Find Resources</CardTitle>
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
                      placeholder="Search resources..."
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

                {/* Course Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Course
                  </label>
                  <Select
                    value={selectedCourse}
                    onValueChange={setSelectedCourse}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {courses.map((course) => (
                        <SelectItem key={course.id} value={course.id}>
                          {course.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Quick Stats */}
                <div className="pt-4 border-t border-border/40">
                  <h4 className="font-medium mb-3">Resource Stats</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Resources
                      </span>
                      <span className="font-medium">{resources.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Verified</span>
                      <span className="font-medium text-student-green-600">
                        {resources.filter((r) => r.verified).length}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">
                        Total Downloads
                      </span>
                      <span className="font-medium">
                        {resources.reduce(
                          (sum, r) => sum + r.download_count,
                          0,
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upload Section */}
            <Card className="border-0 shadow-student bg-gradient-primary text-white">
              <CardContent className="pt-6">
                <Upload className="w-8 h-8 mb-4" />
                <h3 className="font-semibold mb-2">Share Your Resources</h3>
                <p className="text-sm opacity-90 mb-4">
                  Help fellow students by uploading your notes and materials.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() =>
                    user
                      ? alert("Upload functionality coming soon!")
                      : alert("Please login to upload resources")
                  }
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Upload Resource
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            <Tabs defaultValue="browse" className="space-y-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="browse">Browse Resources</TabsTrigger>
                <TabsTrigger value="my-uploads">My Uploads</TabsTrigger>
              </TabsList>

              <TabsContent value="browse" className="space-y-6">
                {/* Results Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-semibold">
                      {filteredResources.length} resources found
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Sorted by popularity and rating
                    </p>
                  </div>

                  <Button variant="outline" size="sm">
                    <Filter className="w-4 h-4 mr-2" />
                    Sort by
                  </Button>
                </div>

                {/* Resource Cards */}
                <div className="space-y-6">
                  {loading ? (
                    <div className="text-center py-8">
                      <div className="text-lg">Loading resources...</div>
                    </div>
                  ) : (
                    filteredResources.map((resource) => (
                      <Card
                        key={resource.id}
                        className="border-0 shadow-student hover:shadow-student-lg transition-all duration-300 bg-card/80 backdrop-blur"
                      >
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge
                                  className={`text-xs ${getCategoryColor(resource.category)}`}
                                >
                                  {
                                    categories.find(
                                      (c) => c.id === resource.category,
                                    )?.name
                                  }
                                </Badge>
                                <Badge variant="outline" className="text-xs">
                                  {resource.course}
                                </Badge>
                                {resource.semester && (
                                  <Badge variant="outline" className="text-xs">
                                    {resource.semester}
                                  </Badge>
                                )}
                                {resource.verified && (
                                  <Badge className="text-xs bg-student-green-100 text-student-green-700">
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Verified
                                  </Badge>
                                )}
                              </div>
                              <CardTitle className="text-xl mb-2">
                                {resource.title}
                              </CardTitle>
                              <CardDescription className="text-base leading-relaxed">
                                {resource.description}
                              </CardDescription>
                            </div>
                          </div>
                        </CardHeader>

                        <CardContent className="space-y-4">
                          {/* Subject and Tags */}
                          <div>
                            <div className="text-sm font-medium text-muted-foreground mb-2">
                              Subject: {resource.subject}
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {resource.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Resource Stats */}
                          <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="flex items-center gap-2">
                              <Download className="w-4 h-4 text-student-blue-600" />
                              <span>{resource.download_count} downloads</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Star className="w-4 h-4 text-student-orange-500 fill-current" />
                              <span>{resource.rating} rating</span>
                            </div>
                            {resource.file_size && (
                              <div className="flex items-center gap-2">
                                <FileText className="w-4 h-4 text-student-green-600" />
                                <span>{resource.file_size}</span>
                              </div>
                            )}
                          </div>

                          {/* Uploader Info & Actions */}
                          <div className="flex items-center justify-between pt-4 border-t border-border/40">
                            <div className="flex items-center gap-3">
                              <Avatar className="w-8 h-8">
                                <AvatarFallback>
                                  {resource.uploader_name[0]}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-sm">
                                  {resource.uploader_name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {resource.uploader_course || "Student"}
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4 mr-2" />
                                Preview
                              </Button>
                              <Button
                                size="sm"
                                className="btn-primary"
                                onClick={() => handleDownload(resource.id)}
                              >
                                <Download className="w-4 h-4 mr-2" />
                                Download
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>

                {/* Empty State */}
                {!loading && filteredResources.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                      <BookOpen className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">
                      No resources found
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      {isDemoMode
                        ? "Configure Supabase to see real resources"
                        : "Try adjusting your filters or be the first to upload!"}
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSearchQuery("");
                        setSelectedCategory("all");
                        setSelectedCourse("all");
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </TabsContent>

              <TabsContent value="my-uploads">
                <div className="text-center py-12">
                  <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No uploads yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start sharing your study materials with fellow students
                  </p>
                  <Button>Upload Resource</Button>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyResources;
