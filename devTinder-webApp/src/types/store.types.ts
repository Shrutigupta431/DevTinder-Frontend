/**
 * Redux store type definitions
 */

import type { User } from "./user.types";

export interface RootState {
  user: User | null;
  feed: unknown;
  connection: User[] | null;
  request: User[] | null;
}

