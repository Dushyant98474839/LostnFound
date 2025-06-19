import { createContext, useEffect, useState, useContext } from 'react';
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [session, setSession] = useState(null);
  const [isProfileComplete, setIsProfileComplete] = useState(null);

  const fetchProfileStatus = async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("is_profile_complete")
      .eq("id", userId)
      .single();

    if (!error && data) {
      setIsProfileComplete(data.is_profile_complete);
    } else {
      setIsProfileComplete(false);
    }
  };

  useEffect(() => {
    
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session) {
        fetchProfileStatus(session.user.id);
      }
    };

    getSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        if (session) {
          fetchProfileStatus(session.user.id);
        } else {
          setIsProfileComplete(null);
        }
      }
    );

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{
      session,
      isLoggedIn: !!session,
      isProfileComplete
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
