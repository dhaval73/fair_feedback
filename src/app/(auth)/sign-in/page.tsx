'use client'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import React, { useState } from 'react'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Loader2 } from "lucide-react"
import { signInSchema } from "@/schemas/signInSchema"
import { signIn } from "next-auth/react"


export default function SignInPage() {
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: "",
    }
  })

  const [loding, setLoding] = useState(false)
  async function onSubmit(data: z.infer<typeof signInSchema>) {
    console.log(data)
    setLoding(true)
    try {
      const res = await signIn("credentials",{
        identifier : data.identifier,
        password : data.password,
        redirect : false,
        callbackUrl : "/dasboard"
      })
      console.log(res);
      if(res?.url){
        console.log("ok");
        router.replace('/dasboard')
      }else{ 
        toast({
          variant : 'destructive',
          title: "Error",
          description: res?.error,
        })
      }
    } catch (error) {
      console.log(error);
    }finally{
      setLoding(false)
    }
  }



  return (
    <div className="flex justify-center items-center h-full pt-24">
      <div className="w-full max-w-md p-8 space-y-8  shadow-md dark:shadow-2xl  dark:shadow-blue-800 rounded-3xl ">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">
            Sign in to True Feedback
          </h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
            <FormField
              control={form.control}
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email / Username</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="your@email.com / your123" {...field} />
                  </FormControl>
                  <FormMessage />
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
                  <FormMessage  />
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
                  : <>Sign In</>
              }
            </Button>
          </form>
        </Form>
        <div className="flex justify-between">
          <p>Have not an account? please
            <Link href='sign-up' className=" text-blue-500"> Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

