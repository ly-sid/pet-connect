"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from './types';

interface AuthContextType {
    user: User | null;
    login: (email: string, role: UserRole) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // Load user from local storage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('pet_connect_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const login = (email: string, role: UserRole) => {
        // Mock login logic
        const newUser: User = {
            id: 'u_' + Math.random().toString(36).substr(2, 9),
            name: email.split('@')[0],
            email,
            role,
            avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=random`
        };
        setUser(newUser);
        localStorage.setItem('pet_connect_user', JSON.stringify(newUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('pet_connect_user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
