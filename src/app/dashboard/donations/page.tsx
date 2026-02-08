"use client";

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { backendService } from '@/lib/backend-service';
import { Donation } from '@/lib/types';
import Link from 'next/link';

export default function MyDonationsPage() {
    const [donations, setDonations] = useState<Donation[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDonations = async () => {
            try {
                const data = await backendService.getDonations();
                setDonations(data);
            } catch (error) {
                console.error('Failed to fetch donations:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDonations();
    }, []);

    if (loading) return <div className="container py-8">Loading your giving history...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>My Giving History</h1>
                <Button variant="outline">Download Annual Statement</Button>
            </div>

            {donations.length === 0 ? (
                <Card padding="lg" className="text-center py-12">
                    <p className="text-subtle mb-4">You haven't made any donations yet.</p>
                    <Link href="/donate">
                        <Button>Make Your First Donation</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {donations.map(donation => (
                        <Card key={donation.id} padding="md" className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="bg-green-100 text-green-800 font-bold p-3 rounded-lg text-center min-w-[80px]">
                                    <div className="text-xl">₹{donation.amount.toLocaleString()}</div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{donation.targetRaw || 'General Fund'}</h3>
                                    <p className="text-secondary text-sm">
                                        {donation.type === 'MONTHLY' ? 'Monthly' : 'One-Time'} • {new Date(donation.date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase rounded-full border border-green-100">
                                    COMPLETED
                                </span>
                                <Button variant="ghost" size="sm">Receipt</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}

            <div className="mt-8 bg-blue-50 p-6 rounded-lg text-center">
                <h3 className="font-bold text-blue-900 text-lg mb-2">Thank you for your support!</h3>
                <p className="text-blue-800 mb-4">Your contributions help provide food and medical care for animals in need.</p>
                <Link href="/donate">
                    <Button>Make a New Donation</Button>
                </Link>
            </div>
        </div>
    );
}

