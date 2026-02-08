"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { backendService } from '@/lib/backend-service';
import { Animal } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/lib/auth-context';

export default function AnimalDetailsPage() {
    const { id } = useParams();
    const router = useRouter();
    const { user } = useAuth();
    const [animal, setAnimal] = useState<Animal | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (typeof id === 'string') {
            const fetchAnimal = async () => {
                setLoading(true);
                try {
                    const data = await backendService.getAnimalById(id);
                    setAnimal(data);
                } catch (error) {
                    console.error('Failed to fetch animal details:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchAnimal();
        }
    }, [id]);

    const handleAdopt = async () => {
        if (!user) {
            router.push('/login');
            return;
        }

        setSubmitting(true);
        try {
            await backendService.submitAdoptionRequest({
                animalId: animal!.id,
                message: "I would like to adopt this pet."
            });
            alert('Adoption request submitted! Wait for admin approval.');
            router.push('/dashboard');
        } catch (error) {
            alert('Failed to submit adoption request.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="container py-12 text-center">Loading...</div>;
    if (!animal) return <div className="container py-12 text-center">Animal not found.</div>;

    return (
        <div className="container py-12">
            <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                <div>
                    <div style={{
                        width: '100%',
                        height: '400px',
                        backgroundColor: '#e5e7eb',
                        backgroundImage: `url(${animal.images[0]})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        borderRadius: 'var(--radius-lg)'
                    }} />
                </div>

                <div>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h1 style={{ fontSize: '3rem', fontWeight: 800, lineHeight: 1 }}>{animal.name}</h1>
                            <p className="text-subtle text-lg mt-2">{animal.breed} • {animal.location}</p>
                        </div>
                        <div className="text-right">
                            <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--accent-color)' }}>₹{animal.fee}</div>
                            <div className="text-sm text-subtle">Adoption Fee</div>
                        </div>
                    </div>

                    <Card className="mb-8">
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="font-bold text-lg">{animal.age} yrs</div>
                                <div className="text-xs text-subtle uppercase">Age</div>
                            </div>
                            <div>
                                <div className="font-bold text-lg">{animal.gender}</div>
                                <div className="text-xs text-subtle uppercase">Gender</div>
                            </div>
                            <div>
                                <div className="font-bold text-lg">{animal.species}</div>
                                <div className="text-xs text-subtle uppercase">Species</div>
                            </div>
                        </div>
                    </Card>

                    <div className="mb-8">
                        <h3 className="font-bold text-lg mb-2">About {animal.name}</h3>
                        <p className="text-secondary leading-relaxed">{animal.description}</p>
                    </div>

                    <div className="flex gap-4">
                        <Button size="lg" fullWidth loading={submitting} onClick={handleAdopt}>Adopt {animal.name}</Button>
                        <Button size="lg" variant="outline">Sponsor</Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
