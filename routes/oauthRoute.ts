import { Router } from "express";
import passport from "passport";
import "../config/googleAuth.js";
import "../config/githubAuth.js";
import { handleGoogleLogin,handleGithubLogin } from "../controllers/userController.js";
const router = Router();

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/" }),
  handleGoogleLogin
);

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);
router.get(
  "/github/callback",
  passport.authenticate("github", { session: false, failureRedirect: "/" }),
  handleGithubLogin
);

export default router;
