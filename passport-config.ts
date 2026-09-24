import { Strategy } from "passport-local";
import bcrypt from "bcrypt";

export default function initialize(passport: any, getUserByUsername: any) {
  const authenticateUser = async (
    username: string,
    password: string,
    done: any,
  ) => {
    const user = getUserByUsername(username);

    if (!user) {
      return done(null, false, { message: "No user with that Username" });
    }

    try {
      if (await bcrypt.compare(password, user.password)) {
        return done(null, user);
      } else {
        return done(null, false, { message: "Password Incorrect" });
      }
    } catch (error) {
      done(error);
    }
  };
  passport.use(new Strategy(authenticateUser));
  passport.serializeUser((user: any, done: any) => done(null, user.username));
  passport.deserializeUser((username: string, done: any) =>
    done(null, getUserByUsername(username)),
  );
}
