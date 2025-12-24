import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Camera, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const { t } = useLanguage();

  return (
    <section className="relative overflow-hidden gradient-hero py-16 md:py-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_80%,_white_0%,_transparent_50%)]" />
        <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_20%,_white_0%,_transparent_50%)]" />
      </div>

      <div className="container relative z-10">
        <div className="flex flex-col items-center text-center text-primary-foreground">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 backdrop-blur-sm">
            <span className="h-2 w-2 rounded-full bg-civic-saffron animate-pulse" />
            <span className="text-sm font-medium">Hubli-Dharwad Municipal Corporation</span>
          </div>

          {/* Title */}
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            {t("heroTitle")}
          </h1>

          {/* Subtitle */}
          <p className="mb-8 max-w-2xl text-lg text-primary-foreground/80 md:text-xl">
            {t("heroSubtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 mb-12">
            <Link to="/report">
              <Button size="xl" variant="civic-accent" className="gap-2 group">
                <Camera className="h-5 w-5" />
                {t("startReporting")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Link to="/issues">
              <Button
                size="lg"
                variant="ghost"
                className="text-primary-foreground hover:text-primary-foreground hover:bg-white/10"
              >
                {t("viewIssues")}
              </Button>
            </Link>
          </div>

          {/* Civic Sense Paragraph */}
          <div className="max-w-3xl rounded-2xl bg-white/10 p-6 backdrop-blur-sm">
            <p className="text-primary-foreground/90 text-base md:text-lg leading-relaxed">
              <strong className="text-civic-saffron">Civic Sense</strong> is the foundation of a thriving community. 
              It means taking responsibility for our shared spaces—keeping our streets clean, respecting public property, 
              following traffic rules, and being considerate neighbors. When each citizen contributes to the well-being 
              of their city, we create safer, cleaner, and more harmonious environments for everyone. 
              Together, let's build a city we're proud to call home.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
