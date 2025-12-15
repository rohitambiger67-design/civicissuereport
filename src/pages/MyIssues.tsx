import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IssueCard from "@/components/IssueCard";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ClipboardList, Camera } from "lucide-react";
import { Link } from "react-router-dom";
import { mockIssues } from "@/data/mockIssues";

const MyIssues = () => {
  const { t } = useLanguage();
  const { user, profile, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if not logged in
  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // For demo purposes, filter issues by the user's display name
  // In a real app, this would filter by user_id
  const myIssues = mockIssues.filter(
    (issue) => issue.reportedBy === profile?.display_name
  );

  const handleLike = (id: string) => {
    console.log("Liked issue:", id);
  };

  const handleReReport = (id: string) => {
    console.log("Re-reported issue:", id);
  };

  if (loading) {
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

          {myIssues.length === 0 ? (
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
                  onReReport={handleReReport}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyIssues;
