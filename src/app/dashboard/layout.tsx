import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/lib/auth-context';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, isAuthenticated } = useAuth();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!isAuthenticated) {
                // router.push('/login'); 
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [isAuthenticated, router]);

    return (
        <div style={{ display: 'flex', minHeight: 'calc(100vh - 4rem)', position: 'relative' }}>
            {/* Mobile Sidebar Toggle */}
            <button
                className="desktop-hide"
                style={{
                    position: 'fixed',
                    bottom: '2rem',
                    left: '2rem',
                    zIndex: 1100,
                    width: '3.5rem',
                    height: '3.5rem',
                    borderRadius: '50%',
                    backgroundColor: 'var(--primary-color)',
                    color: 'white',
                    border: 'none',
                    boxShadow: 'var(--shadow-lg)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            >
                {isSidebarOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
                )}
            </button>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <div style={{ flex: 1, padding: '2rem', backgroundColor: 'var(--bg-secondary)', width: '100%' }}>
                <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                    {children}
                </div>
            </div>

            {/* Backdrop for mobile */}
            {
                isSidebarOpen && (
                    <div
                        className="desktop-hide"
                        style={{
                            position: 'fixed',
                            inset: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            zIndex: 900
                        }}
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )
            }
        </div >
    );
}
