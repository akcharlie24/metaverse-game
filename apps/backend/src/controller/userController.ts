import prisma from "@repo/db";
import { UpdateMetadataSchema } from "@repo/types";
import { Request, Response } from "express";

export async function updateUserAvatar(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const parsedData = UpdateMetadataSchema.safeParse(req.body);
    if (!parsedData.success) {
      throw new Error(parsedData.error.issues[0]?.message);
    }

    const avatarExists = await prisma.avatar.findUnique({
      where: {
        id: parsedData.data.avatarId,
      },
    });

    if (!avatarExists) {
      res.status(400).json({ message: "Avatar Doesnt Exists" });
      return;
    }

    await prisma.user.update({
      where: {
        id: req.userId,
      },
      data: {
        avatarId: parsedData.data.avatarId,
      },
    });

    res.status(200).json({ message: "User metadata updated successfully" });
  } catch (e: any) {
    console.error(e);
    res.status(400).json({ message: "Bad Request", error: e.message });
  }
}

export async function getBulkAvatars(
  req: Request,
  res: Response,
): Promise<void> {
  try {
    const idString = req.query.ids as string;
    if (!idString) {
      throw new Error("Please enter ids to get avatar");
    }

    const idArray: string[] = JSON.parse(idString);

    if (!Array.isArray(idArray) || idArray.length === 0) {
      throw new Error("Please enter the ids to get avatars");
    }

    const bulkAvatars = await prisma.avatar.findMany({
      where: {
        id: {
          in: idArray,
        },
      },
      select: {
        imageUrl: true,
        name: true,
      },
    });

    res.status(200).json({
      message: "Avatars fetched successfully",
      avatars: bulkAvatars,
    });
  } catch (e: any) {
    console.error(e);
    res.status(400).json({ message: "Bad Request", error: e.message });
  }
}
