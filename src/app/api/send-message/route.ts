import dbconnect from "@/lib/dbConnect";
import UserModel, { Message } from "@/models/User";


export async function POST(request: Request) {
    await dbconnect()
    const { username, content } = await request.json()
    try {
        const user = await UserModel.findOne({ 
            username 
            
        })
        if (!user) {
            return Response.json({
                success: false,
                message: "User not found"
            }, {
                status: 404
            })
        }else if(!user.isAcceptingMessage){
            return Response.json({
                success: false,
                message: "User not accepting message any more"
            }, {
                status: 404
            })
            
        }
        const message: Message = {
            content,
            createdAt: new Date()
        } as Message
        user.messages.push(message)
        await user.save()

        return Response.json({
            success: true,
            message: "Message sent succesfully"
        },{
            status: 200
        })
    } catch (error) {
        return Response.json({
            success: false,
            message: "Something went wrong"
        }, {
            status: 500
        })
    }
} 