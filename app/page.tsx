import Hero from "@/components/hero";
import About from "@/components/about";
import Prizes from "@/components/prizes";
import Sponsors from "@/components/sponsors";
import Judges from "@/components/judges";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <Hero />
      <About />

      <Prizes />
      <Sponsors />
      <Judges />
      <Footer />
    </main>
  );
}
