import dbconnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request) {
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

    const userId = new mongoose.Types.ObjectId(user._id);
 
    console.log(user);
    try {

        const user = await UserModel.findOne(
            { _id: userId },
            { 
                "feedbacks.messages": 0 ,
            }
        );
        console.log(user);
        if (!user) {
            return Response.json({
                success: false,
                message: 'No messages found',
                feedbacks:[]
            }, {
                status: 200
            })
        }
        return Response.json({
            success: true,
            message: 'Messages found',
            feedbacks: user.feedbacks.sort((a:any, b:any) => b.createdAt - a.createdAt)
        }, {
            status: 200
        })

    } catch (error) {
        return Response.json({
            success: false,
            message: 'Something went wrong'
        }, {
            status: 500
        })
    }
}

