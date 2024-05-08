import dbconnect from "@/lib/dbConnect";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "next-auth";
import UserModel from "@/models/User";


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

    try {
        const updatedUser = await UserModel.updateOne({
            _id: userId
        }, {
            $pull: {
                messages: {
                    _id: params.messageId
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