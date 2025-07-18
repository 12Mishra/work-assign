"use server";

import bcrypt from "bcrypt";
import { prisma } from "@/config/prisma";

interface returnPromise {
  success: boolean;
  message: string;
}

export async function createUser({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}): Promise<returnPromise> {
  console.log(name, email, password);

  try {
    const findUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    console.log("control reached here 1");

    if (findUser) {
      return {
        success: false,
        message: "User already exists. Please login. ",
      };
    }
    console.log("control reached here 2");

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashPassword,
      },
    });

    console.log("control reached here 3");

    return {
      success: true,
      message: "User successfully created.",
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: "Internal Server Error",
      };
    }
  }
  return {
    success: false,
    message: "An unknown error occurred.",
  };
}
