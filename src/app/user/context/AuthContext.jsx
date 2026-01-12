import { createContext, useContext, useState, useEffect } from "react";
import api from "../../../axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem("access_token") || null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    // Initialize: fetch user profile if token exists
    useEffect(() => {
        if (token) {
            fetchUser();
        } else {
            setLoading(false);
        }
    }, [token]);
    const fetchUser = async () => {
        try {
            const response = await api.get("/users");
            setUser(response.data.user);
        } catch (error) {
            console.error("Failed to fetch user", error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post("/login", { email, password });
            const { access_token, user } = response.data;

            localStorage.setItem("access_token", access_token);
            setToken(access_token);
            setUser(user);
            return { success: true, role: user.role };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Login failed",
                errors: error.response?.data?.errors
            };
        }
    };

    const register = async (data) => {
        try {
            const response = await api.post("/register", data);
            return { success: true, message: response.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Register failed",
                errors: error.response?.data?.errors
            };
        }
    };

    const verifyCode = async (email, code) => {
        try {
            const response = await api.post("/verify-code", { email, code });
            return { success: true, message: response.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Verification failed"
            };
        }
    };

    const resendCode = async (email) => {
        try {
            const response = await api.post("/resend-code", { email });
            return { success: true, message: response.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Resend code failed"
            };
        }
    };

    const forgotPassword = async (email) => {
        try {
            const response = await api.post("/forgot-password", { email });
            return { success: true, message: response.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Request failed"
            };
        }
    };

    const resetPassword = async (email, code, password, password_confirmation) => {
        try {
            const response = await api.post("/reset-password", {
                email, code, password, password_confirmation
            });
            return { success: true, message: response.data.message };
        } catch (error) {
            return {
                success: false,
                message: error.response?.data?.message || "Reset password failed"
            };
        }
    };

    const logout = async () => {
        try {
            // Attempt to call logout API, but clear local state regardless
            if (token) {
                await api.post("/logout");
            }
        } catch (error) {
            console.error("Logout error", error);
        } finally {
            localStorage.removeItem("access_token");
            setToken(null);
            setUser(null);
            navigate("/login");
        }
    };

    const loginWithToken = async (accessToken) => {
        localStorage.setItem("access_token", accessToken);
        setToken(accessToken);
        try {
            const response = await api.get("/users");
            setUser(response.data.user);
        } catch (error) {
            console.error("Failed to fetch user after token set", error);
            logout();
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            login,
            loginWithToken,
            register,
            verifyCode,
            resendCode,
            forgotPassword,
            resetPassword,
            logout,
            loading,
            setToken
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
