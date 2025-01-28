import { comparePass, hashPass } from "@/helper/hashing";
import prisma from "@repo/db/prisma";
import { SignInSchema, SignUpSchema } from "@repo/types/common-types";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";

interface Payload {
  userId: string;
  role: "Admin" | "User";
}

export async function signUpUser(req: Request, res: Response): Promise<void> {
  // TODO: should do the complete requests in try catch and make a error handler middleware

  try {
    const parsedData = SignUpSchema.safeParse(req.body);

    if (!parsedData.success) {
      throw new Error(parsedData.error.issues[0]?.message);
    }

    const userExists = await prisma.user.findUnique({
      where: {
        username: parsedData.data?.username,
      },
    });

    if (userExists) {
      throw new Error(
        "Username Alerady Exists, either login or pick a different username",
      );
    }

    const hashedPassword = await hashPass(parsedData.data.password);

    const newUser = await prisma.user.create({
      data: {
        username: parsedData.data.username,
        password: hashedPassword,
        role: parsedData.data.type === "admin" ? "Admin" : "User",
      },
    });

    if (!newUser) {
      throw new Error("Error Creating User");
    }

    res.status(200).json({
      message: "User Created Successfully",
      userId: newUser.id,
    });
  } catch (e: any) {
    // TODO: better error handling via express error handlers
    res
      .status(400)
      .json({ message: "Bad Request, Invalid Credentials", error: e.message });
  }
}

export async function signInUser(req: Request, res: Response): Promise<void> {
  //@ts-ignore
  const JWT_SECRET: string = process.env.JWT_SECRET;

  try {
    const parsedData = SignInSchema.safeParse(req.body);

    if (!parsedData.success) {
      throw new Error(parsedData.error.issues[0]?.message);
    }

    const user = await prisma.user.findUnique({
      where: {
        username: parsedData.data?.username,
      },
    });

    if (!user) {
      res.status(403).json({ message: "User Doesn't Exists" });
      return;
    }

    const passwordMatch = await comparePass(
      parsedData.data.password,
      user.password,
    );

    if (!passwordMatch) {
      res.status(403).json({ message: "Invalid Password" });
      return;
    }

    const payload: Payload = {
      userId: user.id,
      role: user.role,
    };

    // TODO: customize jwt
    const authToken: string = jwt.sign(payload, JWT_SECRET);

    res.status(200).json({
      message: "Successfully Logged In",
      token: authToken,
    });
  } catch (e: any) {
    res
      .status(400)
      .json({ message: "Bad Request, Invalid Credentials", error: e.message });
  }
}

export async function getAllAvatars(
  _req: Request,
  res: Response,
): Promise<void> {
  try {
    const fetchedAvatars = await prisma.avatar.findMany();

    res.status(200).json({
      message: "Avatars fetched successfully ",
      avatars: fetchedAvatars,
    });
  } catch (e: any) {
    res.status(400).json({ message: "Bad Request", error: e.message });
  }
}
