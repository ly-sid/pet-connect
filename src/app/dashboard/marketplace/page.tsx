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
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <Card key={product.id} padding="none">
                            <div style={{
                                height: '200px',
                                backgroundColor: '#f3f4f6',
                                backgroundImage: `url(${product.image})`,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center'
                            }} />
                            <div className="p-4">
                                <h3 className="font-bold text-lg mb-1 truncate">{product.name}</h3>
                                <p className="text-secondary mb-4">₹{product.price}</p>
                                <Button
                                    variant="danger"
                                    size="sm"
                                    fullWidth
                                    onClick={() => handleDelete(product.id)}
                                >
                                    Delete Product
                                </Button>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
