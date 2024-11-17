import {
  addElementToSpace,
  createSpace,
  deleteElementFromSpace,
  deleteSpace,
  getMySpaces,
  getSpaceFromId,
} from "@/controller/spaceController";
import { authMiddleware } from "@/middleware";
import { Router } from "express";

const spaceRoutes = Router();

spaceRoutes.use(authMiddleware);

spaceRoutes.post("/", createSpace);

// TODO: routes of matching matters (research on this one -> technically should put static routes first then)
spaceRoutes.delete("/element", deleteElementFromSpace);
spaceRoutes.delete("/:spaceId", deleteSpace);

spaceRoutes.get("/all", getMySpaces);
spaceRoutes.get("/:spaceId", getSpaceFromId);

spaceRoutes.post("/element", addElementToSpace);

export default spaceRoutes as Router;
