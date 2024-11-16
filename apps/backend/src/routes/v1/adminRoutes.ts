import {
  createAvatar,
  createElement,
  createMap,
} from "@/controller/adminController";
import { authAdminMiddleware } from "@/middleware";
import { Router } from "express";

const adminRoutes = Router();

adminRoutes.use(authAdminMiddleware);

adminRoutes.post("/avatar", createAvatar);
adminRoutes.post("/element", createElement);
adminRoutes.post("/map", createMap);

export default adminRoutes as Router;
