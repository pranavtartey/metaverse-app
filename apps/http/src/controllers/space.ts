import prisma from "@repo/db/client"
import { Request, Response } from "express";
import { CreateSpaceSchema } from "../types";

export const newSpace = async (req: Request, res: Response) => {
    try {
        const parsedData = CreateSpaceSchema.safeParse(req.body);

        if (!parsedData.success) {
            res.status(400).json({
                message: "Validation Failed"
            })

            return
        }

        const map = await prisma.map.create({
            data: {
                name: parsedData.data.name,
                width: parseInt(parsedData.data.dimensions.split("x")[0]),
                height: parseInt(parsedData.data.dimensions.split("x")[1])
            }
        })

        res.status(200).json({
            mapId: map.id
        })

        return

    } catch (error) {
        console.error("Something went wrong in the newSpace controller : ", error)
    }
}