import prisma from "@repo/db";
import {
  CreateAvatarSchema,
  CreateElementSchema,
  CreateMapSchema,
} from "@repo/types";
import { Request, Response } from "express";

export async function createAvatar(req: Request, res: Response): Promise<any> {
  try {
    const parsedData = CreateAvatarSchema.safeParse(req.body);
    if (!parsedData.success) {
      throw new Error(parsedData.error.issues[0]?.message);
    }

    // TODO: simply check for existing duplicates in all the CREATE ROUTE HANDLERS

    const avatar = await prisma.avatar.create({
      data: {
        imageUrl: parsedData.data.imageUrl,
        name: parsedData.data.name,
      },
    });

    res.status(200).json({
      message: "Avatar created successfully",
      avatarId: avatar.id,
    });
  } catch (e: any) {
    console.error(e);
    res.status(400).json({ message: "Bad Request", error: e.message });
  }
}

export async function createElement(req: Request, res: Response): Promise<any> {
  try {
    const parsedData = CreateElementSchema.safeParse(req.body);
    if (!parsedData.success) {
      throw new Error(parsedData.error.issues[0]?.message);
    }

    const { imageUrl, width, height, static: staticType } = parsedData.data;

    const element = await prisma.element.create({
      data: {
        imageUrl,
        width,
        height,
        static: staticType,
      },
    });

    if (!element) {
      throw new Error("Element not created please try again");
    }

    res.status(200).json({
      message: "Element Created",
      id: element.id,
    });
  } catch (e: any) {
    console.error(e);
    res.status(400).json({ message: "Bad Request", error: e.message });
  }
}

export async function createMap(req: Request, res: Response): Promise<any> {
  try {
    const parsedData = CreateMapSchema.safeParse(req.body);
    if (!parsedData.success) {
      throw new Error(parsedData.error.issues[0]?.message);
    }

    const { thumbnail, dimensions, name, defaultElements } = parsedData.data;
    const width = parseInt(dimensions.split("x")[0]!);
    const height = parseInt(dimensions.split("x")[1]!);

    // TODO: Big sanitation check (can also be done at frontend) -> no 2 elements should have same x and y
    const map = await prisma.map.create({
      data: {
        thumbnail,
        width,
        height,
        name,
        mapElements: {
          create: defaultElements.map((e) => ({
            elementId: e.elementId,
            x: e.x,
            y: e.y,
          })),
        },
      },
    });

    if (!map) {
      res
        .status(400)
        .json({ message: "Error creating the map, please try again" });
    }

    res
      .status(200)
      .json({ message: "Map Created successfully", data: { id: map.id } });
  } catch (e: any) {
    console.error(e);
    res.status(400).json({ message: "Bad Request", error: e.message });
  }
}
