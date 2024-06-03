"use client"
import React, { useState } from 'react'
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { messageSchema } from '@/schemas/messageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from '@/components/ui/use-toast'
import { ApiResponse } from '@/types/ApiResponse'
import axios from 'axios'
import { useParams } from 'next/navigation'
import { Label } from '@/components/ui/label'

const SendMessages = ({params}:any) => {
  const [sending, setSending] = useState(false)
  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues:{
      content:""
    }
  })
  const {reset}=form
  const username = params.username
  async function onSubmit(data: z.infer<typeof messageSchema>) {
    console.log(data)
    setSending(true)
    try {
      console.log({
        ...data,
        username
      });
      const res: ApiResponse = await axios.post('/api/send-message/',{
        ...data,
        username
      })
      console.log(res);
      
      if (res.data.success) {
        toast({
          variant: 'default',
          title: "Success",
          description: res.data.message,
        })
        reset()
      }
    } catch (error: any) {
      console.log(error.response.data);
      toast({
        variant: "destructive",
        title: "Failed",
        description: error.response.data.message,
      })
      console.error("Error sign-up : ", error)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className=' w-full md:pt-20  xl:px-64'>
      <div className="">
        <h1 className=' text-4xl'>Send Us Your Feedback</h1>
        <p>Please use the form below to send us your feedback. We appreciate hearing from you!</p>
      </div>
      <div className="mt-5">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 ">
            <FormField
              control={form.control}
              name='content'
              render={({ field }) => (
                <FormItem>
                  <Label>send message to <span className=' text-red-400'>@{username}</span> </Label>
                  <FormControl>
                    <Textarea placeholder="enter your message here" {...field} />
                  </FormControl>
                  <FormMessage  />
                </FormItem>
              )}
            />
            <Button
              variant="outline"
              disabled={sending}
            >
              {
                sending ?
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </>
                  : <>Send</>
              }
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default SendMessages