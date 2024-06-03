import { Copy, Share2 } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useEffect, useState } from "react"
import { userStore } from "@/store/userStore"
import { toast } from '@/components/ui/use-toast'
const SherePublicLink = ({slug}:{slug:string }) => {
    const user = userStore((state) => state.user);
    const [feedbackUrl, setFeedbackUrl] = useState('')
    const [open, setOpen] = useState(false)
    useEffect(() => {
        setFeedbackUrl(`${location.origin}/u/${user?.username}/${slug}`);
    }, [user,slug]);

    const copytoclipbord = async () => {
        if (navigator.clipboard) {
            try {
                await navigator.clipboard.writeText(feedbackUrl);
                toast({
                    variant: 'default',
                    description: 'Copied Successfully'
                });
                setOpen(false)
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

  return (
    <Dialog onOpenChange={setOpen} open={open} >
      <DialogTrigger asChild>
        <Button variant="outline" className=" size-10 p-2"><Share2/></Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share link</DialogTitle>
          <DialogDescription>
            Anyone who has this link will be able to send Feedback.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={feedbackUrl}
              readOnly
            />
          </div>
          <Button onClick={()=>copytoclipbord()} size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default SherePublicLink