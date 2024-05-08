'use client'
import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader } from './ui/card'
import axios from 'axios'
import { toast } from './ui/use-toast'
import useMessagesStore from '@/store/messagesStore'
import { Cross2Icon } from '@radix-ui/react-icons'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog'
import { Skeleton } from './ui/skeleton'
import { strict } from 'assert'


function MessageCard() {

    const messages = useMessagesStore((state) => state.messages)
    const setMessages = useMessagesStore((state) => state.setMessages)
    const deleteMessage = useMessagesStore((state) => state.deleteMessage)
    const [isloding, setIsloding] = useState(false)
    const [nomessages , setNoMessages]=useState(false)

    useEffect(() => {
        if (messages.length === 0 && !nomessages) {
            setIsloding(true);
            (async () => {
                try {
                    const res = await axios.get('api/get-messages')
                    if (res.data.seccess) {
                        console.log(res);
                        setMessages(res.data.messages)
                    }else{
                        console.log(res)
                        setNoMessages(true)
                        toast({
                            title:"message",
                            description:'No Feedbacks Founds 😊'
                        })
                    }
                } catch (error: any) {
                    console.log(error.response?.data?.message);
                    toast({
                        variant: 'default',
                        description: error.response?.data?.message
                    })
                } finally {
                    setIsloding(false)
                }
            })()
        }
    }, [setMessages, messages,setNoMessages,nomessages])

    const handelDelete = async (id: string) => {
        console.log(1234);
        try {
            const res = await axios.delete(`api/delete-message/${id}`)
            console.log(res);
            if (res) {
                deleteMessage(id)
                toast({
                    variant: 'default',
                    title: "Success",
                    description: res.data.message
                })
            }
        } catch (error: any) {
            toast({
                variant: 'destructive',
                title: "Error",
                description: error.response?.data?.message
            })
        }
    }

    function timeAgo(uploadDate: string): string {
        const currentDate: Date = new Date();
        const uploadDateObj: Date = new Date(uploadDate);
        const differenceInMilliseconds: number = currentDate.getTime() - uploadDateObj.getTime();
        const differenceInSeconds: number = Math.floor(differenceInMilliseconds / 1000);
    
        if (differenceInSeconds < 60) {
            return "just now";
        } else if (differenceInSeconds < 60 * 60) {
            const minutes: number = Math.floor(differenceInSeconds / 60);
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else if (differenceInSeconds < 60 * 60 * 24) {
            const hours: number = Math.floor(differenceInSeconds / (60 * 60));
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (differenceInSeconds < 60 * 60 * 24 * 7) {
            const days: number = Math.floor(differenceInSeconds / (60 * 60 * 24));
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (differenceInSeconds < 60 * 60 * 24 * 30) {
            const weeks: number = Math.floor(differenceInSeconds / (60 * 60 * 24 * 7));
            return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
        } else if (differenceInSeconds < 60 * 60 * 24 * 365) {
            const months: number = Math.floor(differenceInSeconds / (60 * 60 * 24 * 30));
            return `${months} month${months > 1 ? 's' : ''} ago`;
        } else {
            const years: number = Math.floor(differenceInSeconds / (60 * 60 * 24 * 365));
            return `${years} year${years > 1 ? 's' : ''} ago`;
        }
    }
    
  
    

    return (
        <div className=' grid md:grid-cols-2 xl:grid-cols-3 gap-3 mb-5'>
            {isloding && !nomessages ?
                Array.from({ length: 9 }).map((_, index) => (
                    <div key={index} className="">
                        <Skeleton className="h-[125px] w-full rounded-xl" />

                    </div>
                ))
                :
                messages?.map((message: { _id: string, content: string ,createdAt: string }) => (
                    <Card key={message._id!} className=' relative p-3 pr-6'>
                        <CardDescription>
                            {message.content}
                        </CardDescription>
                        <AlertDialog>
                            <AlertDialogTrigger>
                                <Cross2Icon className=' absolute right-3 top-2 opacity-50 hover:text-red-700 hover:font-bold hover:opacity-100' />
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
                                    <AlertDialogAction onClick={() => handelDelete(message._id)}>Continue</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                        <span className=' absolute bottom-2 left-3  text-sm font-thin'>
                        {timeAgo(message.createdAt)}        
                        </span>
                    </Card>
                ))
            }

        </div>
    )
}

export default MessageCard