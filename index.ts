import express, { Application, Request, Response } from 'express';
import dotenv from 'dotenv';
dotenv.config();

const app: Application = express();
const PORT: number = Number(process.env.PORT) || 3000;
const URL: string = process.env.URL || 'http://localhost';



app.get('/', (req: Request, res: Response):void => {
  res.send('Welcome to Auth Service');
});



// Start server
app.listen(PORT, (): void => {
  console.log(`Server is running at ${URL}:${PORT}`);
});