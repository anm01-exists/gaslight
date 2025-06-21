import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, DollarSign, User, BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface AssignmentCardProps {
  id: string;
  title: string;
  description: string;
  subject: string;
  deadline: string;
  budget: number;
  difficulty: "Easy" | "Medium" | "Hard";
  postedBy: string;
  postedAt: string;
  applicants?: number;
}

export const AssignmentCard = ({
  id,
  title,
  description,
  subject,
  deadline,
  budget,
  difficulty,
  postedBy,
  postedAt,
  applicants = 0,
}: AssignmentCardProps) => {
  const difficultyColors = {
    Easy: "bg-success/10 text-success border-success/20",
    Medium: "bg-warning/10 text-warning border-warning/20",
    Hard: "bg-destructive/10 text-destructive border-destructive/20",
  };

  const timeLeft = new Date(deadline).getTime() - new Date().getTime();
  const daysLeft = Math.ceil(timeLeft / (1000 * 60 * 60 * 24));

  return (
    <Card className="group hover:shadow-lg transition-all duration-200 cursor-pointer border-border/50 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">
              {title}
            </CardTitle>
            <CardDescription className="flex items-center space-x-2 text-sm">
              <BookOpen className="h-3 w-3" />
              <span>{subject}</span>
              <span>•</span>
              <span>by {postedBy}</span>
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className={cn("text-xs font-medium", difficultyColors[difficulty])}
          >
            {difficulty}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground line-clamp-2">
          {description}
        </p>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{daysLeft > 0 ? `${daysLeft} days left` : "Due soon"}</span>
            </div>
            <div className="flex items-center space-x-1 text-muted-foreground">
              <User className="h-4 w-4" />
              <span>{applicants} applied</span>
            </div>
          </div>

          <div className="flex items-center space-x-1 font-semibold text-primary">
            <DollarSign className="h-4 w-4" />
            <span>₹{budget}</span>
          </div>
        </div>

        <div className="flex space-x-2 pt-2">
          <Button size="sm" className="flex-1">
            Apply Now
          </Button>
          <Button size="sm" variant="outline">
            View Details
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
