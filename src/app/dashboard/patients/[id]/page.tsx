"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockService } from '@/lib/mock-data';
import { Animal, MedicalRecord } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function MedicalRecordPage() {
    const { id } = useParams();
    const router = useRouter();
    const [animal, setAnimal] = useState<Animal | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [newRecord, setNewRecord] = useState({ diagnosis: '', treatment: '' });

    useEffect(() => {
        if (typeof id === 'string') {
            setAnimal(mockService.getAnimalById(id) || null);
        }
    }, [id]);

    const handleAddRecord = (e: React.FormEvent) => {
        e.preventDefault();
        if (!animal) return;

        // Direct mutation of mock object for demo simplicity
        // In real app, call service method
        const record: MedicalRecord = {
            id: Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString().split('T')[0],
            diagnosis: newRecord.diagnosis,
            treatment: newRecord.treatment,
            veterinarianName: 'Dr. Current User'
        };

        animal.medicalHistory.push(record);
        setShowForm(false);
        setNewRecord({ diagnosis: '', treatment: '' });
    };

    if (!animal) return <div>Loading...</div>;

    return (
        <div>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <button onClick={() => router.back()} className="text-sm text-subtle hover:text-primary mb-2">← Back to Patients</button>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Medical Record: {animal.name}</h1>
                    <p className="text-subtle">ID: {animal.id} • {animal.species} • {animal.age} yrs</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add Diagnosis'}</Button>
            </div>

            <div className="grid gap-6">
                {showForm && (
                    <Card padding="md" className="border-l-4 border-l-blue-500">
                        <h3 className="font-bold mb-4">New Clinical Entry</h3>
                        <form onSubmit={handleAddRecord} className="flex flex-col gap-4">
                            <Input
                                label="Diagnosis"
                                value={newRecord.diagnosis}
                                onChange={e => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
                                required
                            />
                            <Input
                                label="Treatment Plan"
                                value={newRecord.treatment}
                                onChange={e => setNewRecord({ ...newRecord, treatment: e.target.value })}
                                required
                            />
                            <div className="flex justify-end">
                                <Button type="submit">Save Record</Button>
                            </div>
                        </form>
                    </Card>
                )}

                <div className="flex flex-col gap-4">
                    {animal.medicalHistory.length === 0 ? (
                        <div className="text-center py-8 text-subtle bg-gray-50 rounded-lg">No medical history recorded yet.</div>
                    ) : (
                        animal.medicalHistory.map(record => (
                            <Card key={record.id} padding="md">
                                <div className="flex justify-between mb-2">
                                    <div className="font-bold text-lg">{record.diagnosis}</div>
                                    <div className="text-sm text-subtle">{record.date}</div>
                                </div>
                                <p className="mb-4 text-secondary">{record.treatment}</p>
                                <div className="text-xs font-medium text-subtle uppercase tracking-wide">
                                    Attending Vet: {record.veterinarianName}
                                </div>
                            </Card>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
