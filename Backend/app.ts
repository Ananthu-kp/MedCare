import express from "express";
import dotenv from "dotenv"
dotenv.config()
const app = express();
import cors from "cors"
import dbConnection from "./src/config/dbConnect";
dbConnection();


app.use(express.json());
app.use(cors())

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is Running on: http://localhost:${PORT}`))