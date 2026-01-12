import { useLanguage } from "@/contexts/LanguageContext";
import { Heart, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

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
          <div className="mt-6 flex flex-col items-center gap-2">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Built by</span>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm">
              {["Dhananjay", "Rohit", "Mansoor", "Sanjana", "Hemavathi", "Pratibha"].map((name, index) => (
                <span
                  key={name}
                  className="font-semibold bg-gradient-to-r from-civic-saffron via-primary to-civic-green bg-clip-text text-transparent hover:scale-110 hover:drop-shadow-[0_0_8px_hsl(var(--civic-saffron))] transition-all duration-300 cursor-default"
                >
                  {name}
                  {index < 5 && <span className="text-muted-foreground ml-3">•</span>}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-6 flex flex-col items-center gap-3">
            <p className="text-sm text-muted-foreground">{t("feedbackMatters")}</p>
            <a href="https://form.finalform.so/forms/UuSv8QkI" target="_blank" rel="noopener noreferrer">
              <Button variant="outline" className="gap-2">
                <MessageSquare className="h-4 w-4" />
                {t("feedbackButton")}
              </Button>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
