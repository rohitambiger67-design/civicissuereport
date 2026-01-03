import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import HowItWorks from "@/components/HowItWorks";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <HowItWorks />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
