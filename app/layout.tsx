import type { Metadata } from "next";
import "./globals.css";
import ConditionalHeader from "@/components/ConditionalHeader";
import { ThemeProvider } from "@/contexts/ThemeContext";

export const metadata: Metadata = {
  title: "AI Movie Recommendations | Discover Your Next Favorite Film",
  description: "Find your perfect movie with AI-powered recommendations. Search by mood, genre, or describe what you're looking for in natural language.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-white dark:bg-black transition-colors duration-300">
        <ThemeProvider>
          <main className="min-h-screen bg-white dark:bg-black transition-colors duration-300">
            <ConditionalHeader />

            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}
