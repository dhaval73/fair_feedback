import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '@/components/ui/alert-dialog'
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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { FeedbackSchema } from "@/schemas/feedbackSchema";
import React, { useEffect, useState, useTransition } from "react"
import { Copy, Loader2, Loader2Icon } from "lucide-react"
import axios from "axios"
import { useDebounce } from "use-debounce"
import useFeedbackStore from "@/store/feedbacksStore"
import { ApiResponse } from "@/types/ApiResponse"
import { toast } from '@/components/ui/use-toast'

export default function FormDialog({
  name = "",
  feedback,
  className = "",
  children
}: {
  name: string,
  feedback?: any,
  className?: string,
  children?: React.ReactElement
}) {
  const [open, setOpen] = useState(false)
  const addFeedback = useFeedbackStore(state => state.addFeedback)
  const [pendingSubmit, submitTransection] = useTransition()
  const [pendingDelete, deleteTransection] = useTransition()
  const [slugFetchPending, slugFetchTransection] = useTransition()
  const [isAcceptMessaseUpdatePending, isAcceptMessaseUpdateTranseation] = useTransition()
  const [slugAvelabel, setSlugAvelabel] = useState<ApiResponse>({
    success: false,
    message: ""
  })
  const setFeedbackAcceptanceStatus = useFeedbackStore((state) => state.setFeedbackAcceptanceStatus)
  const deleteFeedbackStore = useFeedbackStore(state=>state.deleteFeedback)
  function generateSlug(title: string): string {
    
    return title
      .toLowerCase() // Convert to lowercase
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .trim() // Remove leading and trailing whitespace
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-'); // Replace multiple hyphens with a single hyphen
  }

  const form = useForm<z.infer<typeof FeedbackSchema>>({
    resolver: zodResolver(FeedbackSchema),
    defaultValues: {
      title: "",
      slug: "",
      isAcceptingMessage: "true"
    }
  })
  const { watch, setValue, reset } = form

  function onSubmit(data: z.infer<typeof FeedbackSchema>) {
    console.log(data);
    submitTransection(async () => {
      if (!feedback) {
        try {
          const res = await axios.post("api/create-feedback", data)
          console.log(res)
          if (res.data.success) {
            addFeedback(res.data.feedback)
            reset()
            setOpen(false)
            toast({
              variant: 'default',
              title: "Create success",
              description: res.data.message,
            })
          }
        } catch (error: any) {
          console.log(error.response.data)
          toast({
            variant: 'destructive',
            title: "Error",
            description: error.response?.data.message || "Error on Creating",
          })
        }
      }
    })

  }

  useEffect(() => {
    if (feedback) {
      reset({
        ...feedback, isAcceptingMessage: feedback.isAcceptingMessage.toString()
      })
    }
  }, [feedback, reset])


  const [title] = useDebounce(watch('title'), 500)
  useEffect(() => {
    if (!feedback) {
      console.log(title);
      const slug = generateSlug(title)
      setValue("slug", slug)
    }
  }, [title, setValue, feedback])

  const slug = watch("slug")
  useEffect(() => {
    // console.log(slug);
    slugFetchTransection(async () => {
      if (!feedback && slug) {
        try {
          const res = await axios.get(`/api/check-slug-unique/${slug}`)
          console.log(res)
          if (res.data) {
            setSlugAvelabel(res.data)
          }
        } catch (error: any) {
          console.log(error.response.data)
        }
      } else  {
        setSlugAvelabel({
          success: false,
          message: ""
        })
      }
    })

  }, [slug, feedback])

  const changeIsAcceptMessageStatus = (status: string) => {
    if (feedback) {
      console.log(status);
      isAcceptMessaseUpdateTranseation(async () => {
        try {
          const res = await axios.post('/api/accept-messages', {
            acceptmessage: status,
            id: feedback._id
          })
          if (res.data) {
            toast({
              title: "Sucess",
              description: "Status changed successfully",
              variant: "default"
            })
            setFeedbackAcceptanceStatus(feedback._id, status)
          }
        } catch (error:any) {
          setValue("isAcceptingMessage", `${!Boolean(status)}`)
          toast({
            title: "Error",
            description: error.response?.data.message,
            variant: "destructive"
          })
        }
      })
    }
  }

  const deleteFeedback = (feedbackId: string) => {
    deleteTransection(async()=>{
      try {
        const res = await axios.delete(`/api/delete-feedbacks/${feedbackId}`)
        if (res.data) {
          setOpen(false)
          deleteFeedbackStore(feedbackId)
          toast({
            title: "Sucess",
            description: res.data.message,
            variant: "default"
          })
        }
      } catch (error:any) {
        console.log(error)
        toast({
          title: "Error",
          description: error.response?.data.message || "somthing wents to wrong" ,
          variant: "destructive"
        })
      }
    })
  }



  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={className} variant="outline">{children || name}</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{name}</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when .
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-0 py-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>title</FormLabel>
                    <FormControl>
                      <Input
                        disabled={feedback && true}
                        defaultValue={field.value}
                        placeholder="title for feedback"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="Slug for feedback"
                        {...field} />
                    </FormControl>
                    {
                      slugAvelabel.message ? (
                        <label
                          className={`flex flex-row items-center ${slugAvelabel?.success ? ' text-green-500' : 'text-rose-500'}`}
                        >
                          {slugAvelabel?.message}
                          {slugFetchPending && <Loader2 className=" h-4 w-4 animate-spin"></Loader2>}
                        </label>
                      ) :
                        <FormMessage className="text-red-500" />
                    }
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="isAcceptingMessage"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={(status) => { field.onChange, changeIsAcceptMessageStatus(status) }}
                        defaultValue={field.value}
                        disabled={isAcceptMessaseUpdatePending}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="true">Is Accept Messages</SelectItem>
                          <SelectItem value="false">Is Not Accept Messages</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                {
                  feedback ?
                    <AlertDialog>
                      <AlertDialogTrigger>
                        <Button disabled={pendingDelete} type='button' variant='destructive'>
                          {pendingDelete && <>
                            <Loader2Icon className=" animate-spin" />
                            Please Wait
                          </> || 'Delete'
                          }
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your message
                            and remove your data from our servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteFeedback(feedback._id)}>Continue</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                    :
                    <Button disabled={pendingSubmit || !slugAvelabel.success} type="submit">
                      {pendingSubmit && <>
                        <Loader2Icon className=" animate-spin" />
                        Please Wait
                      </> || 'Create'
                      }
                    </Button>

                }
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
