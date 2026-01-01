import { Issue } from "@/types/issue";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, AlertTriangle, MapPin, Clock, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface IssueCardProps {
  issue: Issue;
  onLike: (id: string) => void;
  onReReport: (id: string) => void;
}

const IssueCard = ({ issue, onLike, onReReport }: IssueCardProps) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();

  const statusColors = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    inProgress: "bg-blue-100 text-blue-800 border-blue-200",
    resolved: "bg-green-100 text-green-800 border-green-200",
  };

  const categoryIcons = {
    roads: "🛣️",
    drainage: "🚰",
    garbage: "🗑️",
    streetlights: "💡",
    water: "💧",
    encroachment: "🏗️",
    other: "📋",
  };

  const handleLike = () => {
    if (!user) {
      toast.error(t("loginToSupport"));
      navigate("/auth");
      return;
    }
    onLike(issue.id);
    toast.success(t("likeSuccess"));
  };

  const handleReReport = () => {
    if (!user) {
      toast.error(t("loginToSupport"));
      navigate("/auth");
      return;
    }
    onReReport(issue.id);
    toast.success(t("reReportSuccess"));
  };

  const timeAgo = (date: Date) => {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    const intervals = [
      { label: "d", seconds: 86400 },
      { label: "h", seconds: 3600 },
      { label: "m", seconds: 60 },
    ];
    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) return `${count}${interval.label}`;
    }
    return "now";
  };

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg animate-fade-in">
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <img
          src={issue.imageUrl}
          alt={issue.description}
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <Badge className={cn("border", statusColors[issue.status])}>
            {t(issue.status)}
          </Badge>
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            {categoryIcons[issue.category]} {t(issue.category)}
          </Badge>
        </div>
        <div className="absolute bottom-3 right-3 flex items-center gap-1 rounded-full bg-background/90 px-2 py-1 text-xs backdrop-blur-sm">
          <Clock className="h-3 w-3 text-muted-foreground" />
          <span>{timeAgo(issue.createdAt)}</span>
        </div>
      </div>

      <CardContent className="p-4">
        {/* Description */}
        <p className="text-sm text-foreground line-clamp-2 mb-3">{issue.description}</p>

        {/* Location */}
        <div className="flex flex-col gap-1 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-civic-saffron flex-shrink-0" />
            <span>{issue.location.address || "Location not available"}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground/70 ml-6">
            <span>📍 {issue.location.latitude.toFixed(6)}, {issue.location.longitude.toFixed(6)}</span>
          </div>
        </div>

        {/* Reporter & Assignment */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{issue.reportedBy}</span>
          </div>
          {issue.assignedTo && (
            <span className="text-primary font-medium">{issue.assignedTo}</span>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t bg-secondary/30 p-3">
        <div className="flex w-full items-center justify-between">
          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <span className="flex items-center gap-1 text-muted-foreground">
              <ThumbsUp className="h-4 w-4" />
              <span className="font-medium">{issue.likes}</span>
            </span>
            <span className="flex items-center gap-1 text-muted-foreground">
              <AlertTriangle className="h-4 w-4" />
              <span className="font-medium">{issue.reports}</span>
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLike}
              className="gap-1 text-muted-foreground hover:text-primary"
            >
              <ThumbsUp className="h-4 w-4" />
              {t("likeThis")}
            </Button>
            <Button
              variant="civic-outline"
              size="sm"
              onClick={handleReReport}
              className="gap-1"
            >
              <AlertTriangle className="h-4 w-4" />
              {t("reReport")}
            </Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default IssueCard;
