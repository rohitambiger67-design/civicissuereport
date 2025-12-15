import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CameraCapture from "@/components/CameraCapture";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, MapPin, Building2, LogIn } from "lucide-react";
import { toast } from "sonner";
import { IssueCategory, departments } from "@/types/issue";

const Report = () => {
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [category, setCategory] = useState<IssueCategory | "">("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories: IssueCategory[] = [
    "roads",
    "drainage",
    "garbage",
    "streetlights",
    "water",
    "encroachment",
    "other",
  ];

  const categoryIcons: Record<IssueCategory, string> = {
    roads: "🛣️",
    drainage: "🚰",
    garbage: "🗑️",
    streetlights: "💡",
    water: "💧",
    encroachment: "🏗️",
    other: "📋",
  };

  const handleCapture = (imageData: string, loc: GeolocationPosition | null) => {
    setCapturedImage(imageData);
    setLocation(loc);
  };

  const handleRetake = () => {
    setCapturedImage(null);
  };

  const selectedDepartment = category
    ? departments.find((d) => d.category === category)
    : null;

  const handleSubmit = async () => {
    if (!capturedImage || !category || !description.trim()) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success(t("reportSuccess"));
    setIsSubmitting(false);
    navigate("/issues");
  };

  const isValid = capturedImage && category && description.trim();

  // Show loading while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        <main className="flex-1 flex items-center justify-center py-12">
          <Card className="max-w-md mx-4 text-center">
            <CardContent className="pt-8 pb-6 space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                <LogIn className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">{t("loginRequired")}</h2>
              <p className="text-muted-foreground">{t("loginToReport")}</p>
              <Link to="/auth">
                <Button variant="civic" className="gap-2 mt-2">
                  <LogIn className="h-4 w-4" />
                  {t("login")}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 py-6">
        <div className="container max-w-2xl">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-primary/5">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Send className="h-5 w-5 text-primary" />
                {t("reportIssue")}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              {/* Camera Section */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">{t("capturePhoto")}</Label>
                <CameraCapture
                  onCapture={handleCapture}
                  capturedImage={capturedImage}
                  onRetake={handleRetake}
                />
              </div>

              {/* Location Display */}
              {location && (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-success/10 text-success border border-success/20">
                  <MapPin className="h-5 w-5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t("location")}</p>
                    <p className="text-xs">
                      {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
                    </p>
                  </div>
                </div>
              )}

              {/* Category Selection */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">{t("selectCategory")}</Label>
                <Select value={category} onValueChange={(val) => setCategory(val as IssueCategory)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder={t("selectCategory")} />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        <span className="flex items-center gap-2">
                          <span>{categoryIcons[cat]}</span>
                          <span>{t(cat)}</span>
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Department Info */}
              {selectedDepartment && (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 border border-primary/10">
                  <Building2 className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-medium">{t("assignedTo")}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedDepartment.name} ({selectedDepartment.contact})
                    </p>
                  </div>
                </div>
              )}

              {/* Description */}
              <div className="space-y-2">
                <Label className="text-base font-semibold">{t("describeIssue")}</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={t("describeIssue")}
                  className="min-h-[120px] resize-none"
                />
              </div>

              {/* Submit Button */}
              <Button
                onClick={handleSubmit}
                disabled={!isValid || isSubmitting}
                variant="civic-accent"
                size="lg"
                className="w-full gap-2"
              >
                {isSubmitting ? (
                  <div className="h-5 w-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
                {t("submitReport")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Report;
