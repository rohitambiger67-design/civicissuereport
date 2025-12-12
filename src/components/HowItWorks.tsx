import { useLanguage } from "@/contexts/LanguageContext";
import { Camera, Send, Users } from "lucide-react";

const HowItWorks = () => {
  const { t } = useLanguage();

  const steps = [
    {
      icon: Camera,
      title: t("step1Title"),
      description: t("step1Desc"),
      color: "bg-civic-blue",
    },
    {
      icon: Send,
      title: t("step2Title"),
      description: t("step2Desc"),
      color: "bg-civic-saffron",
    },
    {
      icon: Users,
      title: t("step3Title"),
      description: t("step3Desc"),
      color: "bg-civic-green",
    },
  ];

  return (
    <section className="py-16 bg-secondary/30">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12">{t("howItWorks")}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <div
                key={index}
                className="relative flex flex-col items-center text-center p-6 rounded-2xl bg-card shadow-sm transition-all hover:shadow-md animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Step Number */}
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 h-6 w-6 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold">
                  {index + 1}
                </div>
                
                {/* Icon */}
                <div className={`${step.color} p-4 rounded-2xl text-white mb-4`}>
                  <Icon className="h-8 w-8" />
                </div>
                
                {/* Content */}
                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-0.5 bg-border" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
