import dbconnect from "@/lib/dbConnect";
import mongoose from "mongoose";
import UserModel from "@/models/User";
import { getSession } from "next-auth/react";
import { Feedbacks } from "@/models/User";
import { useId } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
export async function POST(req: Request) {
    const { title, slug, isAcceptingMessage }:Feedbacks = await req.json()
    console.log({ title, slug, isAcceptingMessage });
    
    const session = await getServerSession(authOptions)
    const userId = new mongoose.Types.ObjectId(session?.user._id)
    console.log(session?.user._id);
    // const userId = new mongoose.Types.ObjectId('6652e6432244c59c221b3b16')
    if (!session || !userId) {
        console.log("Unauthenticated")
        return Response.json({
            success: false,
            message: 'Unauthenticate'
        }, {
            status: 401
        })
    }
    
    try {
        // Check if slug already exists
        const isSlugAlreadyExist = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: '$feedbacks' },
            { $match: { 'feedbacks.slug': slug } },
            { $count: 'count' }
        ]);

        if (isAcceptingMessage && isSlugAlreadyExist.length > 0 && isSlugAlreadyExist[0].count > 0) {
            return new Response(JSON.stringify({
                success: false,
                message: "Slug already exists",
            }), {
                status: 400,
            });
        }

        // Define new feedback
        const newFeedback = {
            title,
            slug,
            isAcceptingMessage,
            messages: [],
            createdAt: new Date(),
        };

        // Update user and return the updated document
        const res = await UserModel.findOneAndUpdate(
            { _id: userId },
            { $push: { feedbacks: newFeedback } },
            { new: true, projection: { 'feedbacks.messages': 0 } }
        );

        if (!res) {
            return Response.json({
                success: false,
                message: "User not found.",
            }, {
                status: 404,
            });
        }

        // Find the newly added feedback
        const addedFeedback = res.feedbacks.find(fb => fb.slug === slug);

        if (!addedFeedback) {
            return Response.json({
                success: false,
                message: "New feedback not found.",
            }, {
                status: 500,
            });
        }

        return Response.json({
            success: true,
            message: "Feedback created successfully",
            feedback: addedFeedback,
        }, {
            status: 201,
        });

    } catch (error) {
        console.error("Error creating feedback:", error);
        return Response.json({
            success: false,
            message: "Error creating feedback",
        }, {
            status: 500,
        });
    }
}