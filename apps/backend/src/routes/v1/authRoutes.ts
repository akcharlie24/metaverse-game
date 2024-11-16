import {
  getAllAvatars,
  signInUser,
  signUpUser,
} from "@/controller/authController";
import { getAllElements } from "@/controller/spaceController";
import { authMiddleware } from "@/middleware";
import { Router } from "express";

const authRoutes = Router();

authRoutes.post("/signup", signUpUser);
authRoutes.post("/signin", signInUser);

// exception routes
authRoutes.get("/avatars", authMiddleware, getAllAvatars);
authRoutes.get("/elements", authMiddleware, getAllElements);

export default authRoutes as Router;
