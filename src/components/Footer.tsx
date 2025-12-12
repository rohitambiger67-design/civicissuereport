import { useLanguage } from "@/contexts/LanguageContext";
import { Heart } from "lucide-react";

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="border-t border-border/40 bg-secondary/30">
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span>{t("poweredBy")}</span>
            <Heart className="h-4 w-4 fill-civic-saffron text-civic-saffron" />
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>© 2024 HDMC Civic Eye</span>
            <span>•</span>
            <span>Hubli-Dharwad Municipal Corporation</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
