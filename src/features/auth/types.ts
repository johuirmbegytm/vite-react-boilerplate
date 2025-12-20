// src/features/auth/types.ts

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  data: string; // "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6..."
}