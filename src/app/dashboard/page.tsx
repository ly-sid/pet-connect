"use client";

import { useAuth } from '@/lib/auth-context';
import { Card } from '@/components/ui/Card';
import { CountUp } from '@/components/ui/CountUp';

export default function DashboardPage() {
    const { user } = useAuth();

    if (!user) return <div className="text-center p-8">Please log in to view your dashboard.</div>;

    return (
        <div>
            <h1 style={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
                Hello, <span style={{ color: 'var(--accent-color)' }}>{user.name}</span>
            </h1>
            <p className="text-subtle mb-8">Here is what's happening today on Pet Connect.</p>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>

                {/* Dynamic Cards based on Role */}
                {user.role === 'ADMIN' && (
                    <>
                        <StatsCard title="Pending Approvals" value="12" label="Adoption requests waiting" />
                        <StatsCard title="Total Animals" value="256" label="Across all rescues" />
                        <StatsCard title="Platform Revenue" value="₹4,50,000" label="Donations this month" />
                    </>
                )}

                {user.role === 'RESCUE' && (
                    <>
                        <StatsCard title="Active Listings" value="8" label="Animals looking for homes" />
                        <StatsCard title="Pending Inquiries" value="3" label="Potential adopters" />
                    </>
                )}

                {user.role === 'VET' && (
                    <>
                        <StatsCard title="Appointments" value="4" label="Scheduled for today" />
                        <StatsCard title="Critical Cases" value="1" label="Needs attention" />
                    </>
                )}

                {user.role === 'USER' && (
                    <>
                        <StatsCard title="My Applications" value="1" label="Pending review" />
                        <StatsCard title="Favorites" value="5" label="Saved animals" />
                    </>
                )}

                {user.role === 'DONOR' && (
                    <>
                        <StatsCard title="Total Contributed" value="₹1,25,000" label="Lifetime donations" />
                        <StatsCard title="Active Sponsorships" value="2" label="Animals supported monthly" />
                        <StatsCard title="Impact" value="15" label="Animals helped" />
                    </>
                )}

            </div>
        </div>
    );
}

function StatsCard({ title, value, label }: { title: string, value: string, label: string }) {
    // Parse value for animation (e.g., "₹4,50,000" -> prefix: "₹", number: 450000)
    const match = value.match(/^([^0-9]*)([\d,]+)(.*)$/);
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
