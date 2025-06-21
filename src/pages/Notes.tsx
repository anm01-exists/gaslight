import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { AuthGuard } from "@/components/auth/AuthGuard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UploadNoteModal } from "@/components/notes/UploadNoteModal";
import {
  FileText,
  Search,
  Filter,
  BookOpen,
  Wrench,
  Zap,
  Cpu,
  Download,
  Calendar,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { notesService, Note } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Notes = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const engineeringCategories = [
    {
      id: "mechanical",
      name: "Mechanical Engineering",
      icon: Wrench,
      subjects: [
        "Thermodynamics",
        "Fluid Mechanics",
        "Statics & Dynamics",
        "Machine Design",
        "Heat Transfer",
        "Manufacturing Processes",
      ],
    },
    {
      id: "electrical",
      name: "Electrical Engineering",
      icon: Zap,
      subjects: [
        "Circuit Analysis",
        "Electronics",
        "Power Systems",
        "Digital Logic",
        "Control Systems",
        "Electromagnetics",
      ],
    },
    {
      id: "computer",
      name: "Computer Engineering",
      icon: Cpu,
      subjects: [
        "Data Structures",
        "Computer Architecture",
        "Operating Systems",
        "Database Design",
        "Software Engineering",
        "Networks",
      ],
    },
    {
      id: "civil",
      name: "Civil Engineering",
      icon: BookOpen,
      subjects: [
        "Structural Analysis",
        "Concrete Design",
        "Geotechnical Engineering",
        "Transportation",
        "Environmental Engineering",
        "Construction Management",
      ],
    },
  ];

  useEffect(() => {
    loadNotes();
  }, [selectedCategory]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      let fetchedNotes;
      if (selectedCategory === "all") {
        fetchedNotes = await notesService.getAll();
      } else {
        fetchedNotes = await notesService.getByCategory(selectedCategory);
      }
      setNotes(fetchedNotes);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (noteId: string, fileName: string) => {
    try {
      await notesService.download(noteId);
      toast({
        title: "Download Started",
        description: `Downloading ${fileName}...`,
      });
      // Refresh notes to update download count
      loadNotes();
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Failed to download the file. Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      note.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase()),
      ),
  );

  const getCategoryNoteCount = (categoryId: string) => {
    return notes.filter((note) => note.category === categoryId).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <Header />

      <main className="container py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Engineering Notes Library</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Access comprehensive study notes organized by engineering
            disciplines. Share your materials and collaborate with fellow
            engineering students.
          </p>
        </div>

        {/* Main Layout with Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Upload Section */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Upload Notes</CardTitle>
                <CardDescription>Share your study materials</CardDescription>
              </CardHeader>
              <CardContent>
                <AuthGuard
                  message="Sign in to upload and share your study notes"
                  fallback={
                    <div className="text-center py-4">
                      <p className="text-sm text-muted-foreground mb-3">
                        Sign in to upload notes
                      </p>
                      <Button variant="outline" asChild>
                        <Link to="/login">Sign In</Link>
                      </Button>
                    </div>
                  }
                >
                  <UploadNoteModal onNoteUploaded={loadNotes} />
                </AuthGuard>
              </CardContent>
            </Card>

            {/* Category Filter */}
            <Card>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory("all")}
                >
                  All Categories ({notes.length})
                </Button>
                {engineeringCategories.map((category) => {
                  const Icon = category.icon;
                  const count = getCategoryNoteCount(category.id);
                  return (
                    <Button
                      key={category.id}
                      variant={
                        selectedCategory === category.id ? "default" : "ghost"
                      }
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {category.name} ({count})
                    </Button>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Search */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search notes, subjects, tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Notes Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="pt-6">
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
                      <div className="h-3 bg-muted rounded w-full mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : filteredNotes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredNotes.map((note) => (
                  <Card
                    key={note.id}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">
                            {note.title}
                          </CardTitle>
                          <CardDescription className="flex items-center space-x-2 mt-1">
                            <span>{note.subject}</span>
                            <span>•</span>
                            <span>by {note.uploadedBy}</span>
                          </CardDescription>
                        </div>
                        <FileText className="h-5 w-5 text-muted-foreground" />
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {note.description}
                      </p>

                      <div className="flex flex-wrap gap-1">
                        {note.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="outline"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <Download className="h-3 w-3" />
                            <span>{note.downloads}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(note.uploadedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <span className="text-xs">
                          {note.fileSize.toFixed(1)} MB
                        </span>
                      </div>

                      <Button
                        className="w-full"
                        onClick={() => handleDownload(note.id, note.fileName)}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download {note.fileName}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center">
                <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No Notes Found</h3>
                <p className="text-muted-foreground mb-6">
                  {searchTerm
                    ? "No notes match your search criteria. Try adjusting your search terms."
                    : "No notes available in this category yet. Be the first to upload!"}
                </p>
                <UploadNoteModal onNoteUploaded={loadNotes} />
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notes;
