import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface FeedbackDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  issueId: string;
  onFeedbackSubmitted: () => void;
}

interface RatingCategory {
  key: string;
  label: string;
  description: string;
}

const ratingCategories: RatingCategory[] = [
  {
    key: "resolution_satisfaction",
    label: "Resolution Quality",
    description: "How satisfied are you with how the issue was resolved?",
  },
  {
    key: "speed_of_work",
    label: "Speed of Work",
    description: "How would you rate the time taken to resolve the issue?",
  },
  {
    key: "communication_quality",
    label: "Communication",
    description: "How well were you kept informed about the progress?",
  },
  {
    key: "overall_experience",
    label: "Overall Experience",
    description: "How would you rate your overall experience?",
  },
];

const StarRating = ({
  value,
  onChange,
  disabled = false,
}: {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          className={cn(
            "p-1 transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded",
            disabled && "cursor-not-allowed opacity-50"
          )}
          onMouseEnter={() => !disabled && setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          onClick={() => !disabled && onChange(star)}
        >
          <Star
            className={cn(
              "h-6 w-6 transition-colors",
              (hovered || value) >= star
                ? "fill-yellow-400 text-yellow-400"
                : "text-muted-foreground"
            )}
          />
        </button>
      ))}
    </div>
  );
};

const FeedbackDialog = ({
  open,
  onOpenChange,
  issueId,
  onFeedbackSubmitted,
}: FeedbackDialogProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [ratings, setRatings] = useState<Record<string, number>>({
    resolution_satisfaction: 0,
    speed_of_work: 0,
    communication_quality: 0,
    overall_experience: 0,
  });
  const [comments, setComments] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleRatingChange = (key: string, value: number) => {
    setRatings((prev) => ({ ...prev, [key]: value }));
  };

  const isValid = Object.values(ratings).every((r) => r >= 1 && r <= 5);

  const handleSubmit = async () => {
    if (!user || !isValid) return;

    setSubmitting(true);
    const { error } = await supabase.from("issue_feedback").insert({
      issue_id: issueId,
      user_id: user.id,
      resolution_satisfaction: ratings.resolution_satisfaction,
      speed_of_work: ratings.speed_of_work,
      communication_quality: ratings.communication_quality,
      overall_experience: ratings.overall_experience,
      comments: comments.trim() || null,
    });

    setSubmitting(false);

    if (error) {
      if (error.code === "23505") {
        toast.error(t("feedbackAlreadySubmitted"));
      } else {
        console.error("Error submitting feedback:", error);
        toast.error(t("feedbackError"));
      }
    } else {
      toast.success(t("feedbackSuccess"));
      onFeedbackSubmitted();
      onOpenChange(false);
      // Reset form
      setRatings({
        resolution_satisfaction: 0,
        speed_of_work: 0,
        communication_quality: 0,
        overall_experience: 0,
      });
      setComments("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("feedbackTitle")}</DialogTitle>
          <DialogDescription>{t("feedbackDescription")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {ratingCategories.map((category) => (
            <div key={category.key} className="space-y-2">
              <Label className="text-base font-medium">{category.label}</Label>
              <p className="text-sm text-muted-foreground">
                {category.description}
              </p>
              <StarRating
                value={ratings[category.key]}
                onChange={(value) => handleRatingChange(category.key, value)}
                disabled={submitting}
              />
            </div>
          ))}

          <div className="space-y-2">
            <Label htmlFor="comments">{t("additionalComments")}</Label>
            <Textarea
              id="comments"
              placeholder={t("feedbackCommentsPlaceholder")}
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              disabled={submitting}
              rows={3}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            {t("cancel")}
          </Button>
          <Button
            variant="civic"
            onClick={handleSubmit}
            disabled={!isValid || submitting}
          >
            {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {t("submitFeedback")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDialog;
