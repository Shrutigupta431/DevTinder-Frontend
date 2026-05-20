/**
 * Profile-related type definitions
 */

export interface ProfileUpdateData {
  firstName?: string;
  lastName?: string;
  age?: number;
  gender?: string;
  about?: string;
  skills?: string[];
  photoUrl?: string;
}

export interface ProfileUpdateResponse {
  success: boolean;
  message: string;
  data?: ProfileUpdateData;
}
