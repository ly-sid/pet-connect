"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { backendService } from '@/lib/backend-service';
import { Animal } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function MyFavoritesPage() {
    const [favorites, setFavorites] = useState<Animal[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchFavorites = async () => {
        setLoading(true);
        try {
            const data = await backendService.getFavorites();
            if (Array.isArray(data)) {
                setFavorites(data);
            } else {
                setFavorites([]);
            }
        } catch (error) {
            console.error('Failed to fetch favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFavorites();
    }, []);

    const handleUnfavorite = async (id: string) => {
        try {
            await backendService.toggleFavorite(id);
            // Optimistic update
            setFavorites(prev => prev.filter(a => a.id !== id));
        } catch (error) {
            console.error('Failed to unfavorite:', error);
            // Refresh if failed
            fetchFavorites();
        }
    };

    if (loading) return <div className="py-8">Loading your favorites...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>My Favorited Animals</h1>
            </div>

            {favorites.length === 0 ? (
                <Card padding="lg" className="text-center py-12">
                    <p className="text-subtle mb-4">You haven't saved any animals to your favorites yet.</p>
                    <Link href="/animals">
                        <Button>Browse Available Animals</Button>
                    </Link>
                </Card>
            ) : (
                <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                    {favorites.map(animal => (
                        <Card key={animal.id} padding="none" className="h-full relative overflow-hidden flex flex-col">
                            <Link href={`/animals/${animal.id}`} className="block relative">
                                <div style={{ height: '200px', backgroundColor: '#e5e7eb', backgroundImage: `url(${animal.images[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                            </Link>

                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    handleUnfavorite(animal.id);
                                }}
                                className="absolute top-3 right-3 bg-white p-2 rounded-full shadow-md text-red-500 hover:scale-110 transition-transform flex items-center justify-center z-10"
                                aria-label="Remove from favorites"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                                </svg>
                            </button>

                            <div className="p-4 flex flex-col flex-1">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{animal.name}</h3>
                                </div>
                                <p className="text-subtle text-sm mb-4">{animal.breed} • {animal.age} yrs</p>

                                <div className="mt-auto">
                                    <Link href={`/animals/${animal.id}`}>
                                        <Button fullWidth variant="outline" size="sm">View Profile</Button>
                                    </Link>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
