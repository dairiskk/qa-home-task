import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: NextRequest, context: RouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const todoId = Number.parseInt(id, 10);

  if (!Number.isInteger(todoId)) {
    return NextResponse.json({ error: "Invalid todo id." }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const title = typeof body?.title === "string" ? body.title.trim() : undefined;
  const completed = typeof body?.completed === "boolean" ? body.completed : undefined;

  if (title === undefined && completed === undefined) {
    return NextResponse.json({ error: "No valid fields to update." }, { status: 400 });
  }

  if (title !== undefined && !title) {
    return NextResponse.json({ error: "Todo title cannot be empty." }, { status: 400 });
  }

  const existing = await prisma.todo.findFirst({
    where: {
      id: todoId,
      userId: user.id,
    },
  });

  if (!existing) {
    return NextResponse.json({ error: "Todo not found." }, { status: 404 });
  }

  const todo = await prisma.todo.update({
    where: { id: existing.id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(completed !== undefined ? { completed } : {}),
    },
  });

  return NextResponse.json({ todo });
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const user = await getCurrentUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const todoId = Number.parseInt(id, 10);

  if (!Number.isInteger(todoId)) {
    return NextResponse.json({ error: "Invalid todo id." }, { status: 400 });
  }

  const result = await prisma.todo.deleteMany({
    where: {
      id: todoId,
      userId: user.id,
    },
  });

  if (result.count === 0) {
    return NextResponse.json({ error: "Todo not found." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
