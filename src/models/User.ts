import mongoose, { Document, Schema, Model } from "mongoose";
export interface Message extends Document {
    content: string;
    createdAt: Date;
}
const MessageSchema: Schema<Message> = new Schema({
    content: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export interface User extends Document {
    username: string;
    email: string;
    password: string;
    verifyCode: string;
    verifyCodeExpire: Date;
    isVerified: boolean;
    isAcceptingMessage: boolean;
    messages: Message[];
    createdAt: Date;
    updatedAt: Date;
}

const UserSchema: Schema<User> = new Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: true,
        trim: true,
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    verifyCode: {
        type: String,
        required: [true, "Verify code is required"],
    },
    verifyCodeExpire: {
        type: Date,
        required: [true, "Verify code expire is required"],
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isAcceptingMessage: {
        type: Boolean,
        default: true
    },
    messages: [MessageSchema],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
})

const UserModel: Model<User> = (mongoose.models.User as Model<User>) || mongoose.model<User>("User", UserSchema)
export default UserModel;