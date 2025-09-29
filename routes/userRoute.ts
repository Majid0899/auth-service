import { Router } from "express";
import { handleRegisterUser,handleLoginUser,hanldeRefreshToken,handleLogoutUser,handleProfile,handleListAllUser} from "../controllers/userController.ts";
import auth from '../middleware/authmiddleware.ts'
import {loginLimiter} from "../middleware/loginLimiter.ts"
const router=Router()

router.post("/register",handleRegisterUser)
router.post("/login",loginLimiter,handleLoginUser)
router.post("/refresh",hanldeRefreshToken)
router.post("/logout",handleLogoutUser)


//Protected Example
router.get("/profile",auth.authenticate,handleProfile)

//Admin only Route
router.get("/users",auth.authenticate,auth.authorizeRoles(["admin"]),handleListAllUser)

export default router