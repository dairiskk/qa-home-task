# Intentional Bugs (QA Task)

This file documents the intentionally injected bugs in this project for interviewer/reference use.

## 1) High Severity - Authorization Bypass on Delete
- Severity: High
- File: `app/api/todos/[id]/route.ts`
- Endpoint: `DELETE /api/todos/:id`
- Issue: The delete query does not verify todo ownership (`userId` check removed).
- Risk: Any authenticated user can delete another user's todo by ID.

## 2) Medium Severity - Weak Password Accepted
- Severity: Medium
- File: `app/api/auth/register/route.ts`
- Endpoint: `POST /api/auth/register`
- Issue: Password validation was weakened from minimum 6 chars to minimum 1 char.
- Risk: Users can register with very weak passwords (1-5 characters).

## 3) Low Severity - Todo Input Not Cleared After Add
- Severity: Low
- File: `components/todo-app.tsx`
- UI Flow: Create todo in app screen
- Issue: Title input is not cleared after a successful todo creation.
- Impact: Minor UX inconvenience; user must manually clear or edit previous text.
