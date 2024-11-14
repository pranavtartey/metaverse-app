import prisma from "@repo/db/client"
import { Request, Response } from "express";
import { CreateSpaceSchema } from "../types";

export const newSpace = async (req: Request, res: Response) => {
    try {

        const { data } = req.body
        const parsedData = CreateSpaceSchema.safeParse(data);

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
                height: parseInt(parsedData.data.dimensions.split("x")[1]),
                creatorId: req.userId!
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

export const getAll = async (req: Request, res: Response): Promise<void> => {
    console.log("hello")
    const allMaps = await prisma.map.findMany({
        where: {
            creatorId: req.userId
        }
    })
    console.log(allMaps);
    res.json({
        maps: allMaps
    })
}