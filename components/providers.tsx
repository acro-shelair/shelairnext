"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { useState } from "react";
import { LoadingProvider } from "@/lib/loading-context";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <LoadingProvider>
          <Toaster />
          <Sonner />
          <Analytics />
          {children}
        </LoadingProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
