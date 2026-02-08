"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { UserRole } from '@/lib/types';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<UserRole>('USER'); // For demo purposes, allow selecting role
    const { login } = useAuth();
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate login
        login(email, role);
        router.push('/dashboard');
    };

    return (
        <Card padding="lg">
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Welcome Back</h1>
                <p className="text-subtle">Enter your credentials to access your account</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <Input
                    label="Email Address"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    label="Password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <label style={{ fontSize: '0.875rem', fontWeight: 500 }}>Select Role (Demo Only)</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value as UserRole)}
                        style={{
                            padding: '0.625rem',
                            borderRadius: '0.375rem',
                            border: '1px solid var(--border-subtle)',
                            fontFamily: 'inherit'
                        }}
                    >
                        <option value="USER">Public User</option>
                        <option value="ADMIN">Administrator</option>
                        <option value="RESCUE">Rescue Team</option>
                        <option value="VET">Veterinarian</option>
                        <option value="DONOR">Donor</option>
                    </select>
                </div>

                <Button type="submit" fullWidth className="mt-4">
                    Sign In
                </Button>
            </form>

            <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem' }}>
                <span className="text-subtle">Don't have an account? </span>
                <Link href="/register" className="text-accent" style={{ fontWeight: 500 }}>
                    Create one
                </Link>
            </div>
        </Card>
    );
}
