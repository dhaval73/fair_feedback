import dbconnect from '@/lib/dbConnect'
import UserModel from '@/models/User'
import { getServerSession } from 'next-auth'
import { authOptions } from '../../auth/[...nextauth]/options'
import { User } from 'next-auth'
import mongoose from 'mongoose'

export async function GET(request: Request,{params}:{params:{slug:string}}) {
    await dbconnect()
    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;
    try {
        const userId = new mongoose.Types.ObjectId(user._id)
        // const userId = new mongoose.Types.ObjectId('6652e6432244c59c221b3b16')
        const {slug} = params
        
        const existingSlug = await UserModel.countDocuments({
            _id:userId,
            'feedbacks.slug' : slug
        })
        
        if (existingSlug > 0) {
            return Response.json({
                success: false,
                message: "Slug is already in use for this user."
            }, {
                status: 200
            })
        } else {
            return Response.json({
                success: true,
                message: "Slug is available for this user."
            }, {
                status: 200
            })

        }


    } catch (error: any) {
        console.log(error.message);
        return Response.json({
            success: false,
            message: "Error checking slug availability for user"
        },{
            status:400
        })
    }

}