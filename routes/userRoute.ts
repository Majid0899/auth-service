import { Router } from "express";
import { handleRegisterUser,handleLoginUser} from "../controllers/userController.ts";


const router=Router()

router.post("/register",handleRegisterUser)
router.post("/login",handleLoginUser)



export default router