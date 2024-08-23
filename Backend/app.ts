import express from "express";
import dotenv from "dotenv"
dotenv.config()
const app = express();
import cors from "cors"
import userRoutes from './src/routes/userRoute'
import adminRoutes from './src/routes/adminRoute'
import doctorRoutes from './src/routes/doctorRoute'
import dbConnection from "./src/config/dbConnect";
dbConnection();



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: 'http://localhost:5173',
    methods:    'GET, POST, PUT, DELETE, PATCH',
    credentials: true
}))

app.use('/', userRoutes)
app.use('/admin', adminRoutes)
app.use('/doctor', doctorRoutes)

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server is Running on: http://localhost:${PORT}`))  