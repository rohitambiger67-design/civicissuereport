import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import IssueCard from "./IssueCard";
import { mockIssues } from "@/data/mockIssues";
import { Issue } from "@/types/issue";

const RecentIssues = () => {
  const { t } = useLanguage();
  const [issues, setIssues] = useState<Issue[]>(mockIssues.slice(0, 3));

  const handleLike = (id: string) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id ? { ...issue, likes: issue.likes + 1 } : issue
      )
    );
  };

  const handleReReport = (id: string) => {
    setIssues((prev) =>
      prev.map((issue) =>
        issue.id === id ? { ...issue, reports: issue.reports + 1 } : issue
      )
    );
  };

  return (
    <section className="py-16">
      <div className="container">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">{t("recentIssues")}</h2>
          <Link to="/issues">
            <Button variant="ghost" className="gap-2 group">
              {t("viewAll")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {issues.map((issue) => (
            <IssueCard
              key={issue.id}
              issue={issue}
              onLike={handleLike}
              onReReport={handleReReport}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecentIssues;
