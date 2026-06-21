import { Navbar }              from "@/components/Navbar";
import { HeroSection }         from "@/components/HeroSection";
import { MarqueeBar }          from "@/components/MarqueeBar";
import { ServicesSection }     from "@/components/ServicesSection";
import { BarbersSection }      from "@/components/BarbersSection";
import { BookingSection }      from "@/components/BookingSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { LoyaltySection }      from "@/components/LoyaltySection";
import { AboutSection }        from "@/components/AboutSection";
import { Footer }              from "@/components/Footer";
import { ChatWidget }          from "@/components/ChatWidget";
import { WhatsAppButton }      from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <main className="relative">
      <Navbar />
      <HeroSection />
      <MarqueeBar />
      <ServicesSection />
      <BarbersSection />
      <BookingSection />
      <TestimonialsSection />
      <LoyaltySection />
      <AboutSection />
      <Footer />
      <ChatWidget />
      <WhatsAppButton />
    </main>
  );
}
