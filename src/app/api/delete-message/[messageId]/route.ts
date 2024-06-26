import dbconnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import UserModel from "@/models/User";
import mongoose from "mongoose";


export async function DELETE(request: Request, { params }: { params: { messageId: string } }) {
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
    // const userId = new mongoose.Types.ObjectId('6652e6432244c59c221b3b16')
    const messageId = new mongoose.Types.ObjectId(params.messageId);
    try {
        const updatedUser = await UserModel.updateOne({
            _id: userId,
            'feedbacks.messages._id':messageId
        }, {
            $pull: {
                "feedbacks.$.messages": {
                    _id: messageId
                }
            }
        })
        if (updatedUser.matchedCount == 0) {
            return Response.json({
                success: false,
                message: 'Fail to delete message'
            },{
                status: 400
            })
        }
        return Response.json({
            success: true,
            message: 'message delete sucessfully'
        }, {
            status: 200
        })
    } catch (error) {
        return Response.json({
            seccuss: false,
            message: 'Faield to delete message'
        }, {
            status: 500
        })
    }
}