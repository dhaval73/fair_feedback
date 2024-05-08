import mongoose ,{Document ,Schema , Model} from "mongoose";

export interface Contact extends Document{
    fullname:String;
    mobileno:String;
    message:String;
}

const contactSchema:Schema<Contact> = new Schema({
    fullname:{
        type: String,
        required: [true, "Full name is required"],       
    },
    mobileno:{
        type: String,
        required: [true, "Mobile no. is required"], 
    },
    message:{
        type: String,
        required: [true, "Message is required"], 
    }
})
const ContactModel:Model<Contact> = (mongoose.models.Contact as Model<Contact>) || mongoose.model<Contact>('Contact',contactSchema)
export default ContactModel