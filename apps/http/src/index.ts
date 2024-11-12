dotenv.config()
import dotenv from "dotenv"
import express from "express"
import router from "./routes";

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000

app.use("/api/v1/", router)

app.listen(PORT, () => {
    console.log("Hello from the http server")
})