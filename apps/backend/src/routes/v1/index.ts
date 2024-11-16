import { Router } from "express";
import authRoutes from "./authRoutes";
import adminRoutes from "./adminRoutes";
import userRoutes from "./userRoutes";
import spaceRoutes from "./spaceRoutes";

const routes = Router();

routes.use("/", authRoutes);
routes.use("/admin", adminRoutes);
routes.use("/user", userRoutes);
routes.use("/space", spaceRoutes);

export default routes as Router;
