"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthForm } from "@/components/auth-form";

export default function RegisterPage() {
  const router = useRouter();

  useEffect(() => {
    async function redirectIfAuthenticated() {
      const response = await fetch("/api/auth/me", { cache: "no-store" });

      if (response.ok) {
        router.replace("/todos");
      }
    }

    void redirectIfAuthenticated();
  }, [router]);

  return <AuthForm mode="register" />;
}
