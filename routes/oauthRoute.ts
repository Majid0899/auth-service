import { Router } from "express";
import passport from "passport";
import "../config/googleAuth.ts"
import {handleGoogleLogin} from '../controllers/userController.ts'
const router=Router()


router.get("/google",passport.authenticate('google',{scope:['profile','email']}))
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  handleGoogleLogin
)

export default router