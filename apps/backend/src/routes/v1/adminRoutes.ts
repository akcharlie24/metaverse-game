import {
  createAvatar,
  createElement,
  createMap,
  updateElement,
} from "@/controller/adminController";
import { authAdminMiddleware } from "@/middleware";
import { Router } from "express";

const adminRoutes = Router();

adminRoutes.use(authAdminMiddleware);

adminRoutes.post("/avatar", createAvatar);
adminRoutes.post("/element", createElement);
adminRoutes.post("/map", createMap);
adminRoutes.put("/element/:elementId", updateElement);

export default adminRoutes as Router;
