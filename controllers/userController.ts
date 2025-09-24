import { Request, Response } from "express";
import User from "../models/User.ts";
import { ValidationError } from "sequelize";
import {generateToken} from '../utils/jwt.ts'



interface RegisterUserBody {
  name: string;
  email: string;
  password: string;
  role?: "user" | "admin";
}

interface LoginUserBody {
  email: string;
  password: string;
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

const handleLoginUser = async (
  req: Request<{}, {}, LoginUserBody>,
  res: Response
): Promise<Response>=> {
  try {
    const { email, password } = req.body;

    //Find user including password
    const user=await User.scope('withPassword').findOne({where:{email:email}})
    if(!user) return res.status(404).json({success:false,error:"Invalid email Please enter valid email"})
    
    //compare password
    const isMatch=await user.comparePassword(password)
    if (!isMatch) return res.status(400).json({ message: "Invalid Password Please enter valid password" });

    //payload for jwt
    const payload={
        id:user.id,
        name:user.email,
        role:user.role
    }
    
    //return accessToken,refreshToken
    const tokens=generateToken(payload)

    return res.status(200).json({success:true,accessToken: tokens.accessToken,refreshToken: tokens.refreshToken,user:payload})


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



export { handleRegisterUser, handleLoginUser };