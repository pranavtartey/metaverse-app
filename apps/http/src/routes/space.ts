import express from "express";
import { userMiddleware } from "../middleware";
import { getAll, newSpace } from "../controllers/space";


export const spaceRouter = express.Router();

spaceRouter.post("/new-space", userMiddleware, newSpace);
spaceRouter.get("/get-all", userMiddleware,getAll)