import { supabase } from './supabase';
import type { User } from '../types/database';

export interface AuthError {
  message: string;
  code?: string;
}

export interface AuthResponse {
  user: User | null;
  error: AuthError | null;
}

export interface AuthStateChangeCallback {
  (event: 'SIGNED_IN' | 'SIGNED_OUT' | 'TOKEN_REFRESHED', session: any): void;
}

class AuthService {
  /**
   * Sign up a new user with email and password
   */
  async signUp(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return {
          user: null,
          error: {
            message: error.message,
            code: error.status?.toString(),
          },
        };
      }

      return {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email || '',
          created_at: data.user.created_at,
          updated_at: data.user.updated_at || data.user.created_at,
        } : null,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: {
          message: 'An unexpected error occurred during sign up',
          code: 'SIGNUP_ERROR',
        },
      };
    }
  }

  /**
   * Sign in an existing user with email and password
   */
  async signIn(email: string, password: string): Promise<AuthResponse> {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return {
          user: null,
          error: {
            message: error.message,
            code: error.status?.toString(),
          },
        };
      }

      return {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email || '',
          created_at: data.user.created_at,
          updated_at: data.user.updated_at || data.user.created_at,
        } : null,
        error: null,
      };
    } catch (error) {
      return {
        user: null,
        error: {
          message: 'An unexpected error occurred during sign in',
          code: 'SIGNIN_ERROR',
        },
      };
    }
  }

  /**
   * Sign out the current user
   */
  async signOut(): Promise<{ error: AuthError | null }> {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return {
          error: {
            message: error.message,
            code: error.status?.toString(),
          },
        };
      }

      return { error: null };
    } catch (error) {
      return {
        error: {
          message: 'An unexpected error occurred during sign out',
          code: 'SIGNOUT_ERROR',
        },
      };
    }
  }

  /**
   * Get the current authenticated user
   */
  async getCurrentUser(): Promise<User | null> {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();

      if (error || !user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email || '',
        created_at: user.created_at,
        updated_at: user.updated_at || user.created_at,
      };
    } catch (error) {
      return null;
    }
  }

  /**
   * Listen to authentication state changes
   */
  onAuthStateChange(callback: AuthStateChangeCallback) {
    return supabase.auth.onAuthStateChange(callback);
  }
}

export const authService = new AuthService();
export default authService;