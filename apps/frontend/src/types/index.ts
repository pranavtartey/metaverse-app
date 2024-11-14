import { z } from "zod";

export const SignupFormSchema = z.object({
    name: z.string(),
    username: z.string(),
    password: z.string()
})
export const SigninFormSchema = z.object({
    username: z.string(),
    password: z.string()
})

export const CreateRoomSchema = z.object({
    name: z.string(),
    dimensions: z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/)
})