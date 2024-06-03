import dbconnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/models/User";


export async function POST(request: Request) {
    await dbconnect()
    const { username, slug, content } = await request.json()
    console.log({ username, slug, content })
    try {
        const message:Message={
            content,
            createdAt: new Date()
        } as Message
        const userUpdateResult = await UserModel.updateOne(
            { 
                username, 
                "feedbacks.slug": slug, 
                "feedbacks.isAcceptingMessage": true 
            },
            { 
                $push: { "feedbacks.$.messages": message }
            }
        );
       console.log(userUpdateResult)
        if (userUpdateResult.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "User not found or not accepting messages"
            }, {
                status: 404
            })
        } else if(userUpdateResult.modifiedCount === 0) {
            return Response.json({
                success: false,
                message: "Invalid link"
            }, {
                status: 404
            })
        }
        return Response.json({
            success: true,
            message: "Message sent succesfully"
        }, {
            status: 200
        })
    } catch (error) {
        console.error("Error adding message:", error);
        return Response.json({
            success: false,
            message: "Something went wrong"
        }, {
            status: 500
        })
    }
} 

