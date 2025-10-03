"use client";

import { useState, useEffect } from "react";
import { useThemeSync } from "@/components/ui/hero-space";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowLeft, Github, Music, Instagram, Play } from "lucide-react";
import StarryBackground from "@/components/ui/starry-background";
import SpaceNavbar from "@/components/ui/space-navbar";


const AboutPage = () => {
  const [theme] = useThemeSync();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    
    // Add animations to document if they don't exist
    if (typeof document !== "undefined") {
      const styleId = "about-page-animations";
      if (!document.getElementById(styleId)) {
        const style = document.createElement("style");
        style.id = styleId;
        style.innerHTML = `
          @keyframes star-pulse {
            0%, 100% { opacity: 0.2; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.1); }
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  if (!isClient) {
    // Render a simplified version during SSR to prevent hydration mismatch
    return (
      <div className="relative isolate min-h-screen w-full transition-colors duration-700 bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white">
        {/* Simplified background for SSR */}
        <div className="pointer-events-none absolute inset-0 -z-30 bg-gradient-to-br from-gray-950 via-black to-gray-900" />
      </div>
    );
  }

  return (
    <div className={`relative isolate min-h-screen w-full transition-colors duration-700 ${theme === 'dark' ? 'bg-gradient-to-br from-gray-950 via-black to-gray-900 text-white' : 'bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50 text-neutral-950'}`}>
      <StarryBackground />
      {/* SpaceNavbar with consistent positioning */}
      <div className="pt-8 z-50 relative">
        <SpaceNavbar currentPath="/about" />
      </div>
      
      {/* Background with space elements */}
      <div
        className="pointer-events-none absolute inset-0 -z-30"
        style={{
          backgroundColor: theme === 'dark' ? '#040404' : '#f5f5f4',
          backgroundImage: [
            theme === 'dark' 
              ? 'radial-gradient(ellipse 80% 60% at 10% -10%, rgba(100,100,255,0.15), transparent 60%)' 
              : 'radial-gradient(ellipse 80% 60% at 10% -10%, rgba(100,100,255,0.12), transparent 60%)',
            theme === 'dark' 
              ? 'radial-gradient(ellipse 90% 70% at 90% -20%, rgba(100,255,255,0.12), transparent 70%)' 
              : 'radial-gradient(ellipse 90% 70% at 90% -20%, rgba(100,200,255,0.08), transparent 70%)',
            theme === 'dark' 
              ? 'linear-gradient(to bottom, rgba(70,70,255,0.05), transparent 30%)' 
              : 'linear-gradient(to bottom, rgba(100,150,255,0.05), transparent 30%)'
          ].join(', '),
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-20 opacity-80"
        style={{
          backgroundImage: theme === 'dark' 
            ? 'radial-gradient(circle at 25% 25%, rgba(250,250,250,0.08) 0.7px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(250,250,250,0.08) 0.7px, transparent 1px)' 
            : 'radial-gradient(circle at 25% 25%, rgba(17,17,17,0.12) 0.7px, transparent 1px), radial-gradient(circle at 75% 75%, rgba(17,17,17,0.08) 0.7px, transparent 1px)',
          backgroundSize: '12px 12px',
          backgroundRepeat: 'repeat',
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            theme === 'dark'
              ? 'radial-gradient(60% 50% at 50% 10%, rgba(100,150,255,0.18), transparent 70%)'
              : 'radial-gradient(60% 50% at 50% 10%, rgba(100,150,255,0.12), transparent 70%)',
          filter: 'blur(22px)',
        }}
      />
      
      {/* Floating stars */}
      {Array.from({ length: 100 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white animate-pulse"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            opacity: Math.random() * 0.7 + 0.3,
            animation: `twinkle ${Math.random() * 5 + 3}s infinite ${Math.random() * 2}s`
          }}
        />
      ))}

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 motion-safe:animate-[hero3-intro_1s_cubic-bezier(.22,.68,0,1)_forwards]">
        {/* We're using the fixed SpaceNavbar instead of individual buttons */}

        <main className="py-12">
          <div className="text-center mb-16 motion-safe:animate-[hero3-intro_1s_cubic-bezier(.22,.68,0,1)_forwards]">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-blue-400">Space Explorer</span>
            </h1>
            <p className={`text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
              A personal project combining space data with AI insights
            </p>
          </div>



          <div className={`rounded-3xl p-8 mb-12 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'} motion-safe:animate-[hero3-intro_1s_cubic-bezier(.22,.68,0,1)_forwards]`}>
            <h2 className="text-2xl font-bold mb-6">About the Developer</h2>
            <div className="flex flex-col md:flex-row gap-8">

              <div className="flex-1">
                <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Hi, I am <span className="font-semibold">irohayashi</span>, a passionate developer exploring the intersection of space science and artificial intelligence. 
                  This project combines real NASA data with enhanced insights to create a unique space exploration experience.
                </p>
                <p className={`mb-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  The Space Explorer project aims to make cosmic data more accessible and engaging through enhanced 
                  interpretations of astronomical phenomena.
                </p>
                
                <h3 className="text-xl font-semibold mb-4">Connect with me</h3>
                <div className="flex flex-wrap gap-3">
                  <a 
                    href="https://github.com/irohayashi" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      theme === 'dark' 
                        ? 'bg-white/10 hover:bg-white/20' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                  <a 
                    href="https://open.spotify.com/user/31l2tzmpqask5c5aw5z6vzsde734" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      theme === 'dark' 
                        ? 'bg-white/10 hover:bg-white/20' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <Music className="w-4 h-4" />
                    Spotify
                  </a>
                  <a 
                    href="https://www.instagram.com/irohayashiii" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      theme === 'dark' 
                        ? 'bg-white/10 hover:bg-white/20' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <Instagram className="w-4 h-4" />
                    Instagram
                  </a>
                  <a 
                    href="https://www.tiktok.com/@iroohayashiii" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 px-6 py-3 rounded-full text-base font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                      theme === 'dark' 
                        ? 'bg-white/10 hover:bg-white/20' 
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <Play className="w-4 h-4" />
                    TikTok
                  </a>
                </div>
              </div>
              

              <div className="flex-1 relative">
                {/* Full-width image container with aspect ratio */}
                <div className="relative w-full aspect-square rounded-xl overflow-hidden">
                  {/* Abstract geometric representation - centered */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-40 h-40">
                      {/* Central galaxy-like shape - larger */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 opacity-80"></div>
                      
                      {/* Spiral arms - larger */}
                      <div className="absolute top-1/2 left-1/2 w-48 h-48 rounded-full border-2 border-purple-400 border-opacity-30 transform -translate-x-1/2 -translate-y-1/2 rotate-45"></div>
                      <div className="absolute top-1/2 left-1/2 w-56 h-56 rounded-full border border-blue-400 border-opacity-20 transform -translate-x-1/2 -translate-y-1/2 rotate-15"></div>
                      
                      {/* Orbiting elements - faster animation */}
                      <div className="absolute top-1/4 left-1/2 w-4 h-4 rounded-full bg-blue-300 animate-spin" style={{ animationDuration: '5s', transform: 'translateX(-50%)', animationTimingFunction: 'linear' }}></div>
                      <div className="absolute top-1/2 left-3/4 w-3 h-3 rounded-full bg-purple-300 animate-spin" style={{ animationDuration: '7s', transform: 'translateY(-50%)', animationTimingFunction: 'linear', animationDirection: 'reverse' }}></div>
                      <div className="absolute top-3/4 left-1/3 w-2 h-2 rounded-full bg-pink-300 animate-spin" style={{ animationDuration: '6s', animationTimingFunction: 'linear' }}></div>
                    </div>
                    
                    {/* Floating stars */}
                    {Array.from({ length: 30 }).map((_, i) => (
                      <div
                        key={i}
                        className="absolute rounded-full bg-white animate-pulse"
                        style={{
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          width: `${Math.random() * 2 + 1}px`,
                          height: `${Math.random() * 2 + 1}px`,
                          opacity: Math.random() * 0.7 + 0.3,
                          animation: `star-pulse ${Math.random() * 3 + 2}s infinite`
                        }}
                      />
                    ))}
                  </div>
                  
                  {/* Opacity gradient fade effect - for mobile: from bottom toward text */}
                  <div className="md:hidden absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  
                  {/* Opacity gradient fade effect - for desktop: from right toward text */}
                  <div className="hidden md:block absolute inset-0 bg-gradient-to-l from-black/70 to-transparent" />
                  
                  {/* Border overlay */}
                  <div className="absolute inset-0 rounded-xl border border-white/10 mix-blend-overlay dark:border-white/20" />
                </div>
              </div>
            </div>
          </div>

          <div className={`rounded-3xl p-8 ${theme === 'dark' ? 'bg-white/5 border border-white/10' : 'bg-white border border-gray-200'} motion-safe:animate-[hero3-intro_1s_cubic-bezier(.22,.68,0,1)_forwards]`}>
            <h2 className="text-2xl font-bold mb-6">Technologies Used</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold mb-3">Frontend</h3>
                <ul className={`space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                    React with TypeScript
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                    Next.js App Router
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                    Tailwind CSS
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-blue-400' : 'bg-blue-500'}`}></div>
                    shadcn/ui Components
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-3">Data & AI</h3>
                <ul className={`space-y-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  <li className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-purple-400' : 'bg-purple-500'}`}></div>
                    NASA API Integration
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-purple-400' : 'bg-purple-500'}`}></div>
                    Cloudflare AI (Llama 3.1)
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-purple-400' : 'bg-purple-500'}`}></div>
                    Real-time Data Processing
                  </li>
                  <li className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${theme === 'dark' ? 'bg-purple-400' : 'bg-purple-500'}`}></div>
                    Content Caching System
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AboutPage;