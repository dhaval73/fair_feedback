import HomeCarousel from "@/components/assets/HomeCarousel";
import { Metadata } from "next";
import Head from "next/head";
export const metadata: Metadata = {
  title: "Fair Feedback - Get Honest Feedback Anonymously",
  description: "Create public links and receive fair, anonymous feedback easily. Perfect for individuals and teams.",
  keywords: ["fair feedback", "anonymous feedback", "feedback tool", "nextjs app"],
  authors: [{ name: "Dhaval Dharaviya" }],
  robots: "index, follow",
};

export default async function Home() {
  return (
    <>
      <Head>
        <title>Fair Feedback - Get Honest Feedback Anonymously</title>
        <meta
          name="description"
          content="Create public links and receive fair, anonymous feedback easily. Perfect for individuals and teams."
        />
        <meta
          name="keywords"
          content="fair feedback, anonymous feedback, feedback tool, feedback app, nextjs"
        />
        <meta name="author" content="Dhaval Dharaviya" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div className="flex  flex-col items-center lg:justify-center  max-md:p-5 md:p-24">
        <section className="mt-5 py-2 xl:px-32 text-center">
          <h1 className=" text-2xl md:text-4xl  font-extrabold ">
            FairFeedback: Your Voice Matters
          </h1>
          <p className=" mt-2 md:mt-5">
            Welcome to FairFeedback, where your opinions are valued and heard.
            We believe in creating a platform where everyone can share their
            feedback in a fair and constructive manner. Whether it&apos;s about
            a product, service, experience, or idea, your input shapes the
            future. Join us in building a community based on honesty, respect,
            and fairness.
          </p>
        </section>
        <HomeCarousel />
      </div>
    </>
  );
}
