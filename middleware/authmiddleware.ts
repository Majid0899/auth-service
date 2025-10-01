import { Request, Response, NextFunction } from "express";
import { verifyaccessToken,payload } from "../utils/jwt.js";
import { JwtPayload } from "jsonwebtoken";


//Extend Express Request to include `user`
declare global {
  namespace Express {
    interface User extends JwtPayload{
    }
    interface Request {
      user?: Express.User;
    }
  }
}

const auth = {
  authenticate: async (req: Request, res: Response, next: NextFunction): Promise<Response | void> => {
    try {
      const authHeader = req.headers.authorization;

      if (!authHeader) {
        return res
          .status(400)
          .json({
            success: false,
            error: "Access denied. No token provided. Please login first.",
          });
      }

      const token: string = authHeader.split(" ")[1];
      if (!token) {
        return res
          .status(400)
          .json({
            success: false,
            error:
              "Malformed authorization header. Use 'Bearer <token>' format.",
          });
      }

      const decoded: payload = verifyaccessToken(token);
      req.user = decoded;

    
      next();
    } catch (error:unknown) {
        const err = error as any;
      if (err.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          error:"Session expired. Please login again.",
        });
      }

      if (err.name === "JsonWebTokenError") {
        return res.status(401).json({
          success: false,
          error: "Invalid token. Please login again.",
        });
      }

      return res.status(500).json({
        success: false,
        error: "Something went wrong while verifying token.",
      });
    }
  },

  authorizeRoles: (roles: Array<payload["role"]>) => {
    return (req: Request, res: Response, next: NextFunction): void | Response => {
      
      if (!req.user) {
        return res.status(401).json({ success: false, error: "Unauthorized" });
      }

      if (!roles.includes(req.user.role)) {
        return res
          .status(403)
          .json({ success: false, error: "Forbidden: Insufficient role" });
      }

      next();
    };

  }
};


export default auth