import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Dashboard - Manage Your Feedback | Fair Feedback",
  description: "Access your personal dashboard to create public feedback links and manage responses securely.",
  keywords: ["dashboard", "feedback dashboard", "manage feedback", "user dashboard"],
  authors: [{ name: "Dhaval Dharaviya" }],
  robots: "noindex, nofollow", // Prevents indexing private user pages
  alternates: {
    canonical: "https://fair-feedback.vercel.app/dasboard",
  }
};



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (<>
    {children}
  </>
  );
}
