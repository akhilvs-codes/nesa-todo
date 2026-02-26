import express from "express";
import cors from "cors"
import dotev from "dotenv"
import todoRoutes from "@/src/routes/todo.routes"
dotev.config()
const app = express()


app.use(
  cors({
    origin: process.env.FRONTEND_URL,
  })
);

app.use(express.json());

app.use("/api/todos",todoRoutes)

export default app