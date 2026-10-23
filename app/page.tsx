import Client from "./components/ui/client";
import Hero from "./components/ui/Hero";
import HowTo from "./components/ui/HowTo";
import FAQ from "./components/ui/FAQ";

export default function Home() {
  return (
    <div className="bg-white bg-[radial-gradient(#A19D9C_0.1px,transparent_1px)] bg-size-[24px_24px]">
      <Hero />
      <HowTo />
      <Client />
      <FAQ />
    </div>
  );
}
