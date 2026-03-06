"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useRef, useState } from "react";

type Todo = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
};

type TodoAppProps = {
  username: string;
};

export function TodoApp({ username }: TodoAppProps) {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const hasLoadedTodos = useRef(false);

  const loadTodos = useCallback(async () => {
    setError("");

    const response = await fetch("/api/todos", {
      cache: "no-store",
    });

    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
      todos?: Todo[];
    };

    if (!response.ok) {
      if (response.status === 401) {
        router.push("/login");
        return;
      }

      setError(data.error ?? "Failed to load todos.");
      return;
    }

    setTodos(data.todos ?? []);
  }, [router]);

  useEffect(() => {
    if (hasLoadedTodos.current) {
      return;
    }
    hasLoadedTodos.current = true;

    async function init() {
      try {
        await loadTodos();
      } finally {
        setIsLoading(false);
      }
    }

    void init();
  }, [loadTodos]);

  async function createTodo(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    const response = await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title }),
    });

    const data = (await response.json().catch(() => ({}))) as { error?: string; todo?: Todo };

    if (!response.ok) {
      setError(data.error ?? "Failed to create todo.");
      return;
    }

    if (data.todo) {
      setTodos((current) => [data.todo!, ...current]);
      setTitle("");
    }
  }

  async function toggleTodo(todo: Todo) {
    const response = await fetch(`/api/todos/${todo.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: !todo.completed }),
    });

    const data = (await response.json().catch(() => ({}))) as { error?: string; todo?: Todo };

    if (!response.ok) {
      setError(data.error ?? "Failed to update todo.");
      return;
    }

    if (data.todo) {
      setTodos((current) => current.map((item) => (item.id === data.todo!.id ? data.todo! : item)));
    }
  }

  async function deleteTodo(id: number) {
    const response = await fetch(`/api/todos/${id}`, {
      method: "DELETE",
    });

    const data = (await response.json().catch(() => ({}))) as { error?: string };

    if (!response.ok) {
      setError(data.error ?? "Failed to delete todo.");
      return;
    }

    setTodos((current) => current.filter((todo) => todo.id !== id));
  }

  async function logout() {
    await fetch("/api/auth/logout", {
      method: "POST",
    });

    router.push("/login");
    router.refresh();
  }

  return (
    <main className="mx-auto min-h-screen w-full max-w-2xl px-6 py-10">
      <header className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-zinc-900">Todo App</h1>
          <p className="text-sm text-zinc-600">Signed in as {username}</p>
        </div>
        <button
          onClick={logout}
          className="rounded-md border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800 transition hover:bg-zinc-100"
        >
          Logout
        </button>
      </header>

      <form onSubmit={createTodo} className="mb-6 flex gap-2">
        <input
          className="flex-1 rounded-md border border-zinc-400 bg-zinc-50 px-3 py-2 text-zinc-950 outline-none transition placeholder:text-zinc-500 focus:border-zinc-700 focus:bg-white"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add a new todo"
          maxLength={200}
        />
        <button
          type="submit"
          className="rounded-md bg-zinc-900 px-4 py-2 font-medium text-white transition hover:bg-zinc-700"
        >
          Add
        </button>
      </form>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      {isLoading ? (
        <p className="text-zinc-600">Loading todos...</p>
      ) : todos.length === 0 ? (
        <p className="rounded-md border border-dashed border-zinc-300 p-4 text-zinc-600">No todos yet.</p>
      ) : (
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li key={todo.id} className="flex items-center justify-between rounded-md border border-zinc-200 p-3">
              <label className="flex flex-1 items-center gap-3">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleTodo(todo)}
                  className="size-4"
                />
                <span className={todo.completed ? "text-zinc-400 line-through" : "text-zinc-900"}>
                  {todo.title}
                </span>
              </label>

              <button
                onClick={() => deleteTodo(todo.id)}
                className="rounded-md px-2 py-1 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
