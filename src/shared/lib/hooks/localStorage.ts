import type { User } from "../../../entities/user/types";
import type {
  LoginData,
  RegisterData,
  StoredAuthUser,
} from "../../../features/auth/model/types";
import type { Sensor } from "../../../entities/sensor/types";
import mockSensors from "../mock/sensors.json";

const AUTH_STORAGE_KEY = "auth_user";
const USERS_STORAGE_KEY = "registered_users";
const SENSORS_STORAGE_KEY = "sensors";

export function registerUser(data: RegisterData): User {
  const users = getRegisteredUsers();

  const existingUser = users.find((u) => u.email === data.email);
  if (existingUser) {
    throw new Error("Ya existe un usuario con este email");
  }

  const newUser: User = {
    id: crypto.randomUUID(),
    email: data.email,
    name: data.name,
    password: data.password,
    lastName: data.lastName,
    createdAt: new Date(),
  };

  users.push(newUser);
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));

  return newUser;
}

export function loginUser(credentials: LoginData): User {
  const users = getRegisteredUsers();

  const user = users.find(
    (u) => u.email === credentials.email && u.password === credentials.password
  );

  if (!user) {
    throw new Error("Credenciales incorrectas");
  }

  const authUser: StoredAuthUser = {
    user,
    timestamp: Date.now(),
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(authUser));

  return authUser.user;
}

export function getCurrentUser(): User | null {
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!stored) return null;

    const authUser: StoredAuthUser = JSON.parse(stored);

    authUser.user.createdAt = new Date(authUser.user.createdAt);

    return authUser.user;
  } catch (error) {
    console.error("Error al obtener usuario actual:", error);
    return null;
  }
}

export function isAuthenticated(): boolean {
  return getCurrentUser() !== null;
}

export function logoutUser(): void {
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

function getRegisteredUsers(): User[] {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (!stored) return [];

    const users = JSON.parse(stored);

    return users.map((u: User) => ({
      ...u,
      createdAt: new Date(u.createdAt),
    }));
  } catch (error) {
    console.error("Error al obtener usuarios registrados:", error);
    return [];
  }
}

export function getSensors(): Sensor[] {
  try {
    const stored = localStorage.getItem(SENSORS_STORAGE_KEY);
    if (!stored) return [];

    const sensors = JSON.parse(stored);

    return sensors;
  } catch (error) {
    console.error("Error al obtener sensores:", error);
    return [];
  }
}

export function addMockSensors(): void {
  const sensors = getSensors();
  if (sensors.length > 0) return;

  localStorage.setItem(SENSORS_STORAGE_KEY, JSON.stringify(mockSensors));
}
