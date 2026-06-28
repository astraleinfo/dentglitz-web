import { Navbar }           from "@/components/landing/Navbar";
import { Hero }             from "@/components/landing/Hero";
// import { BookAppointment }  from "@/components/landing/BookAppointment";
import { About }            from "@/components/landing/About";
import { Services }         from "@/components/landing/Services";
import { Doctors }          from "@/components/landing/Doctors";
import { Transformations }  from "@/components/landing/Transformations";
import { Gallery }          from "@/components/landing/Gallery";
import { Updates }          from "@/components/landing/Updates";
import { Testimonials }     from "@/components/landing/Testimonials";
import { Contact }          from "@/components/landing/Contact";
import { CTA }              from "@/components/landing/CTA";
import { Footer }           from "@/components/landing/Footer";
// import { AnimatedParticles } from "@/components/landing/AnimatedParticles";
import { media }           from "@/config/media";

export default function Home() {
  return (
    <main>
      {/* <AnimatedParticles /> */}
      <Navbar />
      <Hero />
      {/* Fixed background wrapper — all sections below Hero scroll over aboutBackground */}
      <div
        style={{
          backgroundImage: `url(${media.aboutBackground})`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* <BookAppointment /> */}
        <About />
        <Services />
        <Doctors />
        <Transformations />
        <Gallery />
        <Updates />
        <Testimonials />
        <Contact />
        <CTA />
        <Footer />
      </div>
    </main>
  );
}
