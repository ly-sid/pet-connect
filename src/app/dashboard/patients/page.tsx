"use client";

import { useEffect, useState } from 'react';
import { mockService } from '@/lib/mock-data';
import { Animal } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function PatientsPage() {
    const [patients, setPatients] = useState<Animal[]>([]);

    useEffect(() => {
        // In a real app, this would be filtered by animals assigned to this vet or all if general vet
        setPatients(mockService.getAnimals());
    }, []);

    return (
        <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Patient Records</h1>

            <div className="grid gap-4">
                {patients.map((animal) => (
                    <Card key={animal.id} padding="sm" className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '50%',
                                backgroundColor: '#e5e7eb',
                                backgroundImage: `url(${animal.images[0]})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }} />
                            <div>
                                <h3 className="font-bold">{animal.name}</h3>
                                <p className="text-sm text-subtle">{animal.species} • {animal.breed}</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <div className="text-right">
                                <div className="font-medium text-sm">Last Visit</div>
                                <div className="text-sm text-subtle">
                                    {animal.medicalHistory.length > 0 ? animal.medicalHistory[animal.medicalHistory.length - 1].date : 'N/A'}
                                </div>
                            </div>
                            <Link href={`/dashboard/patients/${animal.id}`}>
                                <Button variant="outline" size="sm">Open Record</Button>
                            </Link>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
