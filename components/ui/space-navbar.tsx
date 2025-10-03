"use client";


import { useThemeSync } from "@/components/ui/hero-space";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, User, Compass } from "lucide-react";
import { ExpandableTabs } from "@/components/ui/expandable-tabs";
import { useState, useEffect } from "react";

interface SpaceNavbarProps {
  currentPath?: string;
}

const SpaceNavbar: React.FC<SpaceNavbarProps> = ({ currentPath = '' }) => {
  const [theme] = useThemeSync();
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const tabs = [
    { title: "Home", icon: Home },
    { title: "Explore", icon: Compass },
    { title: "About", icon: User },
  ];

  const handleNavigation = (index: number | null) => {
    if (index !== null) {
      const paths = ['/', '/explore', '/about'];
      if (index < paths.length) {
        window.location.href = paths[index];
      }
    }
  };

  // Don't render anything until mounted to avoid hydration issues
  if (!isMounted) {
    return (
      <header className="relative top-12 left-1/2 transform -translate-x-1/2 w-full max-w-4xl px-4 py-2">
        <div className="flex justify-center items-center">
          {/* Render a basic placeholder to maintain layout */}
          <div className="h-8 w-64 bg-transparent" />
        </div>
      </header>
    );
  }

  return (
    <header className="relative top-8 w-full px-4 sm:px-6 lg:px-8 pt-4">
      <div className={`max-w-7xl mx-auto flex justify-center`}>
        <ExpandableTabs 
          tabs={tabs} 
          className={`border rounded-2xl ${
            theme === 'dark' 
              ? 'bg-black/60 border-white/20' 
              : 'bg-white/90 border-gray-300'
          } min-w-[180px] max-w-sm backdrop-blur-sm`}
          activeColor={theme === 'dark' ? 'text-white' : 'text-gray-900'}
          onChange={handleNavigation}
        />
      </div>
    </header>
  );
};

export default SpaceNavbar;