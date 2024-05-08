'use client'
import { signUpSchema } from "@/schemas/signUpSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import React, { useEffect, useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useDebouncedCallback } from 'use-debounce'
import axios from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"

export default function SignUp() {
    const { toast } = useToast()
    const router = useRouter()

    const form = useForm<z.infer<typeof signUpSchema>>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
        }
    })

    const [username, setUserrname] = useState('')
    const [usernameAvelabel, setUsernameAvelabel] = useState<ApiResponse>({
        success: true,
        message: ""
    })
    const debounceUsername = useDebouncedCallback(setUserrname, 500)
    debounceUsername(form.watch('username'))
    const [usernamefetching , setUsernameFetching]=useState(false)

    const [loding, setLoding] = useState(false)
    async function onSubmit(data: z.infer<typeof signUpSchema>) {
        console.log(data)
        setLoding(true)
        try {
            const res: ApiResponse = await axios.post('api/sign-up/', data)
            console.log(res);
            if (res.data.success) {
                toast({
                    variant: 'default',
                    title: "Sign-up success",
                    description: res.data.message,
                })
                router.replace(`verify-email/${username}`)
            }
        } catch (error: any) {
            console.log(error.response.data);
            toast({
                variant: "destructive",
                title: "Failed to sign-up user",
                description: error.response.data.message,
            })
            console.error("Error sign-up : ", error)
        } finally {
            setLoding(false)
        }
    }


    useEffect(() => {
        if (username !== "") {
            (async () => {
                setUsernameFetching(true)
                try {
                    console.log(username);
                    const res: ApiResponse = await axios.get(`api/check-username-unique?username=${username}`)
                    console.log(res);
                    setUsernameAvelabel(res.data)
                } catch (error) {
                    console.error('Error : checking username : ', error)
                }finally{
                    setUsernameFetching(false)
                }
            })()
        } else {
            setUsernameAvelabel({
                success: true,
                message: ""
            })
        }
    }, [username])
    
    return (
        <div className="flex justify-center items-center h-full w-full">
            <div className="w-full max-w-md p-8 space-y-8 shadow-md dark:shadow-2xl  dark:shadow-blue-800 rounded-3xl ">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        Join True Feedback
                    </h1>
                    <p className="mb-4">Sign up to start your anonymous adventure</p>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
                        <FormField
                            control={form.control}
                            name="username"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Your Name" {...field} />
                                    </FormControl>
                                    {
                                        usernameAvelabel.message ? (
                                            <label
                                                className={`flex flex-row items-center ${usernameAvelabel?.success ? ' text-green-500' : 'text-rose-500'}`}
                                            >
                                                {usernameAvelabel?.message}
                                                {usernamefetching && <Loader2 className=" h-4 w-4 animate-spin"></Loader2>}
                                            </label>
                                        ):
                                        <FormMessage className="text-red-500" />
                                    }
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                        <Input type="email" placeholder="your@email.com" {...field} />
                                    </FormControl>
                                    <FormMessage className="  text-red-500" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="password" {...field} />
                                    </FormControl>
                                    <FormMessage className="text-red-500" />
                                </FormItem>
                            )}
                        />
                        <Button
                            variant="outline"
                            disabled={loding}
                        >
                            {
                                loding ?
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </>
                                    :<>Sign Up</>
                            }
                        </Button>
                    </form>
                </Form>
                <div className="flex justify-between">
                    <p>Alredy have an account? please
                        <Link href='sign-in' className=" text-blue-500"> Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

