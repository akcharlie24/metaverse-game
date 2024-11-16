import { getBulkAvatars, updateUserAvatar } from "@/controller/userController";
import { authMiddleware } from "@/middleware";
import { Router } from "express";

const userRoutes = Router();

userRoutes.post("/metadata", authMiddleware, updateUserAvatar);
userRoutes.get("/metadata/bulk", authMiddleware, getBulkAvatars);

export default userRoutes as Router;
