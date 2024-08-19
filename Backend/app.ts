import express from "express";
import dotenv from "dotenv"
import './src/config/cronJob/cronJobs'
dotenv.config()
const app = express();
import cors from "cors"
import userRoutes from './src/routes/userRoute'
import dbConnection from "./src/config/dbConnect";
dbConnection();



app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods:    'GET, POST, PUT, DELETE',
    credentials: true
}))

app.use('/', userRoutes)

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is Running on: http://localhost:${PORT}`))