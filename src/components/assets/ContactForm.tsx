'use client'
import React from 'react'
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { contactSchema } from "@/schemas/contactSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import axios from "axios"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"
import { Loader2 } from 'lucide-react'

function ContactForm() {
    const [sending, setSending] = useState(false)
const form = useForm<z.infer<typeof contactSchema>>({
  resolver: zodResolver(contactSchema),
  defaultValues: {
    fullname: "",
    mobileno: "",
    message: ""
  },
})

async function onSubmit(data: z.infer<typeof contactSchema>) {

  console.log(data)
  setSending(true)
  try {
    const res = await axios.post('/api/contact/',data)
    console.log(res)
    if (res.data.success){
      toast({
        variant:'default',
        description : 'Your Response send successfully'
      })
    }
  } catch (error:any) {
    console.log(error)
    toast({
      variant:'destructive',
      description:error.response.data.message
    })
  } finally{
    setSending(false)
  }
}
  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <FormField
        control={form.control}
        name="fullname"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Full name</FormLabel>
            <FormControl>
              <Input placeholder="Your full name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="mobileno"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Mobile no</FormLabel>
            <FormControl>
              <Input placeholder="+91 94088XXXXX" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="message"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Leave you message</FormLabel>
            <FormControl>
              <Textarea placeholder="enter your message" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <Button
        variant='outline'
        type="submit"
        disabled={sending}
      >
        {
          sending ? <>
           <Loader2 className=" mr-2 h-4 w-4 animate-spin" />
           Sending
          </> :
          'Submit'
        }
        
      
      </Button>
    </form>
  </Form>
  )
}

export default ContactForm