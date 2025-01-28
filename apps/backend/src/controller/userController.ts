import prisma from "@repo/db/prisma";
import { UpdateMetadataSchema } from "@repo/types/common-types";
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

    const idArray = idString.slice(1, -1).split(",");

    // this works when the ids are given like ["hello","hi"] but not when [hello,hi]
    // const idArray: string[] = JSON.parse(idString);

    if (!Array.isArray(idArray) || idArray.length === 0) {
      throw new Error("Please enter the ids to get avatars");
    }

    const users = await prisma.user.findMany({
      where: {
        id: {
          in: idArray,
        },
      },
      select: {
        avatar: true,
        id: true,
      },
    });

    const bulkAvatars = users.map((u) => ({
      userId: u.id,
      imageUrl: u.avatar?.imageUrl || "",
    }));

    res.status(200).json({
      message: "Avatars fetched successfully",
      avatars: bulkAvatars,
    });
  } catch (e: any) {
    res.status(400).json({ message: "Bad Request", error: e.message });
  }
}
