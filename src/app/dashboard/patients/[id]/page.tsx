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
                    <div style={{ padding: '40px', backgroundColor: '#fff', borderTop: '6px solid var(--primary-color, #111)', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', borderRadius: '16px', marginBottom: '30px' }}>
                        <h3 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', color: '#999', margin: '0 0 20px 0', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>New Clinical Entry</h3>
                        <form onSubmit={handleAddRecord} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                            <Input
                                label="Diagnosis / Reason for Visit"
                                value={newRecord.diagnosis}
                                onChange={e => setNewRecord({ ...newRecord, diagnosis: e.target.value })}
                                required
                            />
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#444' }}>Treatment Plan & Notes</label>
                                <textarea
                                    style={{ padding: '16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', width: '100%', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }}
                                    rows={5}
                                    value={newRecord.treatment}
                                    onChange={e => setNewRecord({ ...newRecord, treatment: e.target.value })}
                                    required
                                />
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px' }}>
                                <Button type="submit" loading={submitting}>Save Official Record</Button>
                            </div>
                        </form>
                    </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {(!animal.medicalRecords || animal.medicalRecords.length === 0) ? (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#888', backgroundColor: '#fafafa', borderRadius: '16px', border: '1px dashed #ddd' }}>No medical history recorded yet.</div>
                    ) : (
                        animal.medicalRecords.map((record: any) => (
                            <div key={record.id} style={{ padding: '30px', backgroundColor: '#fff', borderLeft: '4px solid var(--primary-color, #111)', boxShadow: '0 10px 30px rgba(0,0,0,0.04)', borderRadius: '12px' }}>
                                <div style={{ display: 'flex', gap: '15px', alignItems: 'flex-start', justifyContent: 'space-between', width: '100%', marginBottom: '15px' }}>
                                    <div>
                                        <div style={{ fontWeight: 800, fontSize: '1.25rem', color: '#111', marginBottom: '4px' }}>{record.diagnosis}</div>
                                        <div style={{ fontSize: '0.9rem', color: '#888' }}>{new Date(record.date).toLocaleDateString()}</div>
                                    </div>
                                    {(user?.role === 'VET' || user?.role === 'ADMIN') && (
                                        <button
                                            onClick={() => handleDeleteRecord(record.id)}
                                            style={{ color: '#e74c3c', backgroundColor: '#fdf0ed', padding: '6px 12px', borderRadius: '6px', fontSize: '0.875rem', fontWeight: 600, border: '1px solid #fadbd8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.2s' }}
                                            title="Delete record"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                                            Delete
                                        </button>
                                    )}
                                </div>
                                <p style={{ marginBottom: '20px', color: '#444', lineHeight: '1.6', fontSize: '1rem', padding: '15px', backgroundColor: '#fcfcfc', borderRadius: '8px', border: '1px solid #eee' }}>{record.treatment}</p>
                                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    Attending Vet: <span style={{ color: '#666' }}>{record.veterinarianName}</span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
