import dbconnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function POST(request: Request) {
    await dbconnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user._id) {
        console.log("Unauthenticated")
        return Response.json({
            success: false,
            message: 'Unauthenticate'
        }, {
            status: 401
        })
    }
    const userId = user._id;
    const { acceptmessage } = await request.json()
    
    try {
        console.log(userId);
        console.log(acceptmessage);
        const updatedUser = await UserModel.findByIdAndUpdate(userId, {
            isAcceptingMessage : acceptmessage
        }, {
            new: true
        })
        console.log(updatedUser);
        if (updatedUser) {
            return Response.json({
                seccess:true,
                message:'message acepting update successfully',
                updatedUser
            },{
                status:200
            })
        }
        return Response.json({
            seccess:false,
            message:'message acepting update failed'
        },{
            status:400
        })
    } catch (error) {
        return Response.json({
            seccess:false,
            message:'message acepting update failed'
        },{
            status:400
        })
    }
}

export async function GET(request:Request){
    await dbconnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user._id) {
        console.log("Unauthenticated")
        return Response.json({
            success: false,
            message: 'Unauthenticate'
        }, {
            status: 401
        })
    }
    const userId = user._id
    try {
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return Response.json({
                success: false,
                message: 'User not found'
            }, {
                status: 404
            })
            
        }

        return Response.json({
            success: true,
            message: 'User found',
            isAcceptingMessage: foundUser.isAcceptingMessage
        }, {
            status: 200
        })
    } catch (error) {
        
    }
}
