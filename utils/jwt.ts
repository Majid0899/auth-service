import jwt, { JwtPayload } from 'jsonwebtoken'


const JWT_SECRET = process.env.JWT_SECRET || "supersecret";
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refreshsecret";


interface payload {
    id:number,
    name:string,
    role:"user" | "admin",
}


const generateToken=(user:payload):{accessToken:string,refreshToken:string}=>{

    const accessToken=jwt.sign({id:user.id,name:user.name,role:user.role},JWT_SECRET, { expiresIn: "30m" });

    const refreshToken = jwt.sign({ id: user.id,name:user.name,role: user.role },JWT_REFRESH_SECRET,{expiresIn: "7d" });

    return {accessToken,refreshToken}
}

const verifyaccessToken=(token:string):payload=>{
    const decoded=jwt.verify(token,JWT_SECRET) as JwtPayload
    return {
        id:decoded.id as number,
        name:decoded.name as string,
        role:decoded.role as "user" | "admin",
    }
}

const verifyrefreshToken=(token:string):payload & {exp?:number}=>{
    const decoded=jwt.verify(token,JWT_REFRESH_SECRET) as JwtPayload
    return {
        id:decoded.id as number,
        name:decoded.name as string,
        role:decoded.role as "user" | "admin",
        exp:decoded.exp
    }
}

export {generateToken,verifyaccessToken,verifyrefreshToken,payload}

