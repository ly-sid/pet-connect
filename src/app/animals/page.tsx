"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { backendService } from '@/lib/backend-service';
import { Animal } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function AnimalSearchPage() {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [filtered, setFiltered] = useState<Animal[]>([]);
    const [search, setSearch] = useState('');
    const [speciesFilter, setSpeciesFilter] = useState('All');
    const [loading, setLoading] = useState(true);
    const [favoriteIds, setFavoriteIds] = useState<Set<string>>(new Set());

    // Using require to get Auth Context here to avoid refactoring the whole import structure
    const { useAuth } = require('@/lib/auth-context');
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            backendService.getFavorites().then(favs => {
                if (Array.isArray(favs)) {
                    setFavoriteIds(new Set(favs.map((f: Animal) => f.id)));
                }
            });
        }
    }, [user]);

    const toggleFav = async (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        if (!user) {
            alert("Please login to save favorites!");
            return;
        }

        const newSet = new Set(favoriteIds);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setFavoriteIds(newSet);

        try {
            await backendService.toggleFavorite(id);
        } catch (error) {
            console.error('Failed to toggle favorite', error);
            const revertSet = new Set(favoriteIds);
            setFavoriteIds(revertSet);
        }
    };

    useEffect(() => {
        const fetchAnimals = async () => {
            setLoading(true);
            try {
                const data = await backendService.getAnimals(speciesFilter);
                // Filter only available ones for public search
                const available = data.filter((a: Animal) => a.status === 'AVAILABLE');
                setAnimals(available);
                setFiltered(available);
            } catch (error) {
                console.error('Failed to fetch animals:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAnimals();
    }, [speciesFilter]);

    useEffect(() => {
        let result = animals;
        if (search) {
            result = result.filter(a =>
                a.name.toLowerCase().includes(search.toLowerCase()) ||
                a.breed.toLowerCase().includes(search.toLowerCase())
            );
        }
        setFiltered(result);
    }, [search, animals]);

    return (
        <div className="container py-8">
            <div className="text-center mb-10">
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Find Your Perfect Companion</h1>
                <p className="text-subtle">Browse our available pets and give them a forever home.</p>
            </div>

            <div className="flex gap-4 mb-8 justify-center max-w-2xl mx-auto">
                <div style={{ flex: 1 }}>
                    <Input
                        placeholder="Search by name or breed..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="border rounded-md px-4 py-2"
                    value={speciesFilter}
                    onChange={(e) => setSpeciesFilter(e.target.value)}
                >
                    <option value="All">All Species</option>
                    <option value="Dog">Dogs</option>
                    <option value="Cat">Cats</option>
                </select>
            </div>

            {loading ? (
                <div className="text-center py-12">Loading animals...</div>
            ) : (
                <>
                    <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                        {filtered.map(animal => (
                            <Card key={animal.id} padding="none" className="h-full relative overflow-hidden flex flex-col" interactive>
                                <Link href={`/animals/${animal.id}`} className="block relative">
                                    <div style={{ height: '240px', backgroundColor: '#e5e7eb', backgroundImage: `url(${animal.images[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                                </Link>

                                <button
                                    onClick={(e) => toggleFav(e, animal.id)}
                                    className={`absolute top-3 right-3 p-2 rounded-full shadow-md transition-transform flex items-center justify-center z-10 ${favoriteIds.has(animal.id) ? 'bg-white text-red-500 hover:scale-110' : 'bg-white/80 text-gray-400 hover:bg-white hover:text-red-500'}`}
                                    aria-label="Toggle favorite"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={favoriteIds.has(animal.id) ? 'currentColor' : 'none'} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={favoriteIds.has(animal.id) ? 0 : 2} d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                    </svg>
                                </button>

                                <div className="p-4 flex flex-col flex-1">
                                    <div className="flex justify-between items-center mb-1">
                                        <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{animal.name}</h3>
                                        <span style={{ fontWeight: 600, color: 'var(--accent-color)' }}>₹{animal.fee}</span>
                                    </div>
                                    <p className="text-subtle text-sm mb-3">{animal.breed} • {animal.age} yrs • {animal.gender}</p>
                                    <div className="mt-auto">
                                        <Link href={`/animals/${animal.id}`}>
                                            <Button fullWidth variant="outline">View Profile</Button>
                                        </Link>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {filtered.length === 0 && (
                        <div className="text-center py-12 text-subtle">No animals found matching your criteria.</div>
                    )}
                </>
            )}
        </div>
    );
}
