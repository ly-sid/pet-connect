"use client";

import { useEffect, useState } from 'react';
import { backendService } from '@/lib/backend-service';
import { Animal } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function PatientsPage() {
    const [patients, setPatients] = useState<Animal[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPatients = async () => {
            setLoading(true);
            try {
                const data = await backendService.getAnimals();
                setPatients(data);
            } catch (error) {
                console.error('Failed to fetch patients:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, []);

    return (
        <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Patient Records</h1>

            {loading ? (
                <div className="text-center py-12 text-subtle">Loading patients...</div>
            ) : (
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
                                        {(animal.medicalHistory && animal.medicalHistory.length > 0) ? new Date(animal.medicalHistory[animal.medicalHistory.length - 1].date).toLocaleDateString() : 'N/A'}
                                    </div>
                                </div>
                                <Link href={`/dashboard/patients/${animal.id}`}>
                                    <Button variant="outline" size="sm">Open Record</Button>
                                </Link>
                            </div>
                        </Card>
                    ))}
                    {patients.length === 0 && (
                        <div className="text-center py-12 text-subtle">No patient records found.</div>
                    )}
                </div>
            )}
        </div>
    );
}
