import { Request, Response } from "express";
import User from "../models/User.ts";
import { ValidationError } from "sequelize";




interface RegisterUserBody {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}



const handleRegisterUser = async (
  req: Request<{}, {}, RegisterUserBody>,
  res: Response
): Promise<Response> => {
  try {
    const { name, email, password, role } = req.body;

    //Check if user already exist
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists!" });
    }

    //create user
    await User.create({ name, email, password, role });

    return res.status(201).json({ success: true, message: "User is created." });
  } catch (error) {
    //Validation Error
    if (error instanceof ValidationError) {
      return res.status(400).json({
        success: false,
        errors: error.errors.map((e) => e.message),
      });
    }

    //Server Error
    if (error instanceof Error) {
      return res
        .status(500)
        .json({ success: false, error: `Server Error ${error.message}` });
    }

    //Unknown Server Error
    return res.status(500).json({
      success: false,
      error: "Unknown server error",
    });
  }
};





export { handleRegisterUser};