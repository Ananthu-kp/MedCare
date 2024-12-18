import express from "express";
import dotenv from "dotenv"
import path from 'path'
dotenv.config()
const app = express();
import cors from "cors"
import morgan from 'morgan';
import userRoutes from './Routes/userRoute'
import adminRoutes from './Routes/adminRoute'
import doctorRoutes from './Routes/doctorRoute'
import dbConnection from "./Config/dbConnect";
import cookieParser from "cookie-parser";
import { errorHandler } from "./Middleware/errorHandler";
dbConnection();


app.use(morgan(':method :url :status :response-time ms'));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'Public')));
app.use('/Public', express.static(path.join(__dirname, '..', 'Public')));

app.use(cors({
    origin: 'http://localhost:5173',
    methods:    'GET, POST, PUT, DELETE, PATCH',
    credentials: true
}))

app.use('/', userRoutes)
app.use('/admin', adminRoutes)
app.use('/doctor', doctorRoutes)

//global error handler
app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is Running on: http://localhost:${PORT}`))  