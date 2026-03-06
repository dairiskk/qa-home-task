"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    async function redirectBySession() {
      const response = await fetch("/api/auth/me", { cache: "no-store" });
      router.replace(response.ok ? "/todos" : "/login");
    }

    void redirectBySession();
  }, [router]);

  return null;
}
