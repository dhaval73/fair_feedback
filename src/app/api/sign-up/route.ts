import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import dbconnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    await dbconnect();
    try {
        const { username, email, password } = await request.json();
        console.log(username);
        const existingUserByUsername = await UserModel.findOne({
            username,
            isVerified: true
        })
        if (existingUserByUsername) {
            return Response.json({
                success: false,
                message: "User already exists"
            }, {
                status: 400
            })
        } 
        await UserModel.findOneAndDelete({
            username,
            email: {
                $ne: email
            },
            isVerified: false
        })
        const existingUserByEmail = await UserModel.findOne({email})

        if (existingUserByEmail?.isVerified) {
            return Response.json({
                success: false,
                message: "User with same email is exists"
            }, {
                status: 400
            })
        }
        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();
        const verifyCodeExpire = new Date();
        verifyCodeExpire.setHours(verifyCodeExpire.getHours() + 1);
        const hashedPassword = await bcrypt.hash(password, 10);
        if (existingUserByEmail) {
            {
                existingUserByEmail.username = username
                existingUserByEmail.email = email
                existingUserByEmail.password = hashedPassword
                existingUserByEmail.verifyCode = verifyCode
                existingUserByEmail.verifyCodeExpire = verifyCodeExpire
                await existingUserByEmail.save()
            }
        } else {
            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpire,
                isVerified: false,
                feedbacks:[]
            })
            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(username, email, verifyCode)
        if (!emailResponse.success) {
            console.log(emailResponse.message)
            return Response.json({
                success: false,
                message: emailResponse?.message || "send verification email failed ,please try agail later"
            }, {
                status: 201
            })
        }

        return Response.json({
            success: true,
            message: "User register successfully , please check email for verification code"
        }, {
            status: 201
        })

    } catch (error) {
        return Response.json({
            success: false,
            message: "User register failed with unknown error"
        }, {
            status: 500
        })
    }
}