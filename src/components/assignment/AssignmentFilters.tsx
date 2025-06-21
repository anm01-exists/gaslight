import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";

interface AssignmentFiltersProps {
  subjects: string[];
  selectedSubjects: string[];
  onSubjectChange: (subjects: string[]) => void;
  budgetRange: [number, number];
  onBudgetChange: (range: [number, number]) => void;
  difficulty: string;
  onDifficultyChange: (difficulty: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
}

export const AssignmentFilters = ({
  subjects,
  selectedSubjects,
  onSubjectChange,
  budgetRange,
  onBudgetChange,
  difficulty,
  onDifficultyChange,
  sortBy,
  onSortChange,
}: AssignmentFiltersProps) => {
  const toggleSubject = (subject: string) => {
    if (selectedSubjects.includes(subject)) {
      onSubjectChange(selectedSubjects.filter((s) => s !== subject));
    } else {
      onSubjectChange([...selectedSubjects, subject]);
    }
  };

  const clearFilters = () => {
    onSubjectChange([]);
    onBudgetChange([0, 1000]);
    onDifficultyChange("all");
    onSortChange("newest");
  };

  const hasActiveFilters =
    selectedSubjects.length > 0 ||
    budgetRange[0] > 0 ||
    budgetRange[1] < 1000 ||
    difficulty !== "all";

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Filters</CardTitle>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear all
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Sort */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Sort by</label>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="deadline">Deadline</SelectItem>
              <SelectItem value="budget-high">Highest budget</SelectItem>
              <SelectItem value="budget-low">Lowest budget</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Subjects */}
        <div className="space-y-3">
          <label className="text-sm font-medium">Subjects</label>
          <div className="space-y-2">
            {subjects.map((subject) => (
              <Button
                key={subject}
                variant={
                  selectedSubjects.includes(subject) ? "default" : "outline"
                }
                size="sm"
                className="w-full justify-start"
                onClick={() => toggleSubject(subject)}
              >
                {subject}
              </Button>
            ))}
          </div>
          {selectedSubjects.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {selectedSubjects.map((subject) => (
                <Badge key={subject} variant="secondary" className="text-xs">
                  {subject}
                  <X
                    className="h-3 w-3 ml-1 cursor-pointer"
                    onClick={() => toggleSubject(subject)}
                  />
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Budget Range */}
        <div className="space-y-3">
          <label className="text-sm font-medium">
            Budget: ₹{budgetRange[0]} - ₹{budgetRange[1]}
          </label>
          <Slider
            value={budgetRange}
            onValueChange={(value) => onBudgetChange(value as [number, number])}
            max={10000}
            min={0}
            step={250}
            className="w-full"
          />
        </div>

        {/* Difficulty */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Difficulty</label>
          <Select value={difficulty} onValueChange={onDifficultyChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All levels</SelectItem>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};
