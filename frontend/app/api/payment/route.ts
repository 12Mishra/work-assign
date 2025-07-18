import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/config/auth";
import { prisma } from "@/config/prisma";

export async function POST(req: NextRequest) {
  try {
    const userSession = await auth();

    const findUser = await prisma.user.findUnique({
      where: {
        id: String(userSession?.user?.id),
      },
    });

    if (!findUser) {
      return NextResponse.json({
        success: false,
        message: "User does not exist , cannot facilitate payment",
      });
    }

    const { amount, cardholderName } = await req.json();

    console.log(
      `For reference credentials to facilate fee payment: Amount: ${amount} under the CardHolderName: ${cardholderName}`
    );

    const updateFeeStatus = await prisma.user.update({
      where: {
        email: String(userSession?.user?.email),
      },
      data: {
        feeStatus: true,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully paid the fees",
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
