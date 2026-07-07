export type Role = "SUPERADMIN" | "ADMIN" | "PROFESSOR";

export interface InstituteRef {
  id: string;
  name: string;
  slug: string;
}

export interface Institute extends InstituteRef {
  createdAt: string;
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  siape: string | null;
  role: Role;
  institutes: InstituteRef[];
}

export interface LoginResponse {
  access_token: string;
  user: ApiUser;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  siape?: string;
  role?: Role;
  instituteIds?: string[];
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  siape?: string | null;
  password?: string;
  role?: Role;
  instituteIds?: string[];
}

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new ApiError(
      data.message || "Erro ao comunicar com o servidor.",
      response.status
    );
  }
  if (response.status === 204) {
    return undefined as T;
  }
  return response.json();
}

export async function login(
  email: string,
  password: string
): Promise<LoginResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<LoginResponse>(response);
}

export async function me(): Promise<ApiUser> {
  const response = await fetch("/api/auth/me", {
    headers: authHeaders(),
  });
  return handleResponse<ApiUser>(response);
}

export async function getInstitutes(): Promise<Institute[]> {
  const response = await fetch("/api/institutes", {
    headers: authHeaders(),
  });
  return handleResponse<Institute[]>(response);
}

export async function createInstitute(name: string): Promise<Institute> {
  const response = await fetch("/api/institutes", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ name }),
  });
  return handleResponse<Institute>(response);
}

export async function getUsers(): Promise<ApiUser[]> {
  const response = await fetch("/api/users", {
    headers: authHeaders(),
  });
  return handleResponse<ApiUser[]>(response);
}

export async function createUser(
  data: CreateUserPayload
): Promise<ApiUser> {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  return handleResponse<ApiUser>(response);
}

export async function updateUser(
  id: string,
  data: UpdateUserPayload
): Promise<ApiUser> {
  const response = await fetch(`/api/users/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(data),
  });
  return handleResponse<ApiUser>(response);
}

export async function deleteUser(id: string): Promise<void> {
  const response = await fetch(`/api/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  return handleResponse<void>(response);
}
