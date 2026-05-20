/**
 * API-related type definitions
 */

import type { User, LoginResponse } from "./user.types";

export interface ApiResponse<T> {
  success?: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface LoginApiResponse extends ApiResponse<LoginResponse> {}

export interface LogoutApiResponse extends ApiResponse<null> {}

export interface ProfileViewResponse extends ApiResponse<User> {}

export interface ApiError {
  status?: number;
  message: string;
  data?: unknown;
}
