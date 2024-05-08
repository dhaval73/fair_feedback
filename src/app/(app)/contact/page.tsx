"use client"
import { contactSchema } from "@/schemas/contactSchema"
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
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Loader2, Mail, Phone } from "lucide-react"
import axios from "axios"
import { toast } from "@/components/ui/use-toast"
import { useState } from "react"
const ContactPage = () => {
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
    <div className=' px-2  xl:px-56  lg:px-32 mt-16 mb-5 '>
      <div className="text-center ">
        <h1 className=' text-4xl  font-bold'>Contact Us</h1>
        <p className='mt-5'>Your input matters to Fair Feedback! We&#39;re eager to hear from you and improve our platform. </p>
      </div>
      <div className=" flex flex-row justify-center max-sm:items-center  gap-8 mt-5 border rounded-lg p-5 max-sm:flex-col max-w-screen-lg ">
        <div className=" w-1/2 max-sm:w-full  flex justify-center flex-col gap-8 max-sm:max-w-sm ">
          <p className="">Thank you for your interest in reaching out to us. Please use the following contact information or the form to get in touch with our team.</p>
         <div className="flex justify-center flex-col gap-4">
         <div className="flex flex-row items-center gap-3">
            <Phone/>
              <a href="tel:9408895506">+91 9408895506</a>
          </div>
          <div className="flex flex-row items-center gap-3">
            <Mail/>
              <a href="mailto:dadharaviya732002@gmail.com">dadharaviya732002@gmail.com</a>
          </div>
         </div>
        </div>
        <Separator className=" sm:hidden" />
        <div className=" max-w-sm w-1/2 max-sm:w-full">
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
        </div>
      </div>
    </div>
  )
}

export default ContactPage