import { createContext, useEffect, useState } from "react";
import { getAuth, GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from "firebase/auth";
import app from "../Firebase/firebase.init"; // ✅ Ensure correct import path

export const AuthContext = createContext();
const auth = getAuth(app); // ✅ Ensure `app` is properly initialized

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Google Login
    const googleLogin = async () => {
        const provider = new GoogleAuthProvider();
        try {
            return await signInWithPopup(auth, provider);
        } catch (error) {
            console.error("Google Sign-In Error:", error.message);
        }
    };

    // Logout
    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error("Logout Error:", error.message);
        }
    };

    // Track Authentication State
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    const value = { user, loading, googleLogin, logout, auth }; // ✅ Include `auth` in context

    return (
        <AuthContext.Provider value={value}>
            {loading ? <p>Loading...</p> : children} {/* ✅ Optional loading handling */}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
