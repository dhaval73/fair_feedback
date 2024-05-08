'use client'
import Image from "next/image";
import * as React from "react"
import Autoplay from "embla-carousel-autoplay"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

import features from '@/store/features.json'


export default function Home() {
  const plugin = React.useRef(
    Autoplay({ delay: 2000 })
  )
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
      <Carousel
        plugins={[plugin.current]}
        className="w-full max-w-lg mt-10"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.play}
      >
        <CarouselContent>
          {features.key_features.map((item, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Card>
                  <CardHeader>
                    {item.feature}
                  </CardHeader>
                  <CardContent className="flex  items-center justify-center p-6">
                    {item.description}
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className=" max-sm:hidden" />
        <CarouselNext className=" max-sm:hidden" />
      </Carousel>

    </div>
  );
}
