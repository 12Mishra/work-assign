import { prisma } from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/config/auth";

export async function GET() {
  try {
    const students = await prisma.user.findMany();

    if (!students) {
      return NextResponse.json({
        success: false,
        message: "No students found",
      });
    } else {
      return NextResponse.json({
        success: true,
        message: "Fetched students successfully",
        students,
      });
    }
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();

    const { name, email } = await req.json();

    console.log(name , email);
    
    console.log("control reached here 1");
    
    const existingUser = await prisma.user.findUnique({
      where: {
        id: String(session?.user?.id),
      },
    });
    console.log("control reached here 2");
    
    if (!existingUser) {
      return NextResponse.json({
        success: false,
        message: "User not found thus cannot update",
      });
    }
    console.log("control reached here 3");
    
    const updateUser = await prisma.user.update({
      where: {
        id: String(session?.user?.id),
      },
      data: {
        name,
        email,
      },
    });

    console.log("control reached here 4");

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
    });
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({
        success: false,
        message: "Internal Server Error",
      });
    }
  }
}
