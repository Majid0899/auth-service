import { Request,Response,NextFunction } from "express";
import {redisClient} from "../config/redis.ts"

const MAX_ATTEMPTS:number=Number(process.env.MAX_ATTEMPTS) || 5;
const BLOCK_TIME:number=Number(process.env.BLOCK_TIME) || 15*60 // 15 minutes


export const loginLimiter=async(
    req:Request,
    res:Response,
    next:NextFunction
)=>{
    const email=req.body.email
    const key= `login ${email}`
    try {
        const attempts=await redisClient.get(key);
        if(attempts && parseInt(attempts) >= MAX_ATTEMPTS){
            return res.status(429).json({
                success:false,
                error:`Too many login attempts. Please try again in ${BLOCK_TIME/60} minutes.`
            })
        }
        res.locals.loginKey=key;
        next()
        
    } catch (error) {
        return res.status(500).json({
            success:false,
            error:`Rate Limit Error`
        })
    }
}