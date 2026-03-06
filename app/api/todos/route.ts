import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const todos = await prisma.todo.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ todos });
}

export async function POST(request: NextRequest) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const title = body?.title?.trim();

  if (typeof title !== "string" || !title) {
    return NextResponse.json({ error: "Todo title is required." }, { status: 400 });
  }

  if (title.length > 200) {
    return NextResponse.json({ error: "Todo title is too long." }, { status: 400 });
  }

  const todo = await prisma.todo.create({
    data: {
      title,
      userId: user.id,
    },
  });

  return NextResponse.json({ todo }, { status: 201 });
}
