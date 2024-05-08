import { z } from 'zod';

export const contactSchema = z.object({
    fullname: z.string()
        .min(1, { message: 'Full name is required' })
        .max(30, { message: 'Full name not more than 30 characters' }),
    mobileno: z
        .string()
        .max(14, { message: 'Mobile no not more than 14' })
        .min(10, { message: 'Mobile no not less than 10' })
        .regex(/^(\+91[-\s]?)?[0]?(91[-\s])?(91)?\d{10}$/, { message: 'Invalid mobile number format' }),
    message: z
        .string({
            required_error: "Message is not empty"
        })
        .min(10, { message: 'Message must be at least 10 character long' })
        .max(300, { message: 'Message must not more then 300 character long' }),
})

