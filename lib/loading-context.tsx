"use client";

import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

interface LoadingCtx {
  isReady: boolean;
}

const LoadingContext = createContext<LoadingCtx>({ isReady: false });

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setIsReady(true), 1000);
    return () => clearTimeout(t);
  }, []);

  return (
    <LoadingContext.Provider value={{ isReady }}>
      {children}
    </LoadingContext.Provider>
  );
}

export const useLoading = () => useContext(LoadingContext);
