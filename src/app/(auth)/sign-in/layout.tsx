import type { Metadata } from "next";


export const metadata: Metadata = {
  title: "Login - Fair Feedback",
  description: "Log in to your Fair Feedback account and start collecting honest feedback.",
  keywords: ["login fair feedback", "feedback account login"],
  robots: "noindex, nofollow", // Private page
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
