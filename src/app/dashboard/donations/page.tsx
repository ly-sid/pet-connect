"use client";

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

const DONATIONS = [
    { id: 'TXN-8821', date: 'Oct 24, 2023', amount: 50, type: 'One-Time', recipient: 'General Fund', status: 'Completed' },
    { id: 'TXN-7742', date: 'Sep 24, 2023', amount: 25, type: 'Monthly', recipient: 'Sponsorship: Bella', status: 'Completed' },
    { id: 'TXN-6615', date: 'Aug 24, 2023', amount: 25, type: 'Monthly', recipient: 'Sponsorship: Bella', status: 'Completed' },
];

export default function MyDonationsPage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>My Giving History</h1>
                <Button variant="outline">Download Annual Statement</Button>
            </div>

            <div className="grid gap-4">
                {DONATIONS.map(donation => (
                    <Card key={donation.id} padding="md" className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="bg-green-100 text-green-800 font-bold p-3 rounded-lg text-center min-w-[60px]">
                                <div className="text-xl">₹{donation.amount}</div>
                            </div>
                            <div>
                                <h3 className="font-bold text-lg">{donation.recipient}</h3>
                                <p className="text-secondary text-sm">{donation.type} • {donation.date}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="px-2 py-1 bg-green-50 text-green-700 text-xs font-bold uppercase rounded-full border border-green-100">
                                {donation.status}
                            </span>
                            <Button variant="ghost" size="sm">Receipt</Button>
                        </div>
                    </Card>
                ))}
            </div>

            <div className="mt-8 bg-blue-50 p-6 rounded-lg text-center">
                <h3 className="font-bold text-blue-900 text-lg mb-2">Thank you for your support!</h3>
                <p className="text-blue-800 mb-4">Your contributions have helped provide food and medical care for over 50 animals this year.</p>
                <Link href="/donate">
                    <Button>Make a New Donation</Button>
                </Link>
            </div>
        </div>
    );
}
