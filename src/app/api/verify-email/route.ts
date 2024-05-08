import dbconnect from '@/lib/dbConnect'
import {verifySchema} from '@/schemas/verifySchema'
import UserModel from '@/models/User'

export async function POST(request : Request){
    const {searchParams}= new URL(request.url)
    const username = searchParams.get('username')
    await dbconnect()
    try {
        const reqBody= await request.json()
        const validateBody = verifySchema.safeParse(reqBody)
        if(!validateBody.success){
            const formated = validateBody.error.format()
            console.log(formated)
            return Response.json({
                success : false,
                message : formated.code?._errors.join(" ")
            },{
                status: 400
            })
        }
        const {code} = validateBody.data
        console.log(code);
        console.log(username);
        const user = await UserModel.findOne({username})
        if(!user){
           return Response.json({
                success : false,
                message : "User not found"
            },{
                status: 404
            })
        }

        if(user.isVerified){
            return Response.json({
                success : false,
                message : "User already verified , please login"
            },{
                status: 400
            })
        }

        const isCodeNotExpire = new Date(user.verifyCodeExpire) > new Date()

        if(!isCodeNotExpire){
            return Response.json({
                success : false,
                message : "Code expired ,please re register to get new code"
            },{
                status: 400
            })
        }

        if((code === user.verifyCode) && isCodeNotExpire){
            user.isVerified = true
            await user.save()

            return Response.json({
                success : true,
                message : "User verified successfully"
            },
            {
                status: 200
            }
        )
        }

        return Response.json({
            success : false,
            message : "Invalid code"
        },{
            status: 200
        })

    } catch (error:any) {
        return Response.json({
            success: false,
            message: error.message
        },
        {
            status: 500
        })
    }
}