import { z } from 'zod'
import { usernameValidation } from '@/schemas/signUpSchema'
import dbconnect from '@/lib/dbConnect'
import UserModel from '@/models/User'

const UsernaemQuerySchema = z.object({
    username: usernameValidation
})

export async function GET(request: Request,{params}:{params:{username:string}}) {
    await dbconnect()
    try {
        
        
        const result = UsernaemQuerySchema.safeParse(params)
        console.log(params.username)
        console.log(result);

        if (!result.success) {
            const usernameErrors = result.error.format().username?._errors || [];
            return Response.json({
                success: false,
                message: usernameErrors.length > 0 ? usernameErrors.join(", ") : "Error while checking username"
            }, {
                status: 200
            })
        }

        const { username } = result.data
        console.log(username)
        const existingVerifiedUser = await UserModel.findOne({
            username,
            isVerified: true
        })

        if (existingVerifiedUser) {
            return Response.json({
                success: false,
                message: "Username already taken"
            }, {
                status: 200
            })
        } else {
            return Response.json({
                success: true,
                message: "Username available"
            }, {
                status: 200
            })

        }


    } catch (error: any) {
        console.log(error.message);
        return Response.json({
            success: false,
            message: "Error while checking username"
        },{
            status:400
        })
    }

}