"use client";

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const PRODUCTS = [
    { id: 1, name: 'Premium Dog Food', price: 45, image: 'https://images.unsplash.com/photo-1589924691195-41432c84c161?auto=format&fit=crop&w=400&q=80' },
    { id: 2, name: 'Cat Scratching Post', price: 35, image: 'https://images.unsplash.com/photo-1545249390-6bdfa2a27c62?auto=format&fit=crop&w=400&q=80' },
    { id: 3, name: 'Durable Leash', price: 20, image: 'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?auto=format&fit=crop&w=400&q=80' },
    { id: 4, name: 'Squeaky Toy Set', price: 15, image: 'https://images.unsplash.com/photo-1599583765518-98d67c51952f?auto=format&fit=crop&w=400&q=80' }
];

export default function MarketplacePage() {
    return (
        <div className="container py-8">
            <div className="flex justify-between items-center mb-8" style={{ flexWrap: 'wrap', gap: '1rem', width: '100%' }}>
                <div style={{ flex: '1 1 300px', minWidth: 0 }}>
                    <h1 style={{ fontSize: 'var(--mobile-h1, 2.5rem)', fontWeight: 800, marginBottom: '0.5rem' }}>Pet Marketplace</h1>
                    <p className="text-subtle" style={{ fontSize: '0.9rem' }}>Essentials for your furry friends. Proceeds support our shelter.</p>
                </div>
                <Button variant="outline" className="mobile-full-width" style={{ flexShrink: 0 }}>View Cart (0)</Button>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                {PRODUCTS.map(product => (
                    <Card key={product.id} padding="none" interactive>
                        <div style={{ height: '200px', backgroundColor: '#f3f4f6', backgroundImage: `url(${product.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                            <p className="text-secondary mb-4">₹{product.price * 80}.00</p>
                            <Button fullWidth onClick={() => alert('Added to cart!')}>Add to Cart</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
