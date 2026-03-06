"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { TodoApp } from "@/components/todo-app";

export default function TodosPage() {
  const router = useRouter();
  const [username, setUsername] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasCheckedSession = useRef(false);

  useEffect(() => {
    if (hasCheckedSession.current) {
      return;
    }
    hasCheckedSession.current = true;

    async function ensureAuth() {
      try {
        const response = await fetch("/api/auth/me", { cache: "no-store" });

        if (!response.ok) {
          router.replace("/login");
          return;
        }

        const data = (await response.json()) as { user?: { username?: string } };
        setUsername(data.user?.username ?? null);
      } finally {
        setIsLoading(false);
      }
    }

    void ensureAuth();
  }, [router]);

  if (isLoading || !username) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-2xl px-6 py-10">
        <p className="text-zinc-600">Loading...</p>
      </main>
    );
  }

  return <TodoApp username={username} />;
}
