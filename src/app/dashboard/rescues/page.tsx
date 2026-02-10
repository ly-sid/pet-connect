"use client";

import { useEffect, useState } from 'react';
import { backendService } from '@/lib/backend-service';
import { Animal } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default function RescuesPage() {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [loading, setLoading] = useState(true);
    const [showAdopted, setShowAdopted] = useState(false);

    useEffect(() => {
        const fetchAnimals = async () => {
            setLoading(true);
            try {
                const data = await backendService.getAnimals();
                setAnimals(data);
            } catch (error) {
                console.error('Failed to fetch rescues:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnimals();
    }, []);

    const availableAnimals = animals.filter(a => a.status !== 'ADOPTED');
    const adoptedAnimals = animals.filter(a => a.status === 'ADOPTED');

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>My Rescued Animals</h1>
                <Link href="/dashboard/intake">
                    <Button>+ Register New Animal</Button>
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-12 text-subtle">Loading animals...</div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                    {/* Available Section */}
                    <section className={adoptedAnimals.length > 0 ? "lg:col-span-3" : "py-4 lg:col-span-4"}>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            Available for Adoption
                            <span className="text-sm font-normal text-subtle px-2 py-0.5 bg-gray-100 rounded-full">{availableAnimals.length}</span>
                        </h2>
                        {availableAnimals.length === 0 ? (
                            <div className="text-center py-8 text-subtle bg-gray-50 rounded-lg">No animals currently available for adoption.</div>
                        ) : (
                            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                                {availableAnimals.map((animal) => (
                                    <Card key={animal.id} padding="none">
                                        <div style={{ height: '200px', backgroundColor: '#e5e7eb', backgroundImage: `url(${animal.images[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                                        <div className="p-4">
                                            <div className="flex justify-between items-start mb-2">
                                                <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{animal.name}</h3>
                                                <span style={{
                                                    fontSize: '0.75rem',
                                                    padding: '0.25rem 0.5rem',
                                                    borderRadius: '1rem',
                                                    backgroundColor: animal.status === 'AVAILABLE' ? '#10b981' : '#e5e7eb',
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
                        )}
                    </section>

                    {/* Adopted Section - Sidebar */}
                    {adoptedAnimals.length > 0 && (
                        <div className="lg:col-span-1 border-l pl-8 border-gray-100 min-h-[500px]">
                            <div
                                onClick={() => setShowAdopted(!showAdopted)}
                                className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow mb-4"
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h2 className="text-lg font-bold text-gray-800">Happily Adopted</h2>
                                    <span className="text-xs font-bold text-white px-2 py-0.5 bg-green-500 rounded-full">{adoptedAnimals.length}</span>
                                </div>
                                <p className="text-subtle text-xs">
                                    {showAdopted ? "Click to collapse list." : "Click to view success stories."}
                                </p>
                            </div>

                            {showAdopted && (
                                <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                    {adoptedAnimals
                                        .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                                        .map((animal) => (
                                            <Card key={animal.id} padding="none" className="opacity-75 hover:opacity-100 transition-opacity bg-white">
                                                <div style={{ height: '120px', backgroundColor: '#e5e7eb', backgroundImage: `url(${animal.images[0]})`, backgroundSize: 'cover', backgroundPosition: 'center', filter: 'grayscale(100%)' }} />
                                                <div className="p-3">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-bold text-sm">{animal.name}</h3>
                                                            <p className="text-xs text-subtle">{animal.breed}</p>
                                                        </div>
                                                        <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                                                            {new Date(animal.updatedAt).toLocaleDateString(undefined, { month: 'short', year: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <div className="mt-3">
                                                        <Link href={`/dashboard/rescues/edit/${animal.id}`} className="w-full">
                                                            <Button size="sm" variant="outline" fullWidth>View Details</Button>
                                                        </Link>
                                                    </div>
                                                </div>
                                            </Card>
                                        ))}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
