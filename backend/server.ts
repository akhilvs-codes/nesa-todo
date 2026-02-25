

import app from "@/app"
import connectDB from "@/confiq/db";
import dotenv from "dotenv"

dotenv.config

connectDB()

app.listen(process.env.PORT, () => {
  console.log(`server running on port ${process.env.PORT}`)
});

