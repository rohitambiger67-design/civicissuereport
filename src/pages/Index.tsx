import { lazy, Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";

// Lazy load below-fold component to improve LCP
const HowItWorks = lazy(() => import("@/components/HowItWorks"));

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <Suspense fallback={<div className="py-16" />}>
          <HowItWorks />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
