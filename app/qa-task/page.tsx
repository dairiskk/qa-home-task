import Link from "next/link";

export default function QaTaskPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-3xl px-6 py-10">
      <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-zinc-900">QA Home Task</h1>
        <p className="mt-3 text-zinc-700">
          Evaluate this Todo app as a QA Engineer. The goal is to assess manual testing skills, bug
          reporting quality, and basic test automation using Playwright with TypeScript.
        </p>

        <section className="mt-6">
          <h2 className="text-xl font-semibold text-zinc-900">Tasks</h2>
          <ol className="mt-3 list-decimal space-y-4 pl-6 text-zinc-800">
            <li>
              <p className="font-medium">Manual testing</p>
              <p>Create 5 manual test cases for the application.</p>
            </li>
            <li>
              <p className="font-medium">Bug reporting</p>
              <p>Find and report 2 bugs.</p>
            </li>
            <li>
              <p className="font-medium">Automation with Playwright (TypeScript)</p>
              <p>
                Automate one manual test case. Include clear assertions and make it runnable with
                one command.
              </p>
            </li>
          </ol>
        </section>

        <section className="mt-6">
          <h2 className="text-xl font-semibold text-zinc-900">Deliverables</h2>
          <ul className="mt-2 list-disc pl-6 text-zinc-800">
            <li>manual-test-cases.md</li>
            <li>bug-reports.md with 2 complete bug reports</li>
            <li>Playwright tests in the public github repo and brief run instructions in README.md</li>
          </ul>
        </section>

        <div className="mt-8 border-t border-zinc-200 pt-4">
          <Link href="/login" className="text-sm font-medium text-zinc-900 underline">
            Back to Login
          </Link>
        </div>
      </div>
    </main>
  );
}
