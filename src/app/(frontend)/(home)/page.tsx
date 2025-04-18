import FaqSection from "@/app/(frontend)/(home)/_sections/FaqSection";
import FeaturesSection from "@/app/(frontend)/(home)/_sections/FeaturesSection";
import HeroSection from "@/app/(frontend)/(home)/_sections/HeroSection";
import HowItWorksSection from "@/app/(frontend)/(home)/_sections/HowItWorksSection";
import TestimonialSection from "@/app/(frontend)/(home)/_sections/TestimonialSection";
import Navbar from "@/components/Navbar";
import PricingSection from "@/components/Pricing";

import Footer from "./_sections/Footer";

export default function Home() {
  return (
    <div className="bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <section id="pricing" className="bg-gray-100 py-20">
          <PricingSection selectedOption="preview"  hasFreeplan={true} />
        </section>
        <FeaturesSection />
        <TestimonialSection />
        <FaqSection />
        <Footer />
      </main>
    </div>
  );
}
