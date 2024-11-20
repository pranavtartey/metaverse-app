dotenv.config()
import dotenv from "dotenv"
import CORS from "cors"
import express from "express"
import router from "./routes";

const app = express();

app.use(express.json());
app.use(CORS())
const PORT = process.env.PORT || 3000

app.use("/api/v1", router)

app.listen(PORT, () => {
    console.log("Hello from the http server")
})