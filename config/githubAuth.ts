import passport from "passport";
import { Strategy as GitHubStrategy, Profile } from "passport-github2";
import User from "../models/User.ts"; 

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      callbackURL:
        process.env.GITHUB_CALLBACK_URL ||
        "http://localhost:5000/api/auth/github/callback",
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: (error: any, user?: any)=>void
    ): Promise<void> => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error("No email found in Github profile"));
        }

        // Check if user exists
        let user = await User.findOne({ where: { email } });

        if (!user) {
          // Create new user if not exists
          user = await User.create({
            name: profile.displayName || "Github User",
            email,
            password: "oauth_dummy_password",            
            role: "user",
          });
        }

        return done(null, user);
      } catch (error) {
        return done(error as Error, undefined);
      }
    }
  )
);

export default passport;
