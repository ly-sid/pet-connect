"use client";

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/Card';
import { CountUp } from '@/components/ui/CountUp';
import { backendService } from '@/lib/backend-service';

export default function DashboardPage() {
    const { user } = useAuth();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchStats = async () => {
                try {
                    const data = await backendService.getDashboardStats();
                    setStats(data);
                } catch (error) {
                    console.error('Failed to fetch dashboard stats:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchStats();
        }
    }, [user]);

    if (!user) return <div className="text-center p-8">Please log in to view your dashboard.</div>;

    if (loading) return <div className="container py-8">Loading dashboard...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
                Hello, <span style={{ color: 'var(--accent-color)' }}>{user.name}</span>
            </h1>
            <p className="text-subtle mb-8">Here is what's happening today on Pet Connect.</p>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>

                {/* Dynamic Cards based on Role */}
                {user.role === 'ADMIN' && stats && (
                    <>
                        <StatsCard title="Pending Approvals" value={stats.pendingApprovals?.toString() || '0'} label="Adoption requests waiting" />
                        <StatsCard title="Total Animals" value={stats.totalAnimals?.toString() || '0'} label="Across all rescues" />
                        <StatsCard title="Platform Revenue" value={`₹${stats.platformRevenue?.toLocaleString() || '0'}`} label="Total donations collected" />
                    </>
                )}

                {user.role === 'RESCUE' && stats && (
                    <>
                        <StatsCard title="Active Listings" value={stats.activeListings?.toString() || '0'} label="Animals looking for homes" />
                        <StatsCard title="Pending Inquiries" value={stats.pendingInquiries?.toString() || '0'} label="Potential adopters" />
                    </>
                )}

                {user.role === 'VET' && (
                    <>
                        <StatsCard title="Appointments" value="0" label="Scheduled for today" />
                        <StatsCard title="Critical Cases" value="0" label="Needs attention" />
                    </>
                )}

                {user.role === 'USER' && stats && (
                    <>
                        <StatsCard title="My Applications" value={stats.myApplications?.toString() || '0'} label="Applications submitted" />
                        <StatsCard title="Favorites" value="0" label="Saved animals" />
                    </>
                )}

                {user.role === 'DONOR' && stats && (
                    <>
                        <StatsCard title="Total Contributed" value={`₹${stats.totalContributed?.toLocaleString() || '0'}`} label="Lifetime donations" />
                        <StatsCard title="Active Sponsorships" value="0" label="Animals supported monthly" />
                        <StatsCard title="Impact" value={stats.impactCount?.toString() || '0'} label="Donations made" />
                    </>
                )}

            </div>
        </div>
    );
}

function StatsCard({ title, value, label }: { title: string, value: string, label: string }) {
    // Parse value for animation (e.g., "₹4,50,000" -> prefix: "₹", number: 450000)
    const match = value.match(/^([^0-9\-\.]*)([\d,]+)(.*)$/);
    const prefix = match ? match[1] : '';
    const numericValue = match ? parseInt(match[2].replace(/,/g, ''), 10) : 0;
    const suffix = match ? match[3] : '';
    const isNumber = match !== null;

    return (
        <div className="animate-enter">
            <Card padding="lg">
                <h3 style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>{title}</h3>
                <div style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1 }}>
                    {isNumber ? (
                        <CountUp end={numericValue} prefix={prefix} suffix={suffix} />
                    ) : (
                        value
                    )}
                </div>
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: 'var(--text-light)' }}>{label}</p>
            </Card>
        </div>
    )
}
