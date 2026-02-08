"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { mockService } from '@/lib/mock-data';
import { Animal } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import styles from './animals.module.css';

export default function AnimalSearchPage() {
    const [animals, setAnimals] = useState<Animal[]>([]);
    const [filtered, setFiltered] = useState<Animal[]>([]);
    const [search, setSearch] = useState('');
    const [speciesFilter, setSpeciesFilter] = useState('All');

    useEffect(() => {
        const allAnimals = mockService.getAnimals().filter(a => a.status === 'AVAILABLE');
        setAnimals(allAnimals);
        setFiltered(allAnimals);
    }, []);

    useEffect(() => {
        let result = animals;
        if (speciesFilter !== 'All') {
            result = result.filter(a => a.species === speciesFilter);
        }
        if (search) {
            result = result.filter(a =>
                a.name.toLowerCase().includes(search.toLowerCase()) ||
                a.breed.toLowerCase().includes(search.toLowerCase())
            );
        }
        setFiltered(result);
    }, [search, speciesFilter, animals]);

    return (
        <div className="container py-8">
            <div className="text-center mb-10">
                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Find Your Perfect Companion</h1>
                <p className="text-subtle">Browse our available pets and give them a forever home.</p>
            </div>

            <div className={`flex gap-4 mb-8 justify-center max-w-2xl mx-auto ${styles.filterContainer}`}>
                <div style={{ flex: 1, width: '100%' }}>
                    <Input
                        placeholder="Search by name or breed..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <select
                    className="border rounded-md px-4 py-2"
                    style={{ height: 'fit-content' }}
                    value={speciesFilter}
                    onChange={(e) => setSpeciesFilter(e.target.value)}
                >
                    <option value="All">All Species</option>
                    <option value="Dog">Dogs</option>
                    <option value="Cat">Cats</option>
                </select>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                {filtered.map(animal => (
                    <Link key={animal.id} href={`/animals/${animal.id}`}>
                        <Card padding="none" className="h-full" interactive>
                            <div style={{ height: '240px', backgroundColor: '#e5e7eb', backgroundImage: `url(${animal.images[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                            <div className="p-4">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{animal.name}</h3>
                                    <span style={{ fontWeight: 600, color: 'var(--accent-color)' }}>₹{animal.fee}</span>
                                </div>
                                <p className="text-subtle text-sm mb-3">{animal.breed} • {animal.age} yrs • {animal.gender}</p>
                                <Button fullWidth variant="outline">View Profile</Button>
                            </div>
                        </Card>
                    </Link>
                ))}
            </div>

            {filtered.length === 0 && (
                <div className="text-center py-12 text-subtle">No animals found matching your criteria.</div>
            )}
        </div>
    );
}
