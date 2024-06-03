import useFeedbackStore from '@/store/feedbacksStore'
import React, { useEffect, useState, useTransition } from 'react'
import { toast } from '../ui/use-toast'
import axios from 'axios'
import { Card, CardDescription } from '@/components/ui/card'
import { Cross2Icon } from '@radix-ui/react-icons'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Skeleton } from '@/components/ui/skeleton'
const Messages = () => {

    const currentFeedbackId = useFeedbackStore(state => state.currentFeedbackId)
    const getMessagesFromFeedback = useFeedbackStore(state => state.getMessagesFromFeedback)
    const setMessagesToFeedback = useFeedbackStore(state => state.setMessagesToFeedback)
    const [messagesFetchingPending, messagesFetchTransection] = useTransition()
    const deleteMessageFromFeedback = useFeedbackStore(state => state.deleteMessageFromFeedback)
    const messages = getMessagesFromFeedback()
    useEffect(() => {
        messagesFetchTransection(async () => {
            if (messages == null && currentFeedbackId) {
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

    }, [currentFeedbackId, messages, setMessagesToFeedback])

    const handelDeleteMessage = async (id: string) => {
        try {
            const res = await axios.delete(`api/delete-message/${id}`)
            console.log(res);
            if (res) {
                deleteMessageFromFeedback(id)
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

    function timeAgo(uploadDate: string | Date): string {
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
        <>
        <div className=' grid md:grid-cols-2 xl:grid-cols-3 gap-3 mb-5'>
            {messagesFetchingPending ?
                Array.from({ length: 9 }).map((_, index) => (
                    <div key={index} className=' relative p-3 pr-6 h-[100px]'>
                        <Skeleton className=' w-full h-9 ' />  
                        <Skeleton className=' h-3 w-1/3 mt-2' />
                    </div>
                ))
                :
                messages?.length === 0 ? <>
                <h3 className=' text-lg'>No messages Found</h3>
                </>:
                messages?.map((message: { _id: string, content: string, createdAt: Date }) => (
                    <Card key={message._id} className=' relative p-3 pr-6 h-auto'>
                        <CardDescription className=' overflow-hidden'>
                            <p className=' w-full text-wrap'>
                            {message.content}
                            </p>
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
                                    <AlertDialogAction onClick={() => handelDeleteMessage(message._id)} >Continue</AlertDialogAction>
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
        </>

    )
}

export default Messages

