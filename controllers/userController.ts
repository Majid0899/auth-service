import { Request, Response } from "express";
import User from "../models/User.ts";
import { ValidationError } from "sequelize";
import { generateToken, verifyrefreshToken, payload } from "../utils/jwt.ts";
import { redisClient } from "../config/redis.ts";

interface RegisterUserBody {
  name: string;
  email: string;
  password: string;
  phone:string;
  role?: "user" | "admin";
}

interface ResponseBody{
  name:string,
  email:string,
  phone:string,
}

interface LoginUserBody {
  email: string;
  password: string;
}

interface RefreshTokenBody {
  refreshToken: string;
}

const handleRegisterUser = async (
  req: Request<{}, {}, RegisterUserBody>,
  res: Response
): Promise<Response> => {
  try {
    const { name, email, password, phone,role } = req.body;

    //Check if user already exist
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ success: false, error: "User already exists!" });
    }

    //create user
    await User.create({ name, email, password, phone,role });

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
): Promise<Response> => {
  try {
    const { email, password } = req.body;

    //Find user including password
    const user = await User.scope("withPassword").findOne({
      where: { email: email },
    });
    if (!user)
      return res
        .status(404)
        .json({
          success: false,
          error: "Invalid email Please enter valid email",
        });

    //compare password
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "Invalid Password Please enter valid password" });

    //payload for jwt
    const payload = {
      id: user.id,
      name: user.email,
      role: user.role,
    };

    //return accessToken,refreshToken
    const tokens = generateToken(payload);

    return res
      .status(200)
      .json({
        success: true,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: payload,
      });
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

const hanldeRefreshToken = async (
  req: Request<{}, {}, RefreshTokenBody>,
  res: Response
): Promise<Response> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res
        .status(401)
        .json({ success: false, error: "Refresh token required" });

    // check for blacklisted token
    const isBlacklisted = await redisClient.get(refreshToken);
    if (isBlacklisted)
      return res
        .status(403)
        .json({ success: false, error: "Token blacklisted" });

    const decode: payload = verifyrefreshToken(refreshToken);
    const user = await User.findByPk(decode.id);
    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });

    const tokens = generateToken({
      id: user.id,
      name: user.name,
      role: user.role,
    });

    return res
      .status(201)
      .json({
        success: true,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });
  } catch (error) {
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

const handleLogoutUser = async (
  req: Request<{}, {}, RefreshTokenBody>,
  res: Response
) : Promise<Response>=> {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res
        .status(401)
        .json({ success: false, error: "Refresh token required" });

    
    // Store in Redis blacklist until expiry
    const decoded  = verifyrefreshToken(refreshToken);
    

    if(!decoded.exp) return res.status(400).json({ success: false, error: "Invalid refresh token: no expiry" });
    
    // Calculate remaining lifetime (in seconds)
    const expiry : number = decoded.exp - Math.floor(Date.now() / 1000);
    

    if(expiry<=0) return res.status(400).json({success:false,error:"Invalid refresh token: no expiry"})
    
      //Block the token
    await redisClient.set(refreshToken, "blacklisted", { EX: expiry });

    return res.json({ message: "Logged out successfully" });
  } catch (error) {
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



const handleGoogleLogin=async(
  req:Request,
  res:Response
): Promise<Response>=>{
  try {

    const user = req.user as any;

    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    // Generate access & refresh tokens
    const tokens = generateToken(payload);

    return res.json({success:true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user:payload
    });
    
  } catch (error) {
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
}
  

const handleGithubLogin=async(
  req:Request,
  res:Response
) : Promise<Response>=>{
  try {
    const user = req.user as any;

    const payload = {
      id: user.id,
      name: user.name,
      role: user.role,
    };

    // Generate access & refresh tokens
    const tokens = generateToken(payload);

    return res.json({success:true,
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user:payload
    });
  } catch (error) {
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
}


const handleProfile=async(
  req:Request,
  res:Response
) :Promise<Response>=>{
  try {

    if(!req.user){
      return res.status(400).json({success:false,error:"Unauthorized"})
    }
    const user=await User.findByPk(req.user.id)

    return res.status(200).json({success:true,user})
    
  } catch (error) {
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
}


const handleListAllUser=async(
  req:Request,
  res:Response
):Promise<Response> =>{
  try {
    const allusers:User[]=await User.findAll();

    if(allusers.length===0){
      return res.status(200).json({success:true,message:"No users found"})
    }

    return res.status(200).json({success:true,allusers})
    
  } catch (error) {
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

}

export {
  handleRegisterUser,
  handleLoginUser,
  hanldeRefreshToken,
  handleLogoutUser,
  handleGoogleLogin,
  handleGithubLogin,
handleProfile,
handleListAllUser
};
