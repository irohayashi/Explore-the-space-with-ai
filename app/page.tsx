"use client";


import HeroSpaceLanding from "@/components/ui/hero-space";
import StarryBackground from "@/components/ui/starry-background";

export default function Home() {
  return (
    <div className="min-h-screen relative">
      <StarryBackground />
      <div className="motion-safe:animate-[hero3-intro_1s_cubic-bezier(.22,.68,0,1)_forwards]">
        <HeroSpaceLanding />
      </div>
    </div>
  );
}
