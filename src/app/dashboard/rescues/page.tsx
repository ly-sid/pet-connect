"use client";

import { useEffect, useState } from 'react';
import { mockService } from '@/lib/mock-data';
import { Animal } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function RescuesPage() {
    const [animals, setAnimals] = useState<Animal[]>([]);

    useEffect(() => {
        setAnimals(mockService.getAnimals());
    }, []);

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>My Rescued Animals</h1>
                <Link href="/dashboard/intake">
                    <Button>+ Register New Animal</Button>
                </Link>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {animals.map((animal) => (
                    <Card key={animal.id} padding="none">
                        <div style={{ height: '200px', backgroundColor: '#e5e7eb', backgroundImage: `url(${animal.images[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{animal.name}</h3>
                                <span style={{
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.5rem',
                                    borderRadius: '1rem',
                                    backgroundColor: animal.status === 'AVAILABLE' ? 'var(--success)' : '#e5e7eb',
                                    color: animal.status === 'AVAILABLE' ? 'white' : 'var(--text-secondary)'
                                }}>
                                    {animal.status}
                                </span>
                            </div>
                            <p className="text-subtle text-sm mb-4">{animal.breed} • {animal.age} years</p>
                            <div className="flex gap-2">
                                <Link href={`/dashboard/rescues/edit/${animal.id}`} className="w-full">
                                    <Button size="sm" variant="outline" fullWidth>Edit</Button>
                                </Link>
                                <Link href={`/dashboard/patients/${animal.id}`} className="w-full">
                                    <Button size="sm" variant="outline" fullWidth>Medical</Button>
                                </Link>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
