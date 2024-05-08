"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
} from "@/components/ui/input-otp"
import { toast } from "@/components/ui/use-toast"
import React, { useState } from 'react'
import { verifySchema } from "@/schemas/verifySchema"
import { Loader2 } from "lucide-react"
import axios from "axios"
import { ApiResponse } from "@/types/ApiResponse"
import { useRouter } from "next/navigation"

export default function Page({ params }: { params: { username: string } }) {
    const router = useRouter()
    const [verifying, setverifying] = useState(false)
    const form = useForm<z.infer<typeof verifySchema>>({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: "",
        },
    })

    async function onSubmit(data: z.infer<typeof verifySchema>) {

        setverifying(true)
        try {
            const res: ApiResponse = await axios.post(`/api/verify-email?username=${params.username}`, data)
            if (res.data.success) {
                toast({
                    title: "Success",
                    description: res.data.message
                })
                router.replace('/sign-in')
            } else {
                console.log(res.data);
                form.setError('code', { type: 'manual', message: res.data.message })
            }
        } catch (error: any) {
            console.error('Error otp verification', error);
            toast({
                variant: 'destructive',
                title: "Error",
                description: error.response.data.message,
            })
        } finally {
            setverifying(false)
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-slate-950 ">
            <div className="w-full max-w-md p-8 space-y-8  shadow-md dark:shadow-lg  dark:shadow-white/20 rounded-3xl bg-gray-850">
                <div className="text-center">
                    <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
                        verify your email
                    </h1>

                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 text-gray-300">

                        <FormField
                            control={form.control}
                            name="code"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>One-Time Password</FormLabel>
                                    <FormControl>
                                        <InputOTP maxLength={6} {...field}>
                                            <InputOTPGroup className="">
                                                <InputOTPSlot index={0} />
                                                <InputOTPSlot index={1} />
                                                <InputOTPSlot index={2} />
                                                <InputOTPSlot index={3} />
                                                <InputOTPSlot index={4} />
                                                <InputOTPSlot index={5} />
                                            </InputOTPGroup>
                                        </InputOTP>
                                    </FormControl>
                                    <FormDescription>
                                        Please enter the one-time password sent to your email.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button
                            variant="outline"
                            disabled={verifying}
                        >
                            {
                                verifying ?
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Please wait
                                    </>
                                    : <>Verify Otp</>
                            }
                        </Button>
                    </form>
                </Form>
            </div>
        </div>
    )
} 
