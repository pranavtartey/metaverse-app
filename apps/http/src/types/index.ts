import z from "zod";

export const SignupSchema = z.object({
    name: z.string(),
    username: z.string(),
    password: z.string(),
})

export const SigninSchema = z.object({
    username: z.string(),
    password: z.string()
})

export const CreateSpaceSchema = z.object({
    name : z.string(),
    dimensions : z.string().regex(/^[0-9]{1,4}x[0-9]{1,4}$/)
})

declare global {
    namespace Express {
        export interface Request {
            userId?: string;
            username?: string;
        }
    }
}