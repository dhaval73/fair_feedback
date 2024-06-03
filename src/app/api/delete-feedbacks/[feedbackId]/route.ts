import dbconnect from "@/lib/dbConnect";
import { User } from "next-auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import mongoose from "mongoose";
import UserModel from "@/models/User";

export async function DELETE(request:Request ,{ params }: { params: { feedbackId: string } }) {
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
    const feedbackId = new mongoose.Types.ObjectId(params.feedbackId);
    try {
        const updatedUser = await UserModel.updateOne({
            _id: userId,
        }, {
            $pull: {
                "feedbacks": {
                    _id: feedbackId
                }
            }
        })

        if (updatedUser.matchedCount == 0) {
            return Response.json({
                success: false,
                message: 'Fail to delete feedbacks'
            },{
                status: 400
            })
        }
        return Response.json({
            success: true,
            message: 'Feedback delete sucessfully'
        }, {
            status: 200
        })
    } catch (error) {
        return Response.json({
            seccuss: false,
            message: 'Faield to delete Feedback'
        }, {
            status: 500
        })
    }
};
