import { Inter } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { neobrutalism } from "@clerk/themes";
import Header from "@/components/Header";
import { Toaster } from "@/components/ui/sonner";
const inter = Inter({
  subsets: ["latin"],
});


export const metadata = {
  title: "Servd - AI Recipes Platform",
  description: "AI Powered Recipes Glossary",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider
      appearance={{
        theme: neobrutalism,
      }}
    >
      <html lang="en">
        <body className={`${inter.variable}`}>
          <Header/>
          <main className="min-h-screen">{children}</main>
          <Toaster/>
          <footer className="py-8 px-4 border-t">
            <div className="max-w-6xl mx-auto flex justify-center items-center gap-6">
              <p className="text-stone-500 text-sm">Stay FoodiFy</p>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  );
}
