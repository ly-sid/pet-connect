"use client";

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useRouter } from 'next/navigation';

export default function ReportMissingPage() {
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Alert broadcasted to the community! We hope you find your pet soon.');
        router.push('/missing-pets');
    };

    return (
        <div className="max-w-2xl mx-auto">
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Report Missing Pet</h1>
            <Card padding="lg">
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="bg-yellow-50 p-4 rounded-md text-yellow-800 text-sm mb-2">
                        <strong>Tip:</strong> Provide clear photos and distinctive markings to help others identify your pet.
                    </div>

                    <Input label="Pet Name" placeholder="e.g. Rocky" required />

                    <div className="grid grid-cols-2 gap-4">
                        <Input label="Type" placeholder="Dog, Cat..." required />
                        <Input label="Breed" placeholder="e.g. Boxer" required />
                    </div>

                    <Input label="Last Seen Location" placeholder="Street, Landmark, City..." required />
                    <Input label="Date Lost" type="date" required />

                    <Input label="Contact Phone" placeholder="555-0123" required />

                    <div className="flex flex-col gap-1">
                        <label className="text-sm font-medium">Upload Photo</label>
                        <input type="file" className="border rounded-md p-2 text-sm" required />
                    </div>

                    <Button type="submit" variant="danger" fullWidth className="mt-4">
                        Broadcast Alert
                    </Button>
                </form>
            </Card>
        </div>
    );
}
