import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useLanguage } from "@/contexts/LanguageContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { Button } from "@/components/ui/button";
import { ClipboardList, LogOut, Database } from "lucide-react";
import { cn } from "@/lib/utils";

const UserDropdown = () => {
  const { profile, signOut } = useAuth();
  const { t } = useLanguage();
  const { isAdmin } = useIsAdmin();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const firstLetter = profile?.display_name?.charAt(0).toUpperCase() || "U";

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setIsOpen(false);
    await signOut();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="h-9 w-9 rounded-full bg-primary text-primary-foreground font-bold text-sm hover:bg-primary/90"
        aria-label="User menu"
      >
        {firstLetter}
      </Button>

      <div
        className={cn(
          "absolute right-0 top-full mt-2 w-48 rounded-lg border bg-background shadow-lg z-50 overflow-hidden transition-all duration-200",
          isOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2 pointer-events-none"
        )}
      >
        <div className="p-3 border-b bg-secondary/30">
          <p className="text-sm font-medium text-foreground truncate">{profile?.display_name}</p>
        </div>
        <div className="p-1">
          {isAdmin ? (
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors"
            >
              <Database className="h-4 w-4" />
              {t("viewDatabase")}
            </Link>
          ) : (
            <Link
              to="/my-issues"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-secondary transition-colors"
            >
              <ClipboardList className="h-4 w-4" />
              {t("viewMyIssues")}
            </Link>
          )}
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full px-3 py-2 text-sm rounded-md text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            {t("logout")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDropdown;
