import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload as DefaultJwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      role?: "Admin" | "User";
    }
  }
}

interface Payload extends DefaultJwtPayload {
  userId: string;
  role: "Admin" | "User";
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const JWT_SECRET: string = process.env.JWT_SECRET!;

    if (!req.headers.authorization) {
      res.status(403).json({ message: "Auth Token Missing" });
      return;
    }

    const authToken: string = req.headers.authorization.split(" ")[1]!;

    //@ts-ignore
    const data: Payload = jwt.verify(authToken, JWT_SECRET);

    req.userId = data.userId;
    next();
  } catch (e: any) {
    res.status(403).json({ message: "Access Denied", error: e.message });
  }
}

export function authAdminMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const JWT_SECRET: string = process.env.JWT_SECRET!;

    if (!req.headers.authorization) {
      // TODO: technically this one should be 401

      res.status(403).json({ message: "Auth Token Missing" });
      return;
    }

    const authToken: string = req.headers.authorization.split(" ")[1]!;

    //@ts-ignore
    const data: Payload = jwt.verify(authToken, JWT_SECRET);

    if (data.role !== "Admin") {
      res
        .status(403)
        .json({ message: "Access Denied, Please SignUp as Admin" });

      return;
    } else {
      req.userId = data.userId;
      next();
    }
  } catch (e: any) {
    res.status(403).json({ message: "Access Denied", error: e.message });
  }
}
