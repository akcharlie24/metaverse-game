import {
  createSpace,
  deleteSpace,
  getMySpaces,
  getSpaceFromId,
} from "@/controller/spaceController";
import { authMiddleware } from "@/middleware";
import { Router } from "express";

const spaceRoutes = Router();

spaceRoutes.use(authMiddleware);

spaceRoutes.post("/", createSpace);
spaceRoutes.delete("/:spaceId", deleteSpace);
spaceRoutes.get("/all", getMySpaces);
spaceRoutes.get("/:spaceId", getSpaceFromId);

export default spaceRoutes as Router;
