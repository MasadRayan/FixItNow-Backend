import express, { Application } from "express";

const app : Application = express();

app.get("/",(req, res) => {
    res.json({
        message: "Hello welcome to my project",
        author: "Masad Rayan"
    })
})


export default app