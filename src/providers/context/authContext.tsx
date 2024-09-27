"use client";

import { firebaseApp } from "@/firebase/config";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";
import {
  createContext,
  FC,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
}

// Initialize Firebase auth instance
const auth = getAuth(firebaseApp);

// Create the authentication context
const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * AuthContextProvider component to provide authentication context to child components.
 *
 * @param {AuthContextProviderProps} children - The child components to provide authentication context.
 * @return {ReactNode} The authentication context provided to child components.
 */
export const AuthContextProvider: FC<{ children: ReactNode }> = ({
  children,
}): ReactNode => {
  // Set up state to track the authenticated user and loading status
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Subscribe to the authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        setUser(user);
      } else {
        // User is signed out
        setUser(null);
      }
      // Set loading to false once authentication state is determined
      setLoading(false);
    });

    // Unsubscribe from the authentication state changes when the component is unmounted
    return () => unsubscribe();
  }, []);

  // Provide the authentication context to child components
  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      "useAuthContext must be used within an AuthContextProvider",
    );
  }
  return context;
};
