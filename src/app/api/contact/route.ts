import dbconnect from "@/lib/dbConnect";
import ContactModel from "@/models/Contact";
import { contactSchema } from "@/schemas/contactSchema";
import { z } from "zod";


export async function POST(request:Request) {
    await dbconnect();
    const reqBody = await request.json()
    try {
        const result = contactSchema.safeParse(reqBody)
        if (!result.success) {
            return Response.json({
                success: false,
                message: "Error to validate input fields"
            }, {
                status: 200
            })
        }
        const validatedData = result.data
        const newContact = new ContactModel({
            ...validatedData
        })
        const res = await newContact.save()

        if (res) {
        return Response.json({
            success:true,
            message : "Your response save sucessfully"
        },{
            status:200
        })
        }

        return Response.json({
            success:false,
            message:"error to save response"
        },{
            status:200
        })

    } catch (error:any) {
        return Response.json({
            success:false,
            message: "Internal server error"
        },{
            status:400
        })
    }
}