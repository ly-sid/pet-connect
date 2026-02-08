"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Link from 'next/link';

// Mock Data for Missing Pets
const MISSING_PETS = [
    { id: 1, name: 'Rocky', type: 'Dog', breed: 'Boxer', dateLost: '2023-11-01', location: 'Park Avenue, NY', image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80', contact: '555-0123' },
    { id: 2, name: 'Luna', type: 'Cat', breed: 'Black Cat', dateLost: '2023-11-03', location: 'Brooklyn Heights', image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=400&q=80', contact: '555-0199' }
];

export default function MissingPetsPage() {
    return (
        <div className="container py-12">
            <div className="text-center mb-12">
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem', color: 'var(--error)' }}>Missing Pets</h1>
                <p className="text-subtle text-lg">Help us reunite these lost pets with their families. If you see them, please contact the owner immediately.</p>
                <div className="mt-6">
                    <Link href="/dashboard/report-missing">
                        <Button variant="danger" size="lg">Report a Missing Pet</Button>
                    </Link>
                </div>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
                {MISSING_PETS.map(pet => (
                    <Card key={pet.id} padding="none" className="border-red-100">
                        <div className="bg-red-500 text-white text-center py-1 font-bold tracking-wider text-sm uppercase">MISSING</div>
                        <div style={{ height: '240px', backgroundColor: '#e5e7eb', backgroundImage: `url(${pet.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        <div className="p-4">
                            <h3 className="font-bold text-xl mb-1">{pet.name}</h3>
                            <p className="text-secondary mb-3">{pet.breed} • Lost on {pet.dateLost}</p>

                            <div className="bg-red-50 p-3 rounded-md mb-4 text-sm text-red-800">
                                <strong>Last seen:</strong> {pet.location}
                            </div>

                            <Button fullWidth variant="outline" style={{ borderColor: 'var(--error)', color: 'var(--error)' }}>
                                Contact: {pet.contact}
                            </Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
