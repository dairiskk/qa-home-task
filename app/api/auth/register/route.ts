import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { createSession, hashPassword, setSessionCookie } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

function isValidUsername(username: string): boolean {
  return /^[a-zA-Z0-9_]{3,32}$/.test(username);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const username = body?.username?.trim();
  const password = body?.password;

  if (typeof username !== "string" || typeof password !== "string") {
    return NextResponse.json({ error: "Invalid payload." }, { status: 400 });
  }

  if (!isValidUsername(username)) {
    return NextResponse.json(
      { error: "Username must be 3-32 chars and use letters, numbers, or _." },
      { status: 400 },
    );
  }

  if (password.length < 6) {
    return NextResponse.json({ error: "Password must be at least 6 characters." }, { status: 400 });
  }

  try {
    const user = await prisma.user.create({
      data: {
        username,
        password: hashPassword(password),
      },
    });

    const { token, expiresAt } = await createSession(user.id);
    const response = NextResponse.json(
      { user: { id: user.id, username: user.username } },
      { status: 201 },
    );

    setSessionCookie(response, token, expiresAt);
    return response;
  } catch (error: unknown) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return NextResponse.json({ error: "Username is already taken." }, { status: 409 });
    }

    return NextResponse.json({ error: "Failed to register user." }, { status: 500 });
  }
}
