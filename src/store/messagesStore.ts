import { create } from 'zustand'

type State = {
    messages :[]
}
type Action = {
    setMessages: (messages:[]) => void,
    deleteMessage : (id:string) => void,
}

const useMessagesStore = create<State & Action>((set)=>({
    messages :[],
    setMessages: (messages:[]) => set(()=>({messages:messages})),
    deleteMessage: (id:string) => set((state :any)=>({
        messages: state.messages.filter((message:any)=>message._id !== id)
    })),
}))

export default useMessagesStore