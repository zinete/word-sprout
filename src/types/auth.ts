
import { Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email: string | undefined;
  username: string;
  totalWords: number;
  studiedDays: number;
}

export interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (data: Partial<AuthUser>) => Promise<void>;
}
