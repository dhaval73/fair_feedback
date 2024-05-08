"use client"
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { AcceptMessageSchema } from '@/schemas/acceptMessageSchema'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useCallback, useEffect, useInsertionEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { User } from 'next-auth'
import { useSession } from 'next-auth/react'
import { Form, FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { toast } from '@/components/ui/use-toast'
import axios, { AxiosError } from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import MessageCard from '@/components/MessageCard'
import { Copy } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { usePathname } from 'next/navigation'


function Dasboard() {
  
  
 
  const { data: Session } = useSession()
  const [acceptMessageStatus, setAcceptMessageStatus] = useState(false)
  const [isAcceptingMessage, setIsAcceptingMessage] = useState(false)
  console.log(Session?.user);
  const user = Session?.user
  const form = useForm<z.infer<typeof AcceptMessageSchema>>({
    resolver: zodResolver(AcceptMessageSchema),
  })
  const { watch, setValue } = form
  console.log(watch('acceptmessage'));
  const baseUrl = location.origin
  const feedbackUrl = `${baseUrl}/u/${user?.username}`
  const copytoclipbord = async () => {
    
    await navigator.clipboard.writeText(feedbackUrl)
    toast({
      variant: 'default',
      description: 'Coppied Successfully'
    })
 
  }
  const changeIsacceptstatus = async () => {
    setAcceptMessageStatus(true)
    try {
      const res = await axios.post('/api/accept-messages', {
        acceptmessage: !isAcceptingMessage
      })
      console.log(res);
      if (res.data.seccess) {
        console.log(res.data.success);
        toast({
          variant: 'default',
          description: 'Status Updated Successfully'
        })
        setIsAcceptingMessage((prev) => !prev)
      } else {
        toast({
          variant: 'default',
          description: "Failed to update status"
        })
      }
    } catch (error) {
      toast({
        variant: 'default',
        description: 'Something went wrong'
      })
      console.log(error);
    } finally {
      setAcceptMessageStatus(false)
    }
  }

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get('api/accept-messages')
        if (res.data) {
          console.log(res);
          setValue('acceptmessage', res.data.isAcceptingMessage)
          setIsAcceptingMessage(res.data.isAcceptingMessage)
        }
      } catch (error) {
        console.log(error);
      }
    })()

  }, [setValue])




  return (
    <div className=' w-full flex flex-col px-1 xl:px-56 lg:px-40 md:px-12 max-md:px-24 max-sm:px-2 pt-14 '>
      <div className=" ">
        <h1 className=' font-extrabold text-4xl'>User Dasboard</h1>
      </div>
      <div className="flex flex-col gap-3 mt-5">
        <Label >This is your public link for recive feedback </Label>
        <div className="flex flex-row gap-3 relative">
          <Input
            className=' w-full pr-5'
            value={feedbackUrl}
            disabled />
          <Copy
            onClick={() => copytoclipbord()}
            className=' absolute right-3 top-2'
          />
        </div>
      </div>
      <div className="flex flex-row items-center gap-3 mt-5">
        <form className="flex flex-row items-center">
          <Switch
            id='accept-message'
            disabled={acceptMessageStatus}
            checked={isAcceptingMessage}
            onCheckedChange={changeIsacceptstatus}
          />
          <Label htmlFor='accept-message' className="ml-2">Accepting Message</Label>
        </form>
      </div>
      <Separator className=' mt-5' />
      <div className="flex flex-col gap-3 mt-5">
        <MessageCard />
      </div>
    </div>
  )
}

export default Dasboard