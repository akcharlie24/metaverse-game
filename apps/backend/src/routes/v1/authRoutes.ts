import {
  getAllAvatars,
  signInUser,
  signUpUser,
} from "@/controller/authController";
import { authMiddleware } from "@/middleware";
import { Router } from "express";

const authRoutes = Router();

authRoutes.post("/signup", signUpUser);
authRoutes.post("/signin", signInUser);

// exception route
authRoutes.get("/avatars", authMiddleware, getAllAvatars);

export default authRoutes as Router;
