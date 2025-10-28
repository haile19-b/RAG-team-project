import express from "express"
import dotenv from "dotenv"
import { ConnectDB } from "./lib/db.js";
import { embeddingRoure } from "./route/embedding.js";
import cors from "cors"

dotenv.config();

const PORT = process.env.PORT;

const app = express()

app.use(express.json());
app.use(cors())

app.get('/',(req,res)=>{
    res.status(201).json({
        message:"welcome to CSEC-ASTU AI !",
        successe:true
    })
})

app.use('/embedding',embeddingRoure)
// app.use('/ai',AiRoute)


app.listen(PORT,async()=>{
    ConnectDB()
    console.log(`🚀 Server is running on: http://localhost:${PORT}`)
})