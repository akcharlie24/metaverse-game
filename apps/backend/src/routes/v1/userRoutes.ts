import { getBulkAvatars, updateUserAvatar } from "@/controller/userController";
import { authMiddleware } from "@/middleware";
import { Router } from "express";

const userRoutes = Router();

userRoutes.use(authMiddleware);

userRoutes.post("/metadata", updateUserAvatar);
userRoutes.get("/metadata/bulk", getBulkAvatars);

export default userRoutes as Router;
