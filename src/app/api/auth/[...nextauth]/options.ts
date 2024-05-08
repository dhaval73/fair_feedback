import dbconnect from "@/lib/dbConnect";
import UserModel from "@/models/User";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" }
            },            
            async authorize(credentials: any): Promise<any> {
                dbconnect()
                try {
                    console.log("Sign in request come");
                    
                    const user = await UserModel.findOne({
                        $or: [
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })
                    if (!user) {
                        throw new Error("User not found")
                    }
                    if (!user.isVerified) {
                        throw new Error("User not verified")    
                    }

                    const isPasswordCorrect = await bcrypt.compare(credentials.password, user.password)
                    if (!isPasswordCorrect) {
                        throw new Error("pelase check your credential is currect")
                    }
                    return user

                } catch (err: any) {
                    throw new Error(err.message)
                }
            }

        })
    ],

    callbacks: {
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.username = token.username
                session.user.isVerified = token.isVerified
                session.user.isAcceptingMessage = token.isAcceptingMessage
            }
            return session
        },
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString()
                token.username = user.username
                token.isVerified = user.isVerified
                token.isAcceptingMessage = user.isAcceptingMessage
            }
            return token
        }
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: '/sign-in',
    }
}