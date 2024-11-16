import { Router } from "express";
import authRoutes from "./authRoutes";
import adminRoutes from "./adminRoutes";
import userRoutes from "./userRoutes";

const routes = Router();

routes.use("/", authRoutes);
routes.use("/admin", adminRoutes);
routes.use("/user", userRoutes);

export default routes as Router;
