"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import styles from './Sidebar.module.css';

export function Sidebar() {
    const { user } = useAuth();
    const pathname = usePathname();

    if (!user) return null;

    const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/') ? styles.active : '';

    return (
        <aside className={styles.sidebar}>
            <div className={styles.menu}>
                <div className={styles.sectionTitle}>Overview</div>
                <Link href="/dashboard" className={`${styles.item} ${isActive('/dashboard') && pathname === '/dashboard' ? styles.active : ''}`}>
                    Dashboard
                </Link>
                <Link href="/dashboard/notifications" className={`${styles.item} ${isActive('/dashboard/notifications')}`}>
                    Notifications
                </Link>

                {/* Role Specific Modules */}
                {(user.role === 'RESCUE' || user.role === 'ADMIN') && (
                    <>
                        <div className={styles.sectionTitle}>Rescue Operations</div>
                        <Link href="/dashboard/rescue-management" className={`${styles.item} ${isActive('/dashboard/rescue-management')}`}>
                            Transfer Requests
                        </Link>
                        <Link href="/dashboard/rescues" className={`${styles.item} ${isActive('/dashboard/rescues')}`}>
                            My Animals
                        </Link>
                        <Link href="/dashboard/intake" className={`${styles.item} ${isActive('/dashboard/intake')}`}>
                            New Intake
                        </Link>
                    </>
                )}

                {(user.role === 'VET' || user.role === 'ADMIN') && (
                    <>
                        <div className={styles.sectionTitle}>Medical</div>
                        <Link href="/dashboard/patients" className={`${styles.item} ${isActive('/dashboard/patients')}`}>
                            Patients
                        </Link>
                        <Link href="/dashboard/appointments" className={`${styles.item} ${isActive('/dashboard/appointments')}`}>
                            Appointments
                        </Link>
                    </>
                )}

                {(user.role === 'ADMIN') && (
                    <>
                        <div className={styles.sectionTitle}>Administration</div>
                        <Link href="/dashboard/users" className={`${styles.item} ${isActive('/dashboard/users')}`}>
                            User Management
                        </Link>
                        <Link href="/dashboard/reports" className={`${styles.item} ${isActive('/dashboard/reports')}`}>
                            Platform Reports
                        </Link>
                        <Link href="/dashboard/approvals" className={`${styles.item} ${isActive('/dashboard/approvals')}`}>
                            Adoption Approvals
                        </Link>
                        <Link href="/dashboard/marketplace" className={`${styles.item} ${isActive('/dashboard/marketplace')}`}>
                            Marketplace Inventory
                        </Link>
                    </>
                )}

                {(user.role === 'USER' || user.role === 'ADMIN') && (
                    <>
                        <div className={styles.sectionTitle}>Involvement</div>
                        <Link href="/dashboard/donations" className={`${styles.item} ${isActive('/dashboard/donations')}`}>
                            My Donations
                        </Link>
                        <Link href="/dashboard/my-rescues" className={`${styles.item} ${isActive('/dashboard/my-rescues')}`}>
                            Report Found Pet
                        </Link>
                        <Link href="/animals" className={`${styles.item} ${isActive('/animals')}`}>
                            Browse to Sponsor
                        </Link>
                    </>
                )}

                {/* Common for Everyone */}
                <div className={styles.sectionTitle}>Account</div>
                <Link href="/dashboard/favorites" className={`${styles.item} ${isActive('/dashboard/favorites')}`}>
                    My Favorites
                </Link>
                <Link href="/dashboard/profile" className={`${styles.item} ${isActive('/dashboard/profile')}`}>
                    My Profile
                </Link>
                <Link href="/dashboard/settings" className={`${styles.item} ${isActive('/dashboard/settings')}`}>
                    Settings
                </Link>
            </div>
        </aside>
    );
}
