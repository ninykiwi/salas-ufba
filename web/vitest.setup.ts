import "@testing-library/jest-dom";
import { vi } from "vitest";

// Componentes client (NotificationsBell, ProtectedRoute, AuthContext etc.) usam
// useRouter() do App Router — sem provider nos testes de unidade, a chamada
// real lança "invariant expected app router to be mounted".
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    back: vi.fn(),
    forward: vi.fn(),
    refresh: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));