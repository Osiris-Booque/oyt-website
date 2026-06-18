import Hero from "../components/landing/HeroSection";
import OfferingsSection from "../components/landing/OfferingsSection";
import About from "../components/landing/AboutSection";
import Contact from "../components/landing/ContactSection";

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <Hero />
      <OfferingsSection />
      <About />
      <Contact />
    </main>
  );
}