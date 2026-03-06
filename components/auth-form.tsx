"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type AuthMode = "login" | "register";

type AuthFormProps = {
  mode: AuthMode;
};

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isRegister = mode === "register";

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (isRegister && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = (await response.json().catch(() => ({}))) as { error?: string };

      if (!response.ok) {
        setError(data.error ?? "Authentication failed.");
        return;
      }

      router.push("/todos");
      router.refresh();
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md items-center px-6 py-12">
      <div className="w-full rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-zinc-900">{isRegister ? "Create account" : "Welcome back"}</h1>
        <p className="mt-2 text-sm text-zinc-600">
          {isRegister ? "Register to start managing your todos." : "Sign in to continue."}
        </p>

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-800" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              className="w-full rounded-md border border-zinc-400 bg-zinc-50 px-3 py-2 text-zinc-950 outline-none transition placeholder:text-zinc-500 focus:border-zinc-700 focus:bg-white"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-zinc-800" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full rounded-md border border-zinc-400 bg-zinc-50 px-3 py-2 text-zinc-950 outline-none transition placeholder:text-zinc-500 focus:border-zinc-700 focus:bg-white"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={isRegister ? "new-password" : "current-password"}
              required
            />
          </div>

          {isRegister && (
            <div>
              <label className="mb-1 block text-sm font-medium text-zinc-800" htmlFor="confirm-password">
                Confirm password
              </label>
              <input
                id="confirm-password"
                type="password"
                className="w-full rounded-md border border-zinc-400 bg-zinc-50 px-3 py-2 text-zinc-950 outline-none transition placeholder:text-zinc-500 focus:border-zinc-700 focus:bg-white"
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                autoComplete="new-password"
                required
              />
            </div>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-md bg-zinc-900 px-4 py-2 font-medium text-white transition hover:bg-zinc-700 disabled:opacity-50"
          >
            {isSubmitting ? "Please wait..." : isRegister ? "Create account" : "Login"}
          </button>
        </form>

        <p className="mt-4 text-sm text-zinc-600">
          {isRegister ? "Already have an account?" : "Don\'t have an account?"} {" "}
          <Link className="font-medium text-zinc-900 underline" href={isRegister ? "/login" : "/register"}>
            {isRegister ? "Login" : "Register"}
          </Link>
        </p>
      </div>
    </main>
  );
}
