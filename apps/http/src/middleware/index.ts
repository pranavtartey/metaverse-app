import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

interface DecodedType {
    userId: string;
    username: string;
}

export const userMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const header = req.headers["authorization"]
    const token = header?.split(" ")[1];

    console.log(token);

    if (!token) {
        res.status(403).json({
            //403 is forbidden request
            message: "Unauthorized"
        })
        return
    }

    try {
        const jwtSecret = process.env.JWT_SECRET as string

        const decoded  = jwt.verify(token, jwtSecret) as DecodedType;

        req.userId = decoded.userId;
        req.username = decoded.username;
        next();

    } catch (error) {
        console.error("Something went wrong in the userMiddleware : ", error)
    }

}