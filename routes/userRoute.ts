import { Router } from "express";
import { handleRegisterUser} from "../controllers/userController.ts";


const router=Router()

router.post("/register",handleRegisterUser)




export default router