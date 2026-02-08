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
        <div className="container py-12">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Pet Marketplace</h1>
                    <p className="text-subtle">Essentials for your furry friends. Proceeds support our shelter.</p>
                </div>
                <Button variant="outline">View Cart (0)</Button>
            </div>

            <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
                {PRODUCTS.map(product => (
                    <Card key={product.id} padding="none">
                        <div style={{ height: '200px', backgroundColor: '#f3f4f6', backgroundImage: `url(${product.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                        <div className="p-4">
                            <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                            <p className="text-secondary mb-4">${product.price}.00</p>
                            <Button fullWidth onClick={() => alert('Added to cart!')}>Add to Cart</Button>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
