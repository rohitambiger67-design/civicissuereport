import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IssueCard from "@/components/IssueCard";
import FeedbackDialog from "@/components/FeedbackDialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Camera, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Issue, IssueCategory, IssueStatus } from "@/types/issue";

const MyIssues = () => {
  const { t } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [myIssues, setMyIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState(false);
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  // Fetch user's issues from database
  const fetchMyIssues = async () => {
    if (!user) return;
    
    setLoading(true);
    
    // Fetch issues
    const { data: issuesData, error: issuesError } = await supabase
      .from('issues')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (issuesError) {
      console.error('Error fetching my issues:', issuesError);
      setLoading(false);
      return;
    }

    // Fetch feedback for user's issues to check which ones have feedback
    const { data: feedbackData, error: feedbackError } = await supabase
      .from('issue_feedback')
      .select('issue_id')
      .eq('user_id', user.id);

    if (feedbackError) {
      console.error('Error fetching feedback:', feedbackError);
    }

    const feedbackIssueIds = new Set(feedbackData?.map(f => f.issue_id) || []);

    if (issuesData) {
      const transformedIssues: Issue[] = issuesData.map((item) => ({
        id: item.id,
        imageUrl: item.image_url,
        category: item.category as IssueCategory,
        description: item.description,
        location: {
          latitude: item.latitude,
          longitude: item.longitude,
          address: item.area ? `${item.area}, ${item.city || ''}` : undefined,
        },
        status: (item.status === 'inProgress' ? 'inProgress' : item.status) as IssueStatus,
        likes: item.likes,
        reports: item.reports,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
        assignedTo: item.assigned_to || undefined,
        reportedBy: 'You',
        averageRating: item.average_rating ? parseFloat(item.average_rating.toString()) : undefined,
        hasFeedback: feedbackIssueIds.has(item.id),
      }));
      setMyIssues(transformedIssues);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) {
      fetchMyIssues();
    }
  }, [user]);

  const handleLike = async (id: string) => {
    const issue = myIssues.find(i => i.id === id);
    if (!issue) return;
    
    const { error } = await supabase
      .from('issues')
      .update({ likes: issue.likes + 1 })
      .eq('id', id);
    
    if (!error) {
      setMyIssues((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, likes: i.likes + 1 } : i
        )
      );
    }
  };

  const handleFeedback = (id: string) => {
    setSelectedIssueId(id);
    setFeedbackDialogOpen(true);
  };

  const handleFeedbackSubmitted = () => {
    // Refresh issues to update the hasFeedback and averageRating
    fetchMyIssues();
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-6">
        <div className="container">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ClipboardList className="h-7 w-7 text-primary" />
              <h1 className="text-2xl font-bold">{t("myReportedIssues")}</h1>
            </div>
            <Link to="/report">
              <Button variant="civic" className="gap-2">
                <Camera className="h-4 w-4" />
                {t("reportNew")}
              </Button>
            </Link>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : myIssues.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-16">
                <ClipboardList className="h-16 w-16 text-muted-foreground/40 mb-4" />
                <h3 className="text-lg font-semibold text-muted-foreground mb-2">
                  {t("noIssuesYet")}
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  {t("noIssuesDesc")}
                </p>
                <Link to="/report">
                  <Button variant="civic-accent" className="gap-2">
                    <Camera className="h-4 w-4" />
                    {t("reportFirstIssue")}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {myIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onLike={handleLike}
                  showFeedbackButton={true}
                  onFeedback={handleFeedback}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />

      {/* Feedback Dialog */}
      {selectedIssueId && (
        <FeedbackDialog
          open={feedbackDialogOpen}
          onOpenChange={setFeedbackDialogOpen}
          issueId={selectedIssueId}
          onFeedbackSubmitted={handleFeedbackSubmitted}
        />
      )}
    </div>
  );
};

export default MyIssues;
