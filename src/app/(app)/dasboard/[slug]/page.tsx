'use client'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import React, { useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { toast } from '@/components/ui/use-toast'
import axios from 'axios'
import MessageCard from '@/components/assets/MessageCard'
import { Copy } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { userStore } from '@/store/userStore'


const DisplayMessages = (): React.ReactElement => {
    const { data: Session } = useSession()
    const [acceptMessageStatus, setAcceptMessageStatus] = useState(false)
    // const [isAcceptingMessage, setIsAcceptingMessage] = useState(false)
    const user = userStore((state) => state.user);
    const setUser = userStore(state => state.setUser)
    const [feedbackUrl, setFeedbackUrl] = useState('')
    useEffect(() => {
        if (!user && Session?.user) {
            console.log("user set : ", Session.user);
            setUser(Session.user)
            console.log("session : ", Session);
        }
    }, [Session, setUser, user])

    useEffect(() => {
        console.log(123);
        if (user?.isAcceptingMessage == undefined && user) {
            (async () => {
                try {
                    const res = await axios.get('api/accept-messages')
                    if (res.data) {
                        console.log("accept message : ", res);
                        // setIsAcceptingMessage(res.data.isAcceptingMessage)
                        setUser({ ...user, isAcceptingMessage: res.data.isAcceptingMessage })
                    }
                } catch (error) {
                    console.log(error);
                }
            })();
        }

    }, [setUser, user]);

    const copytoclipbord = async () => {
        if (navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(feedbackUrl);
                toast({
                    variant: 'default',
                    description: 'Copied Successfully'
                });
            } catch (error) {
                toast({
                    variant: 'destructive',
                    description: 'Failed to copy to clipboard'
                });
                console.error('Error copying to clipboard:', error);
            }
        } else {
            toast({
                variant: 'destructive',
                description: 'Clipboard API not available'
            });
            console.error('Clipboard API not available');
        }
    }
    const changeIsacceptstatus = async () => {
        setAcceptMessageStatus(true)
        try {
            const res = await axios.post('/api/accept-messages', {
                acceptmessage: !user?.isAcceptingMessage
            })
            console.log(res);
            if (res.data.seccess) {
                console.log(res.data);
                toast({
                    variant: 'default',
                    description: 'Status Updated Successfully'
                })
                // setIsAcceptingMessage((prev) => !prev)
                setUser({ ...user, isAcceptingMessage: !user?.isAcceptingMessage })
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
        setFeedbackUrl(`${location.origin}/u/${user?.username}`);
    }, [user]);

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
                        defaultChecked={user?.isAcceptingMessage}
                        checked={user?.isAcceptingMessage}
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

export default DisplayMessages




