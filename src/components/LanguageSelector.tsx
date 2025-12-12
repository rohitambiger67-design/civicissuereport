import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const languages = [
  { code: 'en', label: 'EN', fullName: 'English' },
  { code: 'hi', label: 'हि', fullName: 'हिंदी' },
  { code: 'kn', label: 'ಕ', fullName: 'ಕನ್ನಡ' },
] as const;

interface LanguageSelectorProps {
  variant?: 'default' | 'hero';
}

const LanguageSelector = ({ variant = 'default' }: LanguageSelectorProps) => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-1 rounded-full bg-secondary/80 p-1 backdrop-blur-sm">
      {languages.map((lang) => (
        <Button
          key={lang.code}
          variant="ghost"
          size="sm"
          onClick={() => setLanguage(lang.code as 'en' | 'hi' | 'kn')}
          className={cn(
            "h-8 min-w-[40px] rounded-full px-3 text-sm font-medium transition-all",
            language === lang.code
              ? variant === 'hero'
                ? "bg-accent text-accent-foreground shadow-sm"
                : "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
          title={lang.fullName}
        >
          {lang.label}
        </Button>
      ))}
    </div>
  );
};

export default LanguageSelector;
