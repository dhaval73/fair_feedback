import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/contex/AuthProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Head from "next/head";

const inter = Inter({ subsets: ["latin"] });

// layout.tsx or (app)/layout.tsx
export const metadata: Metadata = {
  metadataBase: new URL("https://fair-feedback.vercel.app/"), // replace with your deployed domain
  title: "Fair Feedback",
  description: "Get honest feedback anonymously and securely with Fair Feedback.",
  keywords: ["Fair Feedback", "Anonymous Feedback", "Feedback App", "Public Feedback"],
  authors: [{ name: "Dhaval Dharaviya" }],
  manifest: "/site.webmanifest",
  icons: {
    icon: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "Fair Feedback",
    description: "Collect feedback from others anonymously using Fair Feedback.",
    url: "https://fair-feedback.vercel.app/",
    siteName: "Fair Feedback",
    images: [
      {
        url: "/fair-feedback.png",
        width: 1200,
        height: 630,
        alt: "Fair Feedback Banner",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fair Feedback",
    description: "A simple platform to get honest and anonymous feedback.",
    images: ["/fair-feedback.png"],
  },
};

export const viewport = {
  themeColor: "hsl(217.2, 32.6%, 17.5%)",
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
        <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Fair Feedback",
              url: "https://fair-feedback.vercel.app/",
              description: "Get honest feedback anonymously and securely with Fair Feedback.",
            }),
          }}
        />
      </Head>
      <AuthProvider>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <div className="flex flex-col min-h-screen w-full">
              <Navbar />
              <div className=" flex-grow h-full pt-14">
                {children}
              </div>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </body>
      </AuthProvider>
    </html>
  );
}
