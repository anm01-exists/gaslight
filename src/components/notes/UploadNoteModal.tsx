import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Upload, X } from "lucide-react";
import { notesService } from "@/lib/database";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

const categories = [
  { id: "mechanical", name: "Mechanical Engineering" },
  { id: "electrical", name: "Electrical Engineering" },
  { id: "computer", name: "Computer Engineering" },
  { id: "civil", name: "Civil Engineering" },
];

const subjects = {
  mechanical: [
    "Thermodynamics",
    "Fluid Mechanics",
    "Statics & Dynamics",
    "Machine Design",
    "Heat Transfer",
    "Manufacturing Processes",
  ],
  electrical: [
    "Circuit Analysis",
    "Electronics",
    "Power Systems",
    "Digital Logic",
    "Control Systems",
    "Electromagnetics",
  ],
  computer: [
    "Data Structures",
    "Computer Architecture",
    "Operating Systems",
    "Database Design",
    "Software Engineering",
    "Networks",
  ],
  civil: [
    "Structural Analysis",
    "Concrete Design",
    "Geotechnical Engineering",
    "Transportation",
    "Environmental Engineering",
    "Construction Management",
  ],
};

export const UploadNoteModal = ({
  onNoteUploaded,
}: {
  onNoteUploaded: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subject: "",
    fileName: "",
    fileSize: 0,
  });

  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        fileName: file.name,
        fileSize: file.size / (1024 * 1024), // Convert to MB
      });
    }
  };

  const addTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload notes.",
        variant: "destructive",
      });
      return;
    }

    if (
      !formData.title ||
      !formData.description ||
      !formData.category ||
      !formData.subject ||
      !formData.fileName
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all fields and select a file.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await notesService.upload({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        subject: formData.subject,
        fileName: formData.fileName,
        fileSize: formData.fileSize,
        uploadedBy: user.name,
        uploadedById: user.id,
        tags,
      });

      toast({
        title: "Note Uploaded!",
        description: "Your study notes have been uploaded successfully.",
      });

      setFormData({
        title: "",
        description: "",
        category: "",
        subject: "",
        fileName: "",
        fileSize: 0,
      });
      setTags([]);

      setOpen(false);
      onNoteUploaded();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload notes. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const availableSubjects = formData.category
    ? subjects[formData.category as keyof typeof subjects] || []
    : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center space-x-2">
          <Upload className="h-4 w-4" />
          <span>Upload Notes</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Upload Study Notes</DialogTitle>
          <DialogDescription>
            Share your study materials with the engineering community.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              placeholder="e.g., Thermodynamics Chapter 1-5 Notes"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="Describe what's covered in these notes..."
              rows={3}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Engineering Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) =>
                  setFormData({ ...formData, category: value, subject: "" })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Select
                value={formData.subject}
                onValueChange={(value) =>
                  setFormData({ ...formData, subject: value })
                }
                disabled={!formData.category}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {availableSubjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">File Upload</Label>
            <Input
              id="file"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.docx,.ppt,.pptx,.jpg,.jpeg,.png"
              required
            />
            {formData.fileName && (
              <p className="text-sm text-muted-foreground">
                Selected: {formData.fileName} ({formData.fileSize.toFixed(2)}{" "}
                MB)
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Tags</Label>
            <div className="flex space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add tags..."
                onKeyPress={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addTag())
                }
              />
              <Button type="button" onClick={addTag} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="flex items-center space-x-1"
                >
                  <span>{tag}</span>
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => removeTag(tag)}
                  />
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Uploading..." : "Upload Notes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
