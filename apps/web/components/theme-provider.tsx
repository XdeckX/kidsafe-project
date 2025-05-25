"use client";

import * as React from "react";
import { ThemeProvider as NextThemes } from "next-themes";

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  // Use the updated import without typecasting
  return (
    <NextThemes attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange={false}>
      {children}
    </NextThemes>
  );
}
