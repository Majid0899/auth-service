import { Router } from "express";
import { handleRegisterUser,handleLoginUser,hanldeRefreshToken} from "../controllers/userController.ts";


const router=Router()

router.post("/register",handleRegisterUser)
router.post("/login",handleLoginUser)
router.post("/refresh",hanldeRefreshToken)



export default router