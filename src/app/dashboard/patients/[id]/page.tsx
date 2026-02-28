"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { backendService } from '@/lib/backend-service';
import { Animal, MedicalRecord } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth-context';

export default function MedicalRecordPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [animal, setAnimal] = useState<Animal | null>(null);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [newRecord, setNewRecord] = useState({ diagnosis: '', treatment: '' });
    const [submitting, setSubmitting] = useState(false);

    const fetchAnimal = async () => {
        if (typeof id === 'string') {
            setLoading(true);
            try {
                const data = await backendService.getAnimalById(id);
                setAnimal(data);
            } catch (error) {
                console.error('Failed to fetch animal medical record:', error);
            } finally {
                setLoading(false);
            }
        }
    };

    useEffect(() => {
        fetchAnimal();
    }, [id]);

    const handleAddRecord = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!animal || !user) return;

        setSubmitting(true);
        try {
            await backendService.addMedicalRecord({
                animalId: animal.id,
                diagnosis: newRecord.diagnosis,
                treatment: newRecord.treatment,
                veterinarianName: user.name
            });
            setShowForm(false);
            setNewRecord({ diagnosis: '', treatment: '' });
            fetchAnimal(); // Refresh
        } catch (error) {
            alert('Failed to save record.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteRecord = async (recordId: string) => {
        if (!confirm('Are you sure you want to delete this medical record?')) return;

        try {
            await backendService.deleteMedicalRecord(recordId);
            fetchAnimal(); // Refresh list
        } catch (error) {
            alert('Failed to delete medical record.');
        }
    };

    if (loading) return <div className="container py-12 text-center">Loading...</div>;
    if (!animal) return <div className="container py-12 text-center">Record not found.</div>;

    return (
        <div>
            <div className="flex justify-between items-start mb-6">
                <div>
                    <button onClick={() => router.back()} className="text-sm text-subtle hover:text-primary mb-2">← Back to Patients</button>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Medical Record: {animal.name}</h1>
                    <p className="text-subtle">{animal.species} • {animal.age} {animal.age === 1 ? 'yr' : 'yrs'}</p>
                </div>
                {(user?.role === 'VET' || user?.role === 'ADMIN') && (
                    <Button onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancel' : '+ Add Diagnosis'}</Button>
                )}
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
                                <Button type="submit" loading={submitting}>Save Record</Button>
                            </div>
                        </form>
                    </Card>
                )}

                <div className="flex flex-col gap-4">
                    {(!animal.medicalRecords || animal.medicalRecords.length === 0) ? (
                        <div className="text-center py-8 text-subtle bg-gray-50 rounded-lg">No medical history recorded yet.</div>
                    ) : (
                        animal.medicalRecords.map((record: any) => (
                            <Card key={record.id} padding="md">
                                <div className="flex gap-4 items-start justify-between w-full">
                                    <div>
                                        <div className="font-bold text-lg">{record.diagnosis}</div>
                                        <div className="text-sm text-subtle">{new Date(record.date).toLocaleDateString()}</div>
                                    </div>
                                    {(user?.role === 'VET' || user?.role === 'ADMIN') && (
                                        <button
                                            onClick={() => handleDeleteRecord(record.id)}
                                            className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-md text-sm font-medium border border-red-200 transition-colors duration-200 flex items-center gap-1"
                                            title="Delete record"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            Delete
                                        </button>
                                    )}
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
