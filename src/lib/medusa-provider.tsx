"use client";

import React from "react";
import { MedusaProvider } from "medusa-react";

type MedusaProviderProps = {
  children: React.ReactNode;
};

/**
 * This component provides the Medusa React hooks provider
 * to enable using Medusa hooks in client components.
 */
export default function MedusaClientProvider({ children }: MedusaProviderProps) {
  const queryClientConfig = {
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
        staleTime: 30000, // 30 seconds
        retry: 1,
      },
    },
  };

  const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "http://localhost:9000";

  return (
    <MedusaProvider
      queryClientProviderProps={queryClientConfig}
      baseUrl={baseUrl}
    >
      {children}
    </MedusaProvider>
  );
} 