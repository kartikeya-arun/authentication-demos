if (process.env.NODE_ENV !== "prod") {
  require("dotenv").config();
}

import express from "express";
import cors from "cors";
import bcrypt from "bcrypt";
import initializePassport from "./passport-config";
import passport from "passport";
import session from "express-session";
import jwt from "jsonwebtoken";

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
    title: "Dadhich",
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

const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ");
  if (token === null) return res.sendStatus(401);

  jwt.verify(token[1], process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.status(401).json({ message: err });
    }
    req.user = user;
    next();
  });
};

// app.get("/posts", checkAuthenticated, (req, res) => {
app.get("/posts", authenticateToken, (req, res) => {
  res.json(posts);
});

const refreshTokens = <string[]>[];

app.get("/getNewAccessToken", (req, res) => {
  const refreshToken = req.body.token;
  if (!refreshToken) res.sendStatus(401);
  if (!refreshTokens.includes(req.body.token)) res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) res.sendStatus(403);
    const accessToken = jwt.sign(user?.name, process.env.ACCESS_TOKEN_SECRET);
    res.json({ accessToken });
  });
});

app.post("/login", async (req, res, next) => {
  const foundUser = users.find((user) => user.username === req.body.username);
  console.log(foundUser);
  if (
    foundUser &&
    (await bcrypt.compare(req.body.password, foundUser.password))
  ) {
    const accessToken = jwt.sign(
      req.body.username,
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "15s" },
    );
    return res.json({ message: "success", accessToken });
  } else {
    return res.status(401).json({ message: "Invalid username/password" });
  }
});

app.post("/register", async (req, res, next) => {
  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const newUser = { username: req.body.username, password: hashedPassword };
  users.push(newUser);
  const accessToken = jwt.sign(
    req.body.username,
    process.env.ACCESS_TOKEN_SECRET,
  );
  return res.json({ message: "success", accessToken });
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server listening on ${port}`);
});
