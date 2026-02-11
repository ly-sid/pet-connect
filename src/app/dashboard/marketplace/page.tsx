"use client";

import { useEffect, useState } from 'react';
import { backendService } from '@/lib/backend-service';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Product {
    id: number;
    name: string;
    price: number;
    image: string;
}

export default function AdminMarketplacePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        try {
            const data = await backendService.getProducts();
            setProducts(data);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this product?')) return;

        try {
            await backendService.deleteProduct(id);
            // Optimistic update or reload
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            alert('Failed to delete product');
            console.error(error);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Marketplace Inventory</h1>
                <Link href="/dashboard/marketplace/new">
                    <Button>+ Add New Product</Button>
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-12 text-subtle">Loading products...</div>
            ) : products.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <p className="text-subtle mb-4">No products found.</p>
                    <Link href="/dashboard/marketplace/new">
                        <Button>Add Your First Product</Button>
                    </Link>
                </div>
            ) : (
                <div className="flex flex-col gap-4">
                    {products.map((product) => (
                        <Card key={product.id} padding="none" className="overflow-hidden">
                            <div className="flex flex-row h-32">
                                {/* Column 1: Image */}
                                <div className="w-32 flex-shrink-0 relative bg-gray-100">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover absolute inset-0"
                                    />
                                </div>

                                {/* Column 2: Details */}
                                <div className="p-4 flex flex-col justify-center flex-grow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-lg mb-1">{product.name}</h3>
                                            <p className="text-secondary font-medium">₹{product.price}</p>
                                        </div>
                                        <Button
                                            variant="danger"
                                            size="sm"
                                            onClick={() => handleDelete(product.id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
