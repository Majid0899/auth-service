import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

export const sequelize = new Sequelize(
  process.env.DB_NAME as string,
  process.env.DB_USER as string,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: "mysql",
    logging: false, // set true if you want SQL logs
  }
);


export async function connectDB() {
  try {
    await sequelize.authenticate();
    console.log("Database connected successfully!");

    // Sync all defined models to the DB
    await sequelize.sync({ alter: true }); 
    // `force: true` drops & recreates, `alter: true` updates schema safely

  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
}

