import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Sign Up - Join Fair Feedback",
  description: "Create your Fair Feedback account to collect honest feedback using public links.",
  keywords: ["signup", "register fair feedback", "create feedback account"],
  robots: "noindex, nofollow", // Prevents duplicate indexing of auth pages
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
