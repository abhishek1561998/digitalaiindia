import FuturisticHeader from "@/components/FuturisticHeader";
import HeroBanner from "@/components/HeroBanner";
import FeaturesSection from "@/components/FeaturesSection";
import SolutionsSection from "@/components/SolutionsSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FuturisticFooter from "@/components/FuturisticFooter";

export default function Home() {
  return (
    <div className="min-h-screen bg-black overflow-x-hidden">
      <FuturisticHeader />
      <HeroBanner />
      <SolutionsSection />
      <TestimonialsSection />
      <FuturisticFooter />
    </div>
  );
}
