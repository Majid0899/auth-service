import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
import passport from "passport";

//Database connection import
import {connectDB} from "./config/db.js"

//Routes import
import userRouter from "./routes/userRoute.js"
import oauthRouter from "./routes/oauthRoute.js"

dotenv.config();
connectDB()

const app: Application = express();

const PORT: number = Number(process.env.PORT) || 3000;
const URL: string = process.env.URL || 'http://localhost';

//middlewares
app.use(express.json());
app.use(passport.initialize());

//Base Route
app.get('/', (req: Request, res: Response):void => {
  res.send('Welcome to Auth Service');
});

//Register Routes
app.use("/api/auth",userRouter)
app.use("/api/auth",oauthRouter)

// Start server
app.listen(PORT, (): void => {
  console.log(`Server is running at ${URL}:${PORT}`);
});