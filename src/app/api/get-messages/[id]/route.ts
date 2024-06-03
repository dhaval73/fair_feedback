import dbconnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { User } from "next-auth";
import mongoose from "mongoose";

export async function GET(request: Request, { params :{id} }: { params: { id: string } }) {
    await dbconnect();
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
   console.log(id)

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
    const messageId = new mongoose.Types.ObjectId(id)
    // const userId = new mongoose.Types.ObjectId('6652e6432244c59c221b3b16');
    console.log(user);
    try {

        const user = await UserModel.aggregate([
            {
                $match: {
                    _id: userId
                }
            }, {
                $unwind: {
                    path: '$feedbacks',
                }
            },
            {
                $match: {
                    "feedbacks._id": messageId
                }
            }
            , {
                $project: {
                    messages: '$feedbacks.messages'
                }
            }, {
                $unwind: {
                    path: "$messages",
                }
            }, {
                $sort: {
                    'messages.createdAt': -1
                }
            }, {
                $group: {
                    _id: '$_id',
                    messages: {
                        $push: '$messages'
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
                messages: []
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
