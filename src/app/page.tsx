import { Header } from "@/components/header";
import { Projects } from "@/components/projects";
import { Footer } from "@/components/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <section className="mx-auto max-w-5xl px-6 pt-20 pb-12">
          <p className="text-muted">
            开源项目 · 技术文档 · 工程实践记录
          </p>
        </section>
        <Projects />
      </main>
      <Footer />
    </>
  );
}
