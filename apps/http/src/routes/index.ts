import express from "express";
import { Signin, Signup } from "../controllers";
import { userMiddleware } from "../middleware";
import { spaceRouter } from "./space";

const router = express.Router();

router.post("/signup", Signup);
router.post("/signin", Signin);

router.use("/space", spaceRouter)

export default router;