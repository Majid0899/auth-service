import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';

import {connectDB} from "./config/db.js"

import userRouter from "./routes/userRoute.ts"

dotenv.config();

connectDB()
const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;
const URL: string = process.env.URL || 'http://localhost';


app.use(express.json());
app.get('/', (req: Request, res: Response):void => {
  res.send('Welcome to Auth Service');
});

app.use("/api/auth",userRouter)

// Start server
app.listen(PORT, (): void => {
  console.log(`Server is running at ${URL}:${PORT}`);
});