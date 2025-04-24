
import { cn } from "@/lib/utils";
import React from "react";
import Navigation from "./Navigation";

interface PageLayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  className?: string;
}

export default function PageLayout({ 
  children, 
  fullWidth = false, 
  className 
}: PageLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Navigation />
      
      <main 
        className={cn(
          "flex-1 transition-all duration-200 ease-in-out",
          fullWidth ? "md:ml-64" : "md:ml-64 md:mr-0"
        )}
      >
        <div 
          className={cn(
            "p-6", 
            fullWidth ? "max-w-none" : "max-w-6xl mx-auto",
            className
          )}
        >
          {children}
        </div>
      </main>
    </div>
  );
}
