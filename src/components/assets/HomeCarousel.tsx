'use client'
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

const HomeCarousel = () => {
    React.useEffect(()=>{
        console.log("home corousol")
    },[])
    const plugin = React.useRef(
        Autoplay({ delay: 5000 })
    )
    return (
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
    )
}

export default HomeCarousel