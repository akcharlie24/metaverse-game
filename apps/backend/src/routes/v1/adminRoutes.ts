import { createAvatar } from "@/controller/adminController";
import { authAdminMiddleware } from "@/middleware";
import { Router } from "express";

const adminRoutes = Router();

adminRoutes.post("/avatar", authAdminMiddleware, createAvatar);
export default adminRoutes as Router;
