import { useState, useMemo, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IssueCard from "@/components/IssueCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { Issue, IssueCategory, IssueStatus } from "@/types/issue";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const Issues = () => {
  const { t } = useLanguage();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<IssueCategory | "all">("all");
  const [statusFilter, setStatusFilter] = useState<IssueStatus | "all">("all");
  const [sortBy, setSortBy] = useState<"recent" | "likes">("recent");

  // Fetch issues from database
  useEffect(() => {
    const fetchIssues = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching issues:', error);
      } else if (data) {
        // Transform database data to Issue type
        const transformedIssues: Issue[] = data.map((item) => ({
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
          reportedBy: 'Citizen',
        }));
        setIssues(transformedIssues);
      }
      setLoading(false);
    };

    fetchIssues();
  }, []);

  const categories: (IssueCategory | "all")[] = [
    "all",
    "roads",
    "drainage",
    "garbage",
    "streetlights",
    "water",
    "encroachment",
    "other",
  ];

  const statuses: (IssueStatus | "all")[] = ["all", "pending", "inProgress", "resolved"];

  const categoryIcons: Record<IssueCategory | "all", string> = {
    all: "📋",
    roads: "🛣️",
    drainage: "🚰",
    garbage: "🗑️",
    streetlights: "💡",
    water: "💧",
    encroachment: "🏗️",
    other: "📋",
  };

  const filteredIssues = useMemo(() => {
    let result = [...issues];

    if (categoryFilter !== "all") {
      result = result.filter((issue) => issue.category === categoryFilter);
    }

    if (statusFilter !== "all") {
      result = result.filter((issue) => issue.status === statusFilter);
    }

    if (sortBy === "recent") {
      result.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } else {
      result.sort((a, b) => b.likes - a.likes);
    }

    return result;
  }, [issues, categoryFilter, statusFilter, sortBy]);

  const handleLike = async (id: string) => {
    const issue = issues.find(i => i.id === id);
    if (!issue) return;
    
    const { error } = await supabase
      .from('issues')
      .update({ likes: issue.likes + 1 })
      .eq('id', id);
    
    if (!error) {
      setIssues((prev) =>
        prev.map((i) =>
          i.id === id ? { ...i, likes: i.likes + 1 } : i
        )
      );
    }
  };


  const statusCounts = useMemo(() => {
    return {
      all: issues.length,
      pending: issues.filter((i) => i.status === "pending").length,
      inProgress: issues.filter((i) => i.status === "inProgress").length,
      resolved: issues.filter((i) => i.status === "resolved").length,
    };
  }, [issues]);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-6">
        <div className="container">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-2">{t("viewIssues")}</h1>
            <p className="text-muted-foreground">{t("subtitle")}</p>
          </div>

          {/* Filters */}
          <div className="mb-6 space-y-4">
            {/* Status Tabs */}
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "civic" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className="gap-2"
                >
                  {t(status === "all" ? "all" : status)}
                  <Badge
                    variant="secondary"
                    className={cn(
                      "ml-1 h-5 min-w-[20px] px-1.5 text-xs",
                      statusFilter === status && "bg-primary-foreground/20"
                    )}
                  >
                    {statusCounts[status]}
                  </Badge>
                </Button>
              ))}
            </div>

            {/* Category & Sort */}
            <div className="flex flex-wrap gap-3">
              <Select
                value={categoryFilter}
                onValueChange={(val) => setCategoryFilter(val as IssueCategory | "all")}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder={t("filterByCategory")} />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      <span className="flex items-center gap-2">
                        <span>{categoryIcons[cat]}</span>
                        <span>{t(cat === "all" ? "all" : cat)}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(val) => setSortBy(val as "recent" | "likes")}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder={t("sortBy")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="recent">{t("mostRecent")}</SelectItem>
                  <SelectItem value="likes">{t("mostLiked")}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Issues Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : filteredIssues.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredIssues.map((issue) => (
                <IssueCard
                  key={issue.id}
                  issue={issue}
                  onLike={handleLike}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-muted-foreground text-lg">No issues found matching your filters.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Issues;
