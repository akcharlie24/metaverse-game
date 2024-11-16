import {
  createSpace,
  deleteSpace,
  getMySpaces,
} from "@/controller/spaceController";
import { authMiddleware } from "@/middleware";
import { Router } from "express";

const spaceRoutes = Router();

spaceRoutes.use(authMiddleware);

spaceRoutes.post("/", createSpace);
spaceRoutes.delete("/:spaceId", deleteSpace);
spaceRoutes.get("/all", getMySpaces);

export default spaceRoutes as Router;
