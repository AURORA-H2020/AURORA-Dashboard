"use client";
import firebase_app from "@/firebase/config";
import { User, getAuth, onAuthStateChanged } from "firebase/auth";
import {
    ReactNode,
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

// Initialize Firebase auth instance
const auth = getAuth(firebase_app);

// Create the authentication context
export const AuthContext = createContext({});

// Custom hook to access the authentication context
export const useAuthContext = () => useContext(AuthContext);

interface AuthContextProviderProps {
    children: ReactNode;
}

/**
 * AuthContextProvider component to provide authentication context to child components.
 *
 * @param {AuthContextProviderProps} children - The child components to provide authentication context.
 * @return {JSX.Element} The authentication context provided to child components.
 */
export function AuthContextProvider({
    children,
}: AuthContextProviderProps): JSX.Element {
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
}
