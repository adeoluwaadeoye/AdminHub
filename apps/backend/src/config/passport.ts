import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { User } from "../modules/auth/auth.model";

// ── GOOGLE ─────────────────────────────────────────────────
passport.use(
  new GoogleStrategy(
    {
      clientID:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL:  process.env.GOOGLE_CALLBACK_URL!,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;

        if (!email) {
          return done(new Error("No email returned from Google"));
        }

        // find existing user or create new one
        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name:     profile.displayName || "Google User",
            email,
            password: Math.random().toString(36).slice(-16), // never used
            avatar:   profile.photos?.[0]?.value || "",
            provider: "google",
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

// ── GITHUB ─────────────────────────────────────────────────
passport.use(
  new GitHubStrategy(
    {
      clientID:     process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
      callbackURL:  process.env.GITHUB_CALLBACK_URL!,
      scope:        ["user:email"],
    },
    async (
      _accessToken: string,
      _refreshToken: string,
      profile: any,
      done: (err: Error | null, user?: Express.User | false) => void
    ) => {
      try {
        // GitHub may return multiple emails — pick the primary one
        const email =
          profile.emails?.find((e: { primary: boolean; email: string }) => e.primary)?.email ||
          profile.emails?.[0]?.value ||
          `${profile.username}@github.noreply.com`;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            name:     profile.displayName || profile.username || "GitHub User",
            email,
            password: Math.random().toString(36).slice(-16), // never used
            avatar:   profile.photos?.[0]?.value || "",
            provider: "github",
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err as Error);
      }
    }
  )
);

export default passport;