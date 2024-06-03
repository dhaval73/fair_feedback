"use client"
import React, { useEffect, useTransition } from 'react'
import { Separator } from '@/components/ui/separator'
import useFeedbackStore from '@/store/feedbacksStore'
import axios from 'axios'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Check, ChevronsUpDown, RefreshCwIcon, Settings2} from "lucide-react"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import FormDialog from '@/components/assets/FeedbackForm'
import SherePublicLink from '@/components/assets/SherePublicLink'
import Messages from '@/components/assets/Messages'
import { toast } from '@/components/ui/use-toast'
function Dasboard(): React.ReactElement {

  // const user = userStore((state) => state.user);
  const setFeedbacks = useFeedbackStore((state) => state.setFeedbacks)
  const feedbacks = useFeedbackStore((state) => state.feedbacks)
  const [open, setOpen] = React.useState(false)
  // const [currentFeedbackId, setcurrentFeedbackId] = React.useState("")

  const currentFeedbackId=useFeedbackStore((state)=>state.currentFeedbackId)
  const setcurrentFeedbackId=useFeedbackStore(state=>state.setcurrentFeedbackId)
  const [messagesRefreshingingPending, messagesRefreshTransection] = useTransition()
  const setMessagesToFeedback = useFeedbackStore(state => state.setMessagesToFeedback)
  useEffect(() => {
    if (!feedbacks) {
      (async () => {
        console.log("api call");
        try {
          const res = await axios.get("/api/get-feedback-list")
          console.log(res.data)
          if (res.data.success) {
            console.log(res.data.feedbacks)
            setFeedbacks(res.data.feedbacks)
          }
        } catch (error) {
          console.log(error)
        }
      })();
    }
  }, [setFeedbacks, feedbacks])

  const refreshMessages = ()=>{
    messagesRefreshTransection(async () => {
      if (currentFeedbackId) {
          try {
              const res = await axios.get(`api/get-messages/${currentFeedbackId}`)
              if (res.data.seccess) {
                  console.log(res);
                  setMessagesToFeedback(currentFeedbackId, res.data.messages)
              } else {
                  setMessagesToFeedback(currentFeedbackId, res.data.messages)
                  console.log(res)
                  toast({
                      title: "message",
                      description: 'No Feedbacks Founds 😊'
                  })
              }
          } catch (error: any) {
              console.log(error.response?.data?.message);
              toast({
                  variant: 'default',
                  description: error.response?.data?.message
              })
          }
      }
  })
  }

  console.log(feedbacks)
  console.log(Array.isArray(feedbacks))
  return (
    <div className='  w-full flex flex-col px-1 xl:px-56 lg:px-40 md:px-12 max-md:px-24 max-sm:px-5 pt-14 '>
      <div className=" ">
        <h1 className=' font-extrabold text-4xl'>User Dasboard</h1>
      </div>
      <Separator className=' mt-5' />
      <div className="flex flex-row items-center gap-3 mt-5 ">
        <p className=' text-justify '>Welcome to your User Dashboard, where you can manage your feedback. Use the provided link to receive feedback from others and read the messages you&apos;ve received. Each feedback is clearly organized for easy review and response, helping you engage efficiently and improve continuously. Explore the dashboard to stay connected with your audience.</p>
      </div>
      <Separator className=' mt-5' />
      <div className="flex flex-row max-sm:flex-wrap-reverse gap-3 mt-5 ">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] pr-1 justify-between"
            >
              <p className='overflow-hidden'>
                {currentFeedbackId
                  ? feedbacks?.find((feedback) => feedback._id === currentFeedbackId)?.title
                  : "Select feedbacks..."}
              </p>
              <ChevronsUpDown className=" ml-1 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="Search feedbacks..." />
              <CommandList>
                <CommandEmpty>No feedbacks found.</CommandEmpty>
                <CommandGroup>
                  {feedbacks?.map((feedback) => (
                    <CommandItem
                      key={feedback._id}
                      value={feedback._id}
                      keywords={[feedback.title]}
                      onSelect={(FeedbackId) => {
                        setcurrentFeedbackId(FeedbackId)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          currentFeedbackId === feedback._id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {feedback.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {currentFeedbackId && 
        <>
        <Button 
        className=' size-10 p-2'
         variant='outline'
         onClick={refreshMessages}
         disabled={messagesRefreshingingPending} >
          { messagesRefreshingingPending ? <RefreshCwIcon className=' animate-spin'/> : <RefreshCwIcon/>}
          </Button>
        <FormDialog
          name="Update Feedback"
          feedback={feedbacks?.find((feedback) => feedback._id === currentFeedbackId)}
          className=' size-10 p-0'
        >
          <Settings2 />
        </FormDialog>
        <SherePublicLink 
          slug={feedbacks?.find((feedback) => feedback._id === currentFeedbackId)?.slug || ""}
        />
        </>
        }
        <span className=' ml-auto' />
        <FormDialog
          name="Create Feedback"
        />
      </div>
      <Separator className=' mt-5 mb-5' />
      <Messages/>
    </div>
  )
}

export default Dasboard