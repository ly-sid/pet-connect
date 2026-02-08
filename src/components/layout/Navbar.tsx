"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/Button';

export function Navbar() {
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMenuOpen]);

    const isActive = (path: string) => pathname === path ? styles.active : '';
    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <Link href={user ? "/dashboard" : "/"} className={styles.brand} onClick={() => setIsMenuOpen(false)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.logo}>
                        <path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58 1.57 3.8.74 5.42 1.62 1.03 2.16 3.48 1.45 5.37C21.82 15.82 20 18 16 18c-2.6 0-3.69 1.73-4 3-1-.95-2-3-4-3-4 0-5.82-2.18-6.61-4.21-.71-1.89-.17-4.34 1.45-5.37-.83-1.62-.66-4.84.74-5.42 1.39-.58 4.64.26 6.42 2.26.65-.17 1.33-.26 2-.26z" />
                    </svg>
                    <span>Pet Connect</span>
                </Link>

                <button className={styles.menuButton} onClick={toggleMenu} aria-label="Toggle menu">
                    {isMenuOpen ? (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18" />
                            <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                    ) : (
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="3" y1="12" x2="21" y2="12" />
                            <line x1="3" y1="6" x2="21" y2="6" />
                            <line x1="3" y1="18" x2="21" y2="18" />
                        </svg>
                    )}
                </button>

                <div className={`${styles.navLinks} ${isMenuOpen ? styles.open : ''}`}>
                    {(!user || user.role === 'USER') && (
                        <>
                            <Link href="/animals" className={`${styles.link} ${isActive('/animals')}`} onClick={() => setIsMenuOpen(false)}>Find a Pet</Link>
                            <Link href="/donate" className={`${styles.link} ${isActive('/donate')}`} onClick={() => setIsMenuOpen(false)}>Donate</Link>
                            <Link href="/marketplace" className={`${styles.link} ${isActive('/marketplace')}`} onClick={() => setIsMenuOpen(false)}>Shop</Link>
                        </>
                    )}

                    {(user && user.role !== 'USER') && (
                        <>
                            <Link href="/dashboard" className={`${styles.link} ${isActive('/dashboard')}`} onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                            <Link href="/animals" className={`${styles.link} ${isActive('/animals')}`} onClick={() => setIsMenuOpen(false)}>Public View</Link>
                        </>
                    )}

                    {/* Authentication Links in Mobile Overlay */}
                    <div className={`${styles.authButtons} ${isMenuOpen ? styles.open : 'mobile-hide'}`}>
                        {user ? (
                            <div className={styles.userMenu}>
                                <span className="mobile-show" style={{ marginBottom: '0.5rem', fontWeight: 600 }}>{user.name}</span>
                                <Button size="sm" variant="outline" fullWidth onClick={() => { logout(); setIsMenuOpen(false); }}>Log out</Button>
                            </div>
                        ) : (
                            <>
                                <Link href="/login" onClick={() => setIsMenuOpen(false)} style={{ width: '100%' }}>
                                    <Button size="sm" variant="ghost" fullWidth>Log in</Button>
                                </Link>
                                <Link href="/register" onClick={() => setIsMenuOpen(false)} style={{ width: '100%' }}>
                                    <Button size="sm" variant="primary" fullWidth>Sign up</Button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Desktop Authentication Buttons */}
                <div className={`${styles.authButtons} mobile-hide`}>
                    {user ? (
                        <div className={styles.userMenu}>
                            <span className="mobile-hide">{user.name} ({user.role})</span>
                            <Button size="sm" variant="outline" onClick={logout}>Log out</Button>
                        </div>
                    ) : (
                        <>
                            <Link href="/login">
                                <Button size="sm" variant="ghost">Log in</Button>
                            </Link>
                            <Link href="/register">
                                <Button size="sm" variant="primary">Sign up</Button>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}

