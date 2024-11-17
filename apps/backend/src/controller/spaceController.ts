import prisma from "@repo/db";
import {
  AddElementSchema,
  CreateSpaceSchema,
  DeleteElementSchema,
} from "@repo/types";
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
    res.status(400).json({ message: "Bad Request", error: e.message });
  }
}

export async function deleteSpace(req: Request, res: Response): Promise<void> {
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
    res.status(400).json({ message: "Bad Request", error: e.message });
  }
}

export async function getMySpaces(req: Request, res: Response): Promise<void> {
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
    res.status(400).json({ message: "Bad Request", error: e.message });
  }
}

let count = 0;

export async function getSpaceFromId(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const spaceId = req.params.spaceId;

    if (!spaceId || spaceId === "") {
      throw new Error("Please Enter Space Id");
    }

    // TODO: rename elements inside space to spaceElements in the prisma Schema
    const space = await prisma.space.findUnique({
      where: {
        id: spaceId,
      },
      include: {
        elements: {
          include: {
            element: true,
          },
        },
      },
    });

    if (!space) {
      throw new Error("Error fetching space, Please try again");
    }

    if (space.creatorId !== req.userId) {
      res.status(403).json({ message: "No such space in your spaces" });
      return;
    }

    const spaceObject = {
      dimensions: `${space.width}x${space.height}`,
      elements: space.elements.map((e) => ({
        id: e.id,
        element: {
          id: e.element.id,
          imageUrl: e.element.imageUrl,
          static: e.element.static,
          height: e.element.height,
          width: e.element.width,
        },
        x: e.x,
        y: e.y,
      })),
    };

    res.status(200).json(spaceObject);
  } catch (e: any) {
    res.status(400).json({ message: "Bad Request", error: e.message });
  }
}

export async function addElementToSpace(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const parsedData = AddElementSchema.safeParse(req.body);

    if (!parsedData.success) {
      throw new Error(parsedData.error.issues[0]?.message);
    }

    const { elementId, spaceId, x, y } = parsedData.data;

    const space = await prisma.space.findUnique({
      where: {
        id: spaceId,
        creatorId: req.userId,
      },
      select: {
        width: true,
        height: true,
      },
    });

    if (!space) {
      throw new Error("Space not found, Please try again");
    }

    if (x < 0 || x > space.width || y < 0 || y > space.height) {
      res.status(400).json({
        message: `x or y out of bound please keep x b/w 0-${space.width} and y b/w 0-${space.height}`,
      });
      return;
    }

    // TODO: BIG Sanitization -> should not be able to add elements to same position (can however be controlled from frontend)

    // Linking a space element between elements and space is a goated practice and too good
    const addSpaceElement = await prisma.spaceElements.create({
      data: {
        spaceId,
        elementId,
        x,
        y,
      },
    });

    if (!addSpaceElement) {
      throw new Error("Error creating space element, please try again");
    }

    res.status(200).json({ message: "Successfully added element to space" });
  } catch (e: any) {
    res.status(400).json({ message: "Bad Request", error: e.message });
  }
}

export async function deleteElementFromSpace(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const parsedData = DeleteElementSchema.safeParse(req.body);

    if (!parsedData.success) {
      throw new Error(parsedData.error.issues[0]?.message);
    }

    // TODO: Sanitization ensure that the element exists first
    const elementToDelete = await prisma.spaceElements.findUnique({
      where: {
        id: parsedData.data.id,
      },
      include: {
        space: true,
      },
    });

    if (!elementToDelete || !elementToDelete.space) {
      throw new Error("There is no such element to delete");
    }

    if (elementToDelete.space.creatorId !== req.userId) {
      res.status(403).json({ message: "Unauthorized" });
      return;
    }

    const deletedElement = await prisma.spaceElements.delete({
      where: {
        id: elementToDelete.id,
      },
    });

    if (!deletedElement) {
      throw new Error("Unable to delete element");
    }

    res.status(200).json({ message: "Element deleted successfully" });
  } catch (e: any) {
    res.status(400).json({ message: "Bad Request", error: e.message });
  }
}

export async function getAllElements(
  _req: Request,
  res: Response,
): Promise<any> {
  try {
    const elements = await prisma.element.findMany();

    if (!elements) {
      throw new Error("Error fetching elements, try again");
    }

    res.status(200).json({ elements });
  } catch (e: any) {
    res.status(400).json({ message: "Bad Request", error: e.message });
  }
}
