import { resend } from "@/lib/resend";
import { ApiResponse } from "@/types/ApiResponse";
import VerificationEmail from "../../emails/VerificationEmail";

export async function sendVerificationEmail(
    username: string,
    email: string,
    verifyCode: string,
): Promise<ApiResponse> {
    console.log(username) //TODO remove this
    console.log(email)
    console.log(verifyCode)
    try {
        const data = await resend.emails.send({
            from: process.env.RESEND_EMAIL_FROM || 'onboarding@resend.dev',
            to: 'dadharaviya732002@gmail.com',
            subject: 'Fair Feedback | Verification code',
            react: VerificationEmail({
                username,
                otp: verifyCode,
            }),
        });

        if (data?.error) {
            console.log(data.error)
            return { success: false, message: data.error.message }
        }
        console.log(data)
        return { success: true, message: "Email sent successfully" }

    } catch (error: any) {
        return { success: false, message: error.message }
    }
}