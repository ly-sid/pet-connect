"use client";

import { useEffect, useState } from 'react';
import { backendService } from '@/lib/backend-service';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
}

export default function MarketplacePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCartLoaded, setIsCartLoaded] = useState(false);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await backendService.getProducts('public');
                setProducts(data);
            } catch (error) {
                console.error('Failed to fetch products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();

        // Load cart from localStorage
        const storedCart = localStorage.getItem('petMarketplaceCart');
        if (storedCart) {
            try {
                setCart(JSON.parse(storedCart));
            } catch (e) {
                console.error("Failed to parse cart", e);
            }
        }
        setIsCartLoaded(true);
    }, []);

    // Sync cart to localStorage whenever it changes
    useEffect(() => {
        if (isCartLoaded) {
            localStorage.setItem('petMarketplaceCart', JSON.stringify(cart));
        }
    }, [cart, isCartLoaded]);

    const addToCart = (product: Product) => {
        setCart([...cart, product]);
        alert(`${product.name} added to cart!`);
    };

    return (
        <div className="container py-12 relative">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Pet Marketplace</h1>
                    <p className="text-subtle">Essentials for your furry friends. Proceeds support our shelter.</p>
                </div>
                <Link href="/marketplace/cart" target="_blank">
                    <Button variant="primary">
                        View Cart ({cart.length})
                    </Button>
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-12 text-subtle">Loading marketplace...</div>
            ) : products.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-subtle">No products available at the moment.</p>
                </div>
            ) : (
                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '2rem' }}>
                    {products.map(product => (
                        <Card key={product.id} padding="none" interactive>
                            <div style={{ height: '200px', backgroundColor: '#f3f4f6', backgroundImage: `url(${product.image})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                                <p className="text-secondary mb-4">₹{product.price}</p>
                                <Button fullWidth onClick={() => addToCart(product)}>Add to Cart</Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
