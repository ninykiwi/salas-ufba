export type Role = "SUPERADMIN" | "ADMIN" | "PROFESSOR";

export interface InstituteRef {
  id: string;
  name: string;
  slug: string;
}

export interface Institute extends InstituteRef {
  floors: number;
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

export type RoomType =
  | "sala_aula"
  | "laboratorio"
  | "auditorio"
  | "sala_reuniao";
export type RoomStatus = "ativa" | "inativa";

export const ROOM_TYPES: { value: RoomType; label: string }[] = [
  { value: "sala_aula", label: "Sala de Aula" },
  { value: "laboratorio", label: "Laboratório" },
  { value: "auditorio", label: "Auditório" },
  { value: "sala_reuniao", label: "Sala de Reunião" },
];

export const ROOM_RESOURCES = [
  "Ar Condicionado",
  "Projetor",
  "Quadro Branco",
  "Computadores",
  "Sistema de Áudio",
  "Wi-Fi Dedicado",
] as const;

export interface Room {
  _id: string;
  name: string;
  institute_id: string;
  floor: string;
  type: RoomType;
  capacity: number;
  resources: string[];
  status: RoomStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateRoomPayload {
  name: string;
  institute_id: string;
  floor: string;
  type: RoomType;
  capacity: number;
  resources?: string[];
  status?: RoomStatus;
}

export interface UpdateRoomPayload {
  name?: string;
  institute_id?: string;
  floor?: string;
  type?: RoomType;
  capacity?: number;
  resources?: string[];
  status?: RoomStatus;
}

export type ScheduleCategory =
  | "aula_regular"
  | "defesa"
  | "palestra"
  | "reuniao"
  | "minicurso";
export type ScheduleRecurrence = "unico" | "semanal" | "quinzenal";
export type ScheduleStatus = "pendente" | "confirmado" | "cancelado";

export const SCHEDULE_CATEGORIES: { value: ScheduleCategory; label: string }[] = [
  { value: "aula_regular", label: "Aula Regular" },
  { value: "defesa", label: "Defesa" },
  { value: "palestra", label: "Palestra" },
  { value: "reuniao", label: "Reunião" },
  { value: "minicurso", label: "Minicurso" },
];

export const SCHEDULE_RECURRENCES: { value: ScheduleRecurrence; label: string }[] = [
  { value: "unico", label: "Único" },
  { value: "semanal", label: "Semanal" },
  { value: "quinzenal", label: "Quinzenal" },
];

export interface Schedule {
  _id: string;
  title: string;
  category: ScheduleCategory;
  professor_id: string;
  professor_name: string;
  room_id: string;
  institute_id: string;
  date: string;
  start_time: string;
  end_time: string;
  expected_audience: number;
  recurrence: ScheduleRecurrence;
  equipment_requested: string[];
  notes: string;
  status: ScheduleStatus;
  created_by: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateSchedulePayload {
  title: string;
  category: ScheduleCategory;
  room_id: string;
  institute_id: string;
  date: string;
  start_time: string;
  end_time: string;
  expected_audience: number;
  recurrence: ScheduleRecurrence;
  recurrence_end_date?: string;
  equipment_requested?: string[];
  notes?: string;
}

export interface UpdateSchedulePayload {
  title?: string;
  category?: ScheduleCategory;
  date?: string;
  start_time?: string;
  end_time?: string;
  expected_audience?: number;
  equipment_requested?: string[];
  notes?: string;
  status?: ScheduleStatus;
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

export async function createInstitute(
  name: string,
  floors: number
): Promise<Institute> {
  const response = await fetch("/api/institutes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ name, floors }),
  });
  return handleResponse<Institute>(response);
}

export interface DeleteInstituteResponse {
  hasLinkedUsers: boolean;
  hasLinkedRooms: boolean;
  linkedUsersCount: number;
  linkedRoomsCount: number;
}

export async function deleteInstitute(
  id: string
): Promise<DeleteInstituteResponse> {
  const response = await fetch(`/api/institutes/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse<DeleteInstituteResponse>(response);
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

function buildQueryString(params?: Record<string, string | undefined>): string {
  if (!params) return "";
  const filtered = Object.entries(params).filter(
    (entry): entry is [string, string] => entry[1] !== undefined && entry[1] !== ""
  );
  if (filtered.length === 0) return "";
  return `?${new URLSearchParams(filtered).toString()}`;
}

export async function getRooms(params?: {
  institute_id?: string;
  status?: string;
  floor?: string;
}): Promise<Room[]> {
  const response = await fetch(`/api/rooms${buildQueryString(params)}`, {
    credentials: "include",
  });
  return handleResponse<Room[]>(response);
}

export async function getRoom(id: string): Promise<Room> {
  const response = await fetch(`/api/rooms/${id}`, {
    credentials: "include",
  });
  return handleResponse<Room>(response);
}

export async function createRoom(data: CreateRoomPayload): Promise<Room> {
  const response = await fetch("/api/rooms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse<Room>(response);
}

export async function updateRoom(
  id: string,
  data: UpdateRoomPayload
): Promise<Room> {
  const response = await fetch(`/api/rooms/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse<Room>(response);
}

export async function deleteRoom(id: string): Promise<void> {
  const response = await fetch(`/api/rooms/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse<void>(response);
}

export async function getSchedules(params?: {
  room_id?: string;
  institute_id?: string;
  date?: string;
  professor_id?: string;
  status?: string;
}): Promise<Schedule[]> {
  const response = await fetch(`/api/schedules${buildQueryString(params)}`, {
    credentials: "include",
  });
  return handleResponse<Schedule[]>(response);
}

export async function getSchedulesToday(institute_id?: string): Promise<Schedule[]> {
  const response = await fetch(
    `/api/schedules/today${buildQueryString({ institute_id })}`,
    { credentials: "include" }
  );
  return handleResponse<Schedule[]>(response);
}

export async function getSchedule(id: string): Promise<Schedule> {
  const response = await fetch(`/api/schedules/${id}`, {
    credentials: "include",
  });
  return handleResponse<Schedule>(response);
}

export async function createSchedule(
  data: CreateSchedulePayload
): Promise<Schedule[]> {
  const response = await fetch("/api/schedules", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse<Schedule[]>(response);
}

export async function updateSchedule(
  id: string,
  data: UpdateSchedulePayload
): Promise<Schedule> {
  const response = await fetch(`/api/schedules/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(data),
  });
  return handleResponse<Schedule>(response);
}

export async function deleteSchedule(id: string): Promise<void> {
  const response = await fetch(`/api/schedules/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse<void>(response);
}

export interface AuditLog {
  id: string;
  admin_id: string;
  admin_name: string;
  admin_role: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  description: string;
  created_at: string;
}

export async function getLogs(params?: {
  admin_id?: string;
  resource_type?: string;
}): Promise<AuditLog[]> {
  const response = await fetch(`/api/logs${buildQueryString(params)}`, {
    credentials: "include",
  });
  return handleResponse<AuditLog[]>(response);
}
