import type { User } from "../../../entities/user/types";

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name: string;
  lastName: string;
}

export interface AuthResponse {
  user: User;
}

export interface StoredAuthUser {
  user: User;
  timestamp: number;
}
