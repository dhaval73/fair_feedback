import { create } from 'zustand';

interface Message {
    _id: string;
    content: string;
    createdAt: Date;
}

interface Feedback {
    _id: string;
    title: string;
    slug: string;
    isAcceptingMessage: boolean | string;
    createdAt: Date;
    messages?: Message[] | null; // Allow null initially
}

interface FeedbackStore {
    feedbacks: Feedback[] | null;
    currentFeedbackId: string;
    setFeedbacks: (feedback: Feedback[]) => void;
    setFeedbackAcceptanceStatus: (feedbackId: string, status: boolean | string) => void
    addFeedback: (feedback: Feedback) => void;
    setMessagesToFeedback: (feedbackId: string, messages: Message[]) => void;
    deleteFeedback: (feedbackId: string) => void;
    setcurrentFeedbackId: (feedbackId: string) => void;
    getMessagesFromFeedback: (feedbackId?: string) => Message[] | null;
    deleteMessageFromFeedback: (messageId: string, feedbackId?: string) => void
}

const useFeedbackStore = create<FeedbackStore>((set, get) => ({
    feedbacks: null,
    currentFeedbackId: "",
    setFeedbacks: (feedbacks) => set({ feedbacks: feedbacks }),
    addFeedback: (feedback) => set((state) => ({ feedbacks: [feedback, ...state.feedbacks || []] })),
    setMessagesToFeedback: (feedbackId, messages) => set((state) => ({
        feedbacks: state.feedbacks?.map((feedback) => {
            if (feedback._id === feedbackId) {
                return {
                    ...feedback,
                    messages: messages || null, // Set messages or null if empty
                };
            }
            return feedback;
        }),
    })),
    setFeedbackAcceptanceStatus: (feedbackId, status) => set(state => ({
        feedbacks: state.feedbacks?.map((feedback) => {
            if (feedback._id === feedbackId) {
                return {
                    ...feedback,
                    isAcceptingMessage: status, // Set messages or null if empty
                };
            }
            return feedback;
        }),
    })),
    deleteFeedback: (feedbackId) => set((state) => ({
        feedbacks: state.feedbacks?.filter((feedback) => feedback._id !== feedbackId),
        currentFeedbackId: ""
    })),
    setcurrentFeedbackId: (feedbackId) => set((state) => ({
        currentFeedbackId: feedbackId
    })),
    getMessagesFromFeedback: (feedbackId) => (
        get().feedbacks?.find((feedback) =>
            feedback._id === (feedbackId || get().currentFeedbackId))?.messages || null
    ),

    deleteMessageFromFeedback: (messageId, feedbackId) => set(state => ({
        feedbacks: state.feedbacks?.map((feedback) => {
            if (feedback._id === (feedbackId || state.currentFeedbackId)) {
                return {
                    ...feedback,
                    messages: feedback.messages?.filter((message) => message._id !== messageId)
                };
            }
            return feedback;
        }),
    })),
}));

export default useFeedbackStore;
