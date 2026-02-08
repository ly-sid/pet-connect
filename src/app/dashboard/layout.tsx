"use client";

import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        // If we're fully loaded and not authenticated, redirect
        // Note: In a real app we'd have a loading state
        const timer = setTimeout(() => {
            if (!isAuthenticated) {
                // router.push('/login'); 
                // Commented out to allow looking at the layout without strictly enforcing login loop for demo if context is lost
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [isAuthenticated, router]);

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 4rem - 200px)' }}> {/* Adjust height */}
            <Sidebar />
            <div style={{ flex: 1, padding: '2rem', backgroundColor: 'var(--bg-secondary)' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    {children}
                </div>
            </div>
        </div>
    );
}
