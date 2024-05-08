"use client"

import * as React from "react"
import Link from "next/link"


import { cn } from "@/lib/utils"
// import { Icons } from "@/components/icons"
import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "./ui/button"
import { User } from "next-auth"
import { signOut, useSession } from "next-auth/react"
import { date } from "zod"
import { ModeToggle } from "./ModeToggle"
import { Cross1Icon, HamburgerMenuIcon } from "@radix-ui/react-icons"
import { Separator } from "./ui/separator"

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const toggelMenu = () => {
        setIsMenuOpen((prev) => prev ? false : true)
    }
    const { data: Session } = useSession()
    const user: User = Session?.user as User
    // console.log(user);


    return (
        <>
            <div className=" bg-background  flex flex-row items-center justify-between  w-full p-2 fixed top-0 right-0 z-10">
                <div className="font-bold text-xl max-md:pl-3 pl-24 max-md:12  pr-6 max-md:pr-2  order-1">
                    <h1 className=" text-nowrap"><Link href='/'>Fair Feedback</Link></h1>
                </div>
                <div className="max-md:flex hidden order-0 size-8 justify-center items-center"
                    onClick={() => toggelMenu()}
                >
                    <HamburgerMenuIcon
                        className={`${isMenuOpen && "hidden"} size-5`} />
                    <Cross1Icon className={`${!isMenuOpen && "max-md:hidden"} size-5`} />
                </div>
                <div className="w-full flex flex-row items-center justify-between max-md:justify-end order-2">
                    <div className={`text-xl    ${!isMenuOpen && ' max-md:hidden'}`}>
                        <NavigationMenu >
                            <NavigationMenuList
                                className=" max-md:flex-col items-start justify-start max-md:fixed max-md:w-[60%] max-md:h-full bg-background  top-14 left-0  "
                                onClick={() => toggelMenu()}
                            >
                                <NavigationMenuItem
                                    className=""
                                >
                                    <Link
                                        href="/"
                                        legacyBehavior passHref>
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                            Home
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link href="/dasboard" legacyBehavior passHref>
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                            Dasboard
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link href="/about" legacyBehavior passHref>
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                            About
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <Link href="/contact" legacyBehavior passHref>
                                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                            Contact
                                        </NavigationMenuLink>
                                    </Link>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
                    </div>
                    <div className=" flex items-center gap-5">
                        <p className=" max-md:hidden">
                            {user?.username}
                        </p>
                        {
                            user ?
                                <div>

                                    <Button
                                        variant='outline'
                                        onClick={() => signOut()}
                                    >
                                        Logout
                                    </Button>

                                </div>
                                :
                                <>
                                    <Link href='sign-in'>
                                        <Button
                                            variant='outline'
                                        >
                                            Login
                                        </Button>
                                    </Link>
                                </>
                        }
                        <ModeToggle />
                    </div>
                </div>
            </div>
        </>
    )
}


