import Client from "./components/ui/client";
import Hero from "./components/ui/Hero";
import HowTo from "./components/ui/HowTo";

export default function Home() {
  return (
    <div className="bg-white">
      <Hero />
      <HowTo />
      <Client />
    </div>
  );
}
