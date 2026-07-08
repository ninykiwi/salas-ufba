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
  password: string,
  keepConnected: boolean
): Promise<LoginResponse> {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password, keepConnected }),
  });
  return handleResponse<LoginResponse>(response);
}

export async function logout(): Promise<void> {
  await fetch("/api/auth/logout", {
    method: "POST",
    credentials: "include",
  });
}

export async function me(): Promise<ApiUser> {
  const response = await fetch("/api/auth/me", {
    credentials: "include",
  });
  const data = await handleResponse<{ user: ApiUser }>(response);
  return data.user;
}

export async function getInstitutes(): Promise<Institute[]> {
  const response = await fetch("/api/institutes", {
    credentials: "include",
  });
  return handleResponse<Institute[]>(response);
}

export async function createInstitute(name: string): Promise<Institute> {
  const response = await fetch("/api/institutes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name }),
  });
  return handleResponse<Institute>(response);
}

export async function deleteInstitute(id: string): Promise<void> {
  const response = await fetch(`/api/institutes/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse<void>(response);
}

export async function getUsers(): Promise<ApiUser[]> {
  const response = await fetch("/api/users", {
    credentials: "include",
  });
  return handleResponse<ApiUser[]>(response);
}

export async function createUser(
  data: CreateUserPayload
): Promise<ApiUser> {
  const response = await fetch("/api/users", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
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
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse<ApiUser>(response);
}

export async function deleteUser(id: string): Promise<void> {
  const response = await fetch(`/api/users/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse<void>(response);
}
