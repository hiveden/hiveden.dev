import { Header } from "@/components/header";
import { TypingHero } from "@/components/typing-hero";
import { Projects } from "@/components/projects";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <div className="bg-grid min-h-dvh">
      <Header />
      <main>
        <TypingHero />
        <Projects />
      </main>
      <Footer />
    </div>
  );
}
