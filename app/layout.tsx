import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "sonner";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Donut Auto",
  description: "Automate your Canva designs with the help of AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
     <ConvexClientProvider>
               <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
              storageKey="donut-theme"
            >
                 <Toaster position="bottom-center" />
                 {children}

            </ThemeProvider>
       </ConvexClientProvider>
      </body>
    </html>
  );
}
