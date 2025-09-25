import { Router } from "express";
import { handleRegisterUser,handleLoginUser,hanldeRefreshToken,handleLogoutUser} from "../controllers/userController.ts";


const router=Router()

router.post("/register",handleRegisterUser)
router.post("/login",handleLoginUser)
router.post("/refresh",hanldeRefreshToken)
router.post("/logout",handleLogoutUser)



export default router