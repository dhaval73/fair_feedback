import {z} from 'zod';

export const messageSchema = z.object({
    content : z
        .string({
            required_error:"Message is not empty"
        })
        .min(10, {message: 'Message must be at least 10 character long'})
        .max(300 , { message : 'Message must not more then 300 character long'}),
})