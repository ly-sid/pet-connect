"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function DonatePage() {
    const [amount, setAmount] = useState('50');
    const [type, setType] = useState<'ONE_TIME' | 'MONTHLY'>('ONE_TIME');

    const handleDonate = () => {
        alert(`Thank you for your ${type === 'MONTHLY' ? 'monthly' : ''} donation of ₹${amount}!`);
    };

    return (
        <div className="container py-12 max-w-4xl mx-auto">
            <div className="text-center mb-12">
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Support Our Mission</h1>
                <p className="text-subtle text-lg">Your contributions help us rescue, treat, and find homes for animals in need.</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 items-start">
                <Card padding="lg" className="border-t-4 border-t-blue-500">
                    <h2 className="font-bold text-xl mb-6">Make a Donation</h2>

                    <div className="flex gap-2 mb-6">
                        <Button
                            variant={type === 'ONE_TIME' ? 'primary' : 'outline'}
                            onClick={() => setType('ONE_TIME')}
                            fullWidth
                        >
                            One-Time
                        </Button>
                        <Button
                            variant={type === 'MONTHLY' ? 'primary' : 'outline'}
                            onClick={() => setType('MONTHLY')}
                            fullWidth
                        >
                            Monthly
                        </Button>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mb-6">
                        {['25', '50', '100', '250', '500'].map((val) => (
                            <button
                                key={val}
                                onClick={() => setAmount(val)}
                                style={{
                                    padding: '0.75rem',
                                    borderRadius: '0.5rem',
                                    border: amount === val ? '2px solid var(--accent-color)' : '1px solid var(--border-subtle)',
                                    backgroundColor: amount === val ? 'rgba(59, 130, 246, 0.05)' : 'white',
                                    fontWeight: 600,
                                    color: amount === val ? 'var(--accent-color)' : 'var(--text-primary)',
                                    cursor: 'pointer'
                                }}
                            >
                                ₹{val}
                            </button>
                        ))}
                        <div className="relative">
                            <span className="absolute left-3 top-2 text-gray-500">₹</span>
                            <input
                                className="w-full h-full pl-6 border rounded-md font-bold focus:outline-none focus:border-blue-500"
                                placeholder="Other"
                                onChange={(e) => setAmount(e.target.value)}
                            />
                        </div>
                    </div>

                    <Button size="lg" fullWidth onClick={handleDonate}>
                        Donate ₹{amount}
                    </Button>

                    <p className="text-xs text-center mt-4 text-subtle">
                        Secure payment processing. All donations are tax-deductible.
                    </p>
                </Card>

                <div className="flex flex-col gap-6">
                    <Card padding="md">
                        <h3 className="font-bold mb-2">Detailed receipts</h3>
                        <p className="text-sm text-secondary">Every donation comes with a transparent breakdown of how your money is used (Medical, Food, Shelter).</p>
                    </Card>
                    <Card padding="md">
                        <h3 className="font-bold mb-2">Sponsor an Animal</h3>
                        <p className="text-sm text-secondary">You can choose to sponsor a specific animal from their profile page to cover their adoption fee.</p>
                    </Card>
                    <div className="p-4 bg-blue-50 rounded-lg text-blue-800 text-sm">
                        <strong>Impact:</strong> Last month, donors like you helped treat 45 injured strays.
                    </div>
                </div>
            </div>
        </div>
    );
}
