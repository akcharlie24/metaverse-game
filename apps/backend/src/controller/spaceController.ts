import prisma from "@repo/db";
import { CreateSpaceSchema } from "@repo/types";
import { Request, Response } from "express";

export async function createSpace(req: Request, res: Response): Promise<void> {
  try {
    const parsedData = CreateSpaceSchema.safeParse(req.body);

    if (!parsedData.success) {
      throw new Error(parsedData.error.issues[0]?.message);
    }

    const { name, dimensions, mapId } = parsedData.data;
    const width = parseInt(dimensions.split("x")[0]!);
    const height = parseInt(dimensions.split("x")[1]!);

    if (!mapId) {
      const newSpace = await prisma.space.create({
        data: {
          name,
          width: width,
          height: height,
          creatorId: req.userId!,
        },
      });

      if (!newSpace) {
        throw new Error("Error Creating Space");
      }

      res.status(200).json({
        message: "Space Created Successfully",
        spaceId: newSpace.id,
      });

      return;
    }

    const map = await prisma.map.findUnique({
      where: { id: mapId },
      include: {
        mapElements: true,
      },
    });

    if (!map) {
      res.status(400).json({
        message:
          "No Map with the given MapId was found, please change or remove MapId",
      });
      return;
    }

    const newSpace = await prisma.space.create({
      data: {
        name,
        width: map.width,
        height: map.height,
        creatorId: req.userId!,
        thumbnail: map.thumbnail,
        elements: {
          create: map.mapElements.map((e) => ({
            elementId: e.elementId,
            x: e.x!,
            y: e.y!,
          })),
        },
      },
    });

    res.status(200).json({
      message: "Space created successfully",
      spaceId: newSpace.id,
    });
  } catch (e: any) {
    // TODO: these errors should not be logged on our server (better logging for internal server errors should be done)
    console.error(e);
    res
      .status(400)
      .json({ message: "Bad Request, Invalid Credentials", error: e.message });
  }
}

export async function deleteSpace(req: Request, res: Response) {
  try {
    const spaceId = req.params.spaceId;

    if (!spaceId) {
      throw new Error("Please Give SpaceId");
    }

    const space = await prisma.space.findUnique({
      where: { id: spaceId },
    });

    if (!space) {
      throw new Error("No such space exists");
    }

    if (space.creatorId !== req.userId) {
      res.status(403).json({ message: "No such space exists in your spaces" });
      return;
    }

    const deleteSpace = await prisma.space.delete({ where: { id: spaceId } });

    if (!deleteSpace) {
      throw new Error("Error while deleting space, please try again");
    }

    res.status(200).json({ message: "Space successfully deleted" });
  } catch (e: any) {
    console.error(e);
    res
      .status(400)
      .json({ message: "Bad Request, Invalid Credentials", error: e.message });
  }
}

export async function getMySpaces(req: Request, res: Response) {
  try {
    const mySpaces = await prisma.space.findMany({
      where: {
        creatorId: req.userId,
      },
    });

    if (!mySpaces) {
      throw new Error("Error fetching spaces please try again");
    }

    res.status(200).json({
      message: "Successfully fetched your spaces",
      spaces: mySpaces,
    });
  } catch (e: any) {
    console.error(e);
    res
      .status(400)
      .json({ message: "Bad Request, Invalid Credentials", error: e.message });
  }
}
