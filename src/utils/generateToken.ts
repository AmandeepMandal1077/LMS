import jwt from "jsonwebtoken";
import { ApiError } from "./apiError.js";
import type { Response } from "express";

const generateToken = (res: Response, userId: string, message: string) => {
  try {
    const token = jwt.sign(
      {
        userId,
      },
      process.env.JWT_SECRET as string,
      {
        expiresIn: "1d",
      },
    );
    res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message,
        success: true,
        token,
      });
  } catch (error) {
    console.log(error);
    throw new ApiError("Failed to generate token", 500);
  }
};

export { generateToken };
