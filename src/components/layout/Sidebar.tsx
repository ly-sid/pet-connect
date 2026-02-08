"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import styles from './Sidebar.module.css';

interface SidebarProps {
    isOpen?: boolean;
    onClose?: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { user } = useAuth();
    const pathname = usePathname();

    if (!user) return null;

    const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/') ? styles.active : '';

    const handleLinkClick = () => {
        if (onClose) onClose();
    };

    return (
        <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
            <div className={styles.menu}>
                <div className={styles.sectionTitle}>Overview</div>
                <Link
                    href="/dashboard"
                    className={`${styles.item} ${isActive('/dashboard') && pathname === '/dashboard' ? styles.active : ''}`}
                    onClick={handleLinkClick}
                >
                    Dashboard
                </Link>
                <Link
                    href="/dashboard/notifications"
                    className={`${styles.item} ${isActive('/dashboard/notifications')}`}
                    onClick={handleLinkClick}
                >
                    Notifications
                </Link>


                {/* Role Specific Modules */}
                {(user.role === 'RESCUE' || user.role === 'ADMIN') && (
                    <>
                        <div className={styles.sectionTitle}>Rescue Operations</div>
                        <Link href="/dashboard/rescues" className={`${styles.item} ${isActive('/dashboard/rescues')}`} onClick={handleLinkClick}>
                            My Animals
                        </Link>
                        <Link href="/dashboard/intake" className={`${styles.item} ${isActive('/dashboard/intake')}`} onClick={handleLinkClick}>
                            New Intake
                        </Link>
                    </>
                )}

                {(user.role === 'VET' || user.role === 'ADMIN') && (
                    <>
                        <div className={styles.sectionTitle}>Medical</div>
                        <Link href="/dashboard/patients" className={`${styles.item} ${isActive('/dashboard/patients')}`} onClick={handleLinkClick}>
                            Patients
                        </Link>
                        <Link href="/dashboard/appointments" className={`${styles.item} ${isActive('/dashboard/appointments')}`} onClick={handleLinkClick}>
                            Appointments
                        </Link>
                    </>
                )}

                {(user.role === 'ADMIN') && (
                    <>
                        <div className={styles.sectionTitle}>Administration</div>
                        <Link href="/dashboard/users" className={`${styles.item} ${isActive('/dashboard/users')}`} onClick={handleLinkClick}>
                            User Management
                        </Link>
                        <Link href="/dashboard/reports" className={`${styles.item} ${isActive('/dashboard/reports')}`} onClick={handleLinkClick}>
                            Platform Reports
                        </Link>
                        <Link href="/dashboard/approvals" className={`${styles.item} ${isActive('/dashboard/approvals')}`} onClick={handleLinkClick}>
                            Adoption Approvals
                        </Link>
                    </>
                )}

                {(user.role === 'DONOR' || user.role === 'ADMIN') && (
                    <>
                        <div className={styles.sectionTitle}>Philanthropy</div>
                        <Link href="/dashboard/donations" className={`${styles.item} ${isActive('/dashboard/donations')}`} onClick={handleLinkClick}>
                            My Donations
                        </Link>
                        <Link href="/animals" className={`${styles.item} ${isActive('/animals')}`} onClick={handleLinkClick}>
                            Browse to Sponsor
                        </Link>
                    </>
                )}

                {/* Common for Everyone */}
                <div className={styles.sectionTitle}>Account</div>
                <Link href="/dashboard/profile" className={`${styles.item} ${isActive('/dashboard/profile')}`} onClick={handleLinkClick}>
                    My Profile
                </Link>
                <Link href="/dashboard/settings" className={`${styles.item} ${isActive('/dashboard/settings')}`} onClick={handleLinkClick}>
                    Settings
                </Link>
            </div>
        </aside>
    );
}
