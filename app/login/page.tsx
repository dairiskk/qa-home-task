"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth-form";

export default function LoginPage() {
  const router = useRouter();
  const hasCheckedSession = useRef(false);

  useEffect(() => {
    if (hasCheckedSession.current) {
      return;
    }
    hasCheckedSession.current = true;

    async function redirectIfAuthenticated() {
      const response = await fetch("/api/auth/me", { cache: "no-store" });

      if (response.ok) {
        router.replace("/todos");
      }
    }

    void redirectIfAuthenticated();
  }, [router]);

  return <AuthForm mode="login" />;
}
