/**
 * User-related type definitions
 */

export interface User {
  _id?: string;
  firstName: string;
  lastName?: string;
  emailId: string;
  photoUrl?: string;
  age?: number;
  gender?: string;
  about?: string;
  skills?: string[];
  createdAt?: string;
  updatedAt?: string;
}
export interface UserFeed {
    
}
export interface LoginCredentials {
  emailId: string;
  password: string;
  firstName?:string;
  lastName?:string;
}

export interface LoginResponse {
  _id: string;
  firstName: string;
  lastName?: string;
  emailId: string;
  photoUrl?: string;
  age?: number;
  gender?: string;
  about?: string;
  skills?: string[];
}

export type UserSliceState = User | null;
