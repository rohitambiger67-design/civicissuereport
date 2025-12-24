import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CameraCapture from "@/components/CameraCapture";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { reverseGeocode, LocationInfo } from "@/lib/geocoding";
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
import { Send, MapPin, Building2, LogIn, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { IssueCategory, departments } from "@/types/issue";

const Report = () => {
  const { t } = useLanguage();
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [location, setLocation] = useState<GeolocationPosition | null>(null);
  const [locationInfo, setLocationInfo] = useState<LocationInfo | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
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

  // Fetch location info when coordinates are available
  useEffect(() => {
    const fetchLocationInfo = async () => {
      if (location) {
        setLoadingLocation(true);
        const info = await reverseGeocode(
          location.coords.latitude,
          location.coords.longitude
        );
        setLocationInfo(info);
        setLoadingLocation(false);
      }
    };
    fetchLocationInfo();
  }, [location]);

  const handleCapture = (imageData: string, loc: GeolocationPosition | null) => {
    setCapturedImage(imageData);
    setLocation(loc);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setLocationInfo(null);
  };

  const selectedDepartment = category
    ? departments.find((d) => d.category === category)
    : null;

  const handleSubmit = async () => {
    if (!capturedImage || !category || !description.trim() || !location || !user) {
      toast.error("Please fill all required fields");
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Convert base64 to blob for upload
      const base64Data = capturedImage.split(',')[1];
      const byteCharacters = atob(base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: 'image/jpeg' });

      // Upload image to storage
      const fileName = `${user.id}/${Date.now()}.jpg`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('issues')
        .upload(fileName, blob, { contentType: 'image/jpeg' });

      if (uploadError) {
        throw new Error('Failed to upload image');
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('issues')
        .getPublicUrl(fileName);

      // Insert issue into database
      const { error: insertError } = await supabase.from('issues').insert({
        user_id: user.id,
        image_url: publicUrl,
        category,
        description: description.trim(),
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        area: locationInfo?.area || null,
        city: locationInfo?.city || null,
        assigned_to: selectedDepartment?.name || null,
      });

      if (insertError) {
        throw new Error('Failed to save issue');
      }
      
      toast.success(t("reportSuccess"));
      navigate("/issues");
    } catch (error) {
      console.error('Submit error:', error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValid = capturedImage && category && description.trim() && location;

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
                  <MapPin className="h-5 w-5 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{t("location")}</p>
                    {loadingLocation ? (
                      <div className="flex items-center gap-2 text-xs">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Detecting area...</span>
                      </div>
                    ) : locationInfo ? (
                      <p className="text-xs">
                        {locationInfo.area}, {locationInfo.city}
                      </p>
                    ) : (
                      <p className="text-xs">
                        {location.coords.latitude.toFixed(6)}, {location.coords.longitude.toFixed(6)}
                      </p>
                    )}
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
