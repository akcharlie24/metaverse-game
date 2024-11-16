import prisma from "@repo/db";
import { CreateAvatarSchema } from "@repo/types";
import { Request, Response } from "express";

export async function createAvatar(req: Request, res: Response): Promise<any> {
  try {
    const parsedData = CreateAvatarSchema.safeParse(req.body);
    if (!parsedData.success) {
      throw new Error(parsedData.error.issues[0]?.message);
    }

    // TODO: schema says that imageUrl and name can be undefined -> change it later on

    // if (parsedData.data.name && parsedData.data.name !== "") {
    //   const existingAvatar = await prisma.avatar.findUnique({
    //     where: {
    //       name: parsedData.data.name,
    //     },
    //   });
    //
    //   if (existingAvatar) {
    //     throw new Error("Avatar with same name alerady exists");
    //   }
    // }

    const avatar = await prisma.avatar.create({
      data: {
        imageUrl: parsedData.data.imageUrl,
        name: parsedData.data.name,
      },
    });

    res
      .status(200)
      .json({ message: "Avatar created successfully", avatarId: avatar.id });
  } catch (e: any) {
    console.error(e);
    res.status(400).json({ message: "Bad Request", error: e.message });
  }
}
