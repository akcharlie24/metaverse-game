import { getBulkAvatars, updateUserAvatar } from "@/controller/userController";
import { authMiddleware } from "@/middleware";
import { Router } from "express";

const userRoutes = Router();

userRoutes.post("/metadata", authMiddleware, updateUserAvatar);

// TODO: not using middleware for this route in tests (maybe as this will be used by frontend to render)
userRoutes.get("/metadata/bulk", getBulkAvatars);

export default userRoutes as Router;
