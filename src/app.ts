import express, { Application } from "express";
import cors from "cors"
import cookieParser from "cookie-parser";
import { authRouter } from "./models/auth/auth.route";


const app : Application = express();

app.use(cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}))

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())


app.get("/",(req, res) => {
    res.json({
        message: "Hello welcome to my project",
        author: "Masad Rayan"
    })
})

app.use("/api/auth", authRouter)


export default app