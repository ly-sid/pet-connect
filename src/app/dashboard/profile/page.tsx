"use client";

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth-context';

export default function ProfilePage() {
    const { user } = useAuth();

    if (!user) return <div>Please log in</div>;

    return (
        <div className="max-w-2xl mx-auto">
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>My Profile</h1>

            <Card padding="lg" className="mb-6">
                <div className="flex items-center gap-6 mb-8">
                    <div style={{
                        width: '100px',
                        height: '100px',
                        borderRadius: '50%',
                        backgroundColor: '#e5e7eb',
                        backgroundImage: user.avatar ? `url(${user.avatar})` : 'none',
                        backgroundSize: 'cover'
                    }} />
                    <div>
                        <h2 className="font-bold text-xl">{user.name}</h2>
                        <p className="text-secondary mb-2">{user.email}</p>
                        <span className="px-2 py-1 bg-gray-100 rounded text-xs font-bold uppercase tracking-wider">{user.role}</span>
                    </div>
                    <Button variant="outline" className="ml-auto">Change Photo</Button>
                </div>

                <form className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Full Name" defaultValue={user.name} />
                        <Input label="Phone Number" defaultValue="(555) 123-4567" />
                    </div>
                    <Input label="Email Address" defaultValue={user.email} disabled />
                    <Input label="Address" defaultValue="123 Pet Lane, Animal City, AC 90210" />

                    <div className="flex justify-end mt-4">
                        <Button>Save Changes</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
