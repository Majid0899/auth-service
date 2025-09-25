// src/config/googleAuth.js
import passport from "passport";
import { Strategy as GoogleStrategy,Profile,VerifyCallback } from "passport-google-oauth20";

import User from "../models/User.js";



passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/api/auth/google/callback",
    },
    async (accessToken:string, refreshToken:string, profile:Profile, done:VerifyCallback) : Promise<void> => {
      try {
        const email=profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email found in Google profile"));
        }
        //Find existing user
        let user = await User.findOne({where :{ email: email}});

        if (!user) {
          // Create new user for OAuth
          user = await User.create({
            name: profile.displayName || "Google User",
            email,
            password: "oauth_dummy_password",
            role: "user",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error,undefined);
      }
    }
  )
);

// For session-less API
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await User.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
