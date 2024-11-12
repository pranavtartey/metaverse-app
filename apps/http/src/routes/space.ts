import express from "express";
import { userMiddleware } from "../middleware";
import { newSpace } from "../controllers/space";


const spaceRouter = express.Router();

spaceRouter.post("/new-space", userMiddleware, newSpace);