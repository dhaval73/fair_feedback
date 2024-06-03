
import HomeCarousel from "@/components/assets/HomeCarousel"

export default async function Home() {  
  return (
    <div className="flex  flex-col items-center lg:justify-center  max-md:p-5 md:p-24">
      <section className="mt-5 py-2 xl:px-32 text-center">
        <h1 className=" text-2xl md:text-4xl  font-extrabold ">
        FairFeedback: Your Voice Matters
        </h1>
        <p className=" mt-2 md:mt-5">
        Welcome to FairFeedback, where your opinions are valued and heard. We believe in creating a platform where everyone can share their feedback in a fair and constructive manner. Whether it&apos;s about a product, service, experience, or idea, your input shapes the future. Join us in building a community based on honesty, respect, and fairness.
        </p>
      </section>
     <HomeCarousel />
    </div>
  );
}
