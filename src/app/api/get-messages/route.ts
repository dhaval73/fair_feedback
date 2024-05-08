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

    try {

        const user = await UserModel.aggregate([
            {
                $match: {
                    _id: userId
                }
            },
            {
                $unwind: "$messages"
            }, {
                $sort: {
                    "messages.createdAt": -1
                }
            }, {
                $group: {
                    _id: "$_id",
                    messages: {
                        $push: "$messages"
                    }
                }
            }
        ]
        ).exec();
        console.log(user);
        if (!user || user.length === 0) {
            return Response.json({
                success: false,
                message: 'No messages found',
                messages:[]
            }, {
                status: 200
            })
        }

        return Response.json({
            seccess: true,
            message: 'Messages found',
            messages: user[0].messages
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

