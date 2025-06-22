import { Request, Response, NextFunction } from "express";
import axios from "axios";
import jwt from "jsonwebtoken";
import 'dotenv/config';

// Expect these in your .env file
const {
  DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET,
  DISCORD_REDIRECT_URI,
  JWT_SECRET,
  FRONTEND_URL,
} = process.env;

if (!process.env.DISCORD_CLIENT_ID || !process.env.DISCORD_CLIENT_SECRET || !process.env.DISCORD_REDIRECT_URI) {
  console.error('Missing Discord OAuth environment variables');
  throw new Error('DISCORD_CLIENT_ID, DISCORD_CLIENT_SECRET, and DISCORD_REDIRECT_URI must be set in .env');
}

// 1) Redirect to Discord’s OAuth2 server
export const discordLogin = (req: Request, res: Response): void => {
  const scope = "identify email";
  const authorizeUrl =
    `https://discord.com/api/oauth2/authorize` +
    `?client_id=${DISCORD_CLIENT_ID}` +
    `&redirect_uri=${encodeURIComponent(DISCORD_REDIRECT_URI!)}` +
    `&response_type=code` +
    `&scope=${encodeURIComponent(scope)}`;
  res.redirect(authorizeUrl);
};

// 2) Handle callback: exchange code for access token, fetch user, issue JWT, set cookie
export const discordCallback = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const code = req.query.code as string;
  if (!code) {
    res.status(400).send("No code provided");
    return;
  }
  try {
    // Exchange code for token
    const tokenRes = await axios.post(
      "https://discord.com/api/oauth2/token",
      new URLSearchParams({
        client_id: DISCORD_CLIENT_ID!,
        client_secret: DISCORD_CLIENT_SECRET!,
        grant_type: "authorization_code",
        code,
        redirect_uri: DISCORD_REDIRECT_URI!,
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    const { access_token } = tokenRes.data;
    // Fetch user info
    const userRes = await axios.get("https://discord.com/api/users/@me", {
      headers: { Authorization: `Bearer ${access_token}` },
    });
    const user = userRes.data;

    // Create JWT containing Discord user data
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        avatar: user.avatar,
        email: user.email,
      },
      JWT_SECRET!,
      { expiresIn: "1h" }
    );

    // Set httpOnly cookie and redirect to frontend
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 1000,
    });
    res.redirect(FRONTEND_URL || "http://localhost:4200");
    return;
  } catch (err) {
    console.error("Discord OAuth error", err);
    next(err);
  }
};

// 3) Return logged-in user info
export const getMe = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const token = req.cookies?.token;
  if (!token) {
    res.status(401).send("Not authenticated");
    return;
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET!) as any;
    res.json({ user: payload });
  } catch (err) {
    console.error("JWT verification failed", err);
    res.status(401).send("Invalid token");
  }
};

// 4) Clear JWT cookie and log user out
export const logout = (req: Request, res: Response): void => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
  });
  res.status(200).send({ message: "Logged out" });
};