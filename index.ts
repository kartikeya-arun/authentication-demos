if (process.env.NODE_ENV !== "prod") {
  require("dotenv").config();
}

import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import initializePassport from "./passport-config";
import passport from "passport";
import session from "express-session";

const app = express();

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      sameSite: "lax",
      secure: false,
    },
  }),
);
app.use(passport.initialize());
app.use(passport.session());

const posts = [
  {
    username: "Arpit",
    title: "Hello",
  },
  {
    username: "Ajeet",
    title: "Content",
  },
];

const users: any[] = [];
initializePassport(passport, (username: string) =>
  users.find((user) => user.username === username),
);

const checkAuthenticated = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  return res.status(401).json({ message: "User must login first" });
};

app.get("/posts", checkAuthenticated, (req, res) => {
  res.json(posts);
});

app.post("/login", async (req, res, next) => {
  passport.authenticate("local", {}, (err: any, user: any, info: any) => {
    if (err) {
      return next(err);
    } else if (!user) {
      return res
        .status(401)
        .json({ message: info ? info.message : "Something went wrong" });
    } else {
      req.logIn(user, (err) => {
        if (err) {
          return next(err);
        }
        return res.json({ message: "success", user: user.username });
      });
    }
  })(req, res, next);
});

app.post("/register", async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = { username: req.body.username, password: hashedPassword };
  users.push(newUser);
  req.logIn(newUser, (err) => {
    if (err) {
      return next(err);
    }
    return res.json({ message: "success", user: newUser.username });
  });
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
