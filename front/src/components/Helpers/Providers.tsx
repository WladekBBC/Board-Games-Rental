"use client";

import { ReactNode } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import { GamesProvider } from "@/contexts/GamesContext";
import { RentalsProvider } from "@/contexts/RentalsContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { UsersProvider } from "@/contexts/UsersContext";
import { LoadingProvider } from "@/contexts/LoadingContext";
import { OrdersProvider } from "@/contexts/OrdersContext";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <GamesProvider>
          <AuthProvider>
            <RentalsProvider>
              <UsersProvider>
                <OrdersProvider>
                  <LoadingProvider>{children}</LoadingProvider>
                </OrdersProvider>
              </UsersProvider>
            </RentalsProvider>
          </AuthProvider>
        </GamesProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}
