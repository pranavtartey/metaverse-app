import prisma from "@repo/db/client"
import { Request, Response } from "express"
import { SigninSchema, SignupSchema } from "../types"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

export const Signup = async (req: Request, res: Response) => {
    try {
        const parsedData = SignupSchema.safeParse(req.body);

        if (!parsedData.success) {
            res.status(400).json({
                message: "Validation Error",
            })
            return
        }

        const existingUser = await prisma.user.findFirst({
            where: {
                username: parsedData.data.username,
            }
        })

        if (existingUser) {
            res.status(403).json({
                message: "User already exist :(",
            })
            return
        }

        console.log("This is your parsedData : ", parsedData)

        const hashPassword = await bcrypt.hash(parsedData.data.password, 10)

        const newUser = await prisma.user.create({
            data: {
                name: parsedData.data.name,
                username: parsedData.data.username,
                password: hashPassword
            }
        })

        const jwtSecret = process.env.JWT_SECRET as string;

        const token = jwt.sign({
            userId: newUser.id,
            username: newUser.username
        }, jwtSecret)

        res.status(200).json({
            token: `Bearer ${token}`,
            name: newUser.name
        })

        return

    } catch (error) {
        console.error("Something went wrong in the Signup controller : ", error)
    }

}

export const Signin = async (req: Request, res: Response) => {
    try {
        const parsedData = SigninSchema.safeParse(req.body);

        if (!parsedData.success) {
            res.status(401).json({
                message: "Invalid Credentials",
            })
            return
        }

        const user = await prisma.user.findFirst({
            where: {
                username: parsedData.data.username
            }
        })

        if (!user) {
            res.status(401).json({
                message: "Invalid Credentials"
            })
            return
        }

        const isValid = await bcrypt.compare(parsedData.data.password, user?.password)

        if (!isValid) {
            res.status(401).json({
                message: "Invalid Credentials",
            })
            return
        }

        const jwtSecret = process.env.JWT_SECRET as string

        const token = jwt.sign({
            userId: user.id,
            username: user.username
        }, jwtSecret);

        res.status(200).json({
            token: `Bearer ${token}`,
            name: user.name
        })

        return

    } catch (error) {
        console.error("Something went wrong in the signin controller : ", error)
    }
}