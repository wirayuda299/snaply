import prisma from "@/lib/prisma";
import { currentUser } from "@clerk/nextjs";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user)
      return new Response(
        JSON.stringify({
          error: true,
          message: "Action not allowed, Please sign in",
        })
      );

    const allUsers = await prisma.user.findMany({
      where: {
        id: {
          not: user.id,
        },
      },
    });
    return new Response(JSON.stringify(allUsers), {
      status: 200,
    });
  } catch (e) {
    return new Response(JSON.stringify({ message: e }), {
      status: 200,
    });
  }
}
