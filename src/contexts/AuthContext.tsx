import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

interface Profile {
  id: string;
  user_id: string;
  display_name: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  loading: boolean;
  signUp: (username: string, password: string) => Promise<{ error: string | null }>;
  signIn: (username: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
    
    if (!error && data) {
      setProfile(data);
    }
  };

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Defer profile fetch with setTimeout to avoid deadlock
        if (session?.user) {
          setTimeout(() => {
            fetchProfile(session.user.id);
          }, 0);
        } else {
          setProfile(null);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (username: string, password: string): Promise<{ error: string | null }> => {
    // Validate input
    if (!username.trim() || username.length < 3) {
      return { error: 'Username must be at least 3 characters' };
    }
    if (password.length < 6) {
      return { error: 'Password must be at least 6 characters' };
    }

    // Create synthetic email from username
    const syntheticEmail = `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}@nagarikvani.demo`;
    
    const { error } = await supabase.auth.signUp({
      email: syntheticEmail,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          display_name: username,
        },
      },
    });

    if (error) {
      if (error.message.includes('already registered')) {
        return { error: 'This username is already taken' };
      }
      return { error: error.message };
    }

    return { error: null };
  };

  const signIn = async (username: string, password: string): Promise<{ error: string | null }> => {
    if (!username.trim()) {
      return { error: 'Please enter your username' };
    }
    if (!password) {
      return { error: 'Please enter your password' };
    }

    // Create synthetic email from username
    const syntheticEmail = `${username.toLowerCase().replace(/[^a-z0-9]/g, '')}@nagarikvani.demo`;
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email: syntheticEmail,
      password,
    });

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        return { error: 'Invalid username or password' };
      }
      return { error: error.message };
    }

    // If this is Admin user, add admin role
    if (username === 'Admin' && password === 'Admin@3142' && data.user) {
      const { data: existingRole } = await supabase
        .from('user_roles')
        .select('id')
        .eq('user_id', data.user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (!existingRole) {
        await supabase.from('user_roles').insert({
          user_id: data.user.id,
          role: 'admin',
        });
      }
    }

    return { error: null };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider value={{ user, session, profile, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
