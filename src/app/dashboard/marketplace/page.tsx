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
    stock?: number;
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
            setProducts(products.filter(p => p.id !== id));
        } catch (error) {
            alert('Failed to delete product');
            console.error(error);
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Marketplace Inventory</h1>
                <Link href="/dashboard/marketplace/new">
                    <Button className="rounded-xl shadow-sm px-6 py-2.5">+ Add New Product</Button>
                </Link>
            </div>

            {loading ? (
                <div className="text-center py-16 text-gray-400">Loading products...</div>
            ) : products.length === 0 ? (
                <div className="text-center py-24 bg-white border border-dashed border-gray-200 rounded-xl">
                    <p className="text-gray-500 mb-6 text-lg">Your inventory is empty.</p>
                    <Link href="/dashboard/marketplace/new">
                        <Button variant="outline" className="rounded-xl">Add Your First Product</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="bg-white border border-gray-200 rounded-xl p-4 flex gap-5 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 items-start"
                        >
                            {/* Left: Image (Square as per sketch) */}
                            <div
                                className="flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden border border-gray-100 relative"
                                style={{ width: '128px', height: '128px', minWidth: '128px' }}
                            >
                                {product.image ? (
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-full object-cover"
                                        style={{ width: '100%', height: '100%' }}
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                        <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Right: Details & Actions */}
                            {/* Right: Details & Actions */}
                            <div className="flex-grow flex flex-col justify-between h-32 ml-4">
                                <div>
                                    <h3 className="text-xl font-bold text-gray-900 leading-tight mb-2">{product.name}</h3>

                                    <div className="mt-4 space-y-2">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="font-semibold text-gray-500 uppercase tracking-wide text-xs w-16">Price:</span>
                                            <span className="font-bold text-gray-900 text-base">₹{product.price.toLocaleString('en-IN')}</span>
                                        </div>
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="font-semibold text-gray-500 uppercase tracking-wide text-xs w-16">Stock:</span>
                                            <span className={`font-bold text-base ${product.stock && product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                                                {product.stock || 0} units
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Buttons: Bottom Aligned */}
                                <div className="flex gap-3 mt-auto items-center">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-8 text-xs px-3"
                                        onClick={() => router.push(`/dashboard/marketplace/edit/${product.id}`)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="danger"
                                        size="sm"
                                        className="h-8 text-xs px-3 bg-red-600 text-white hover:bg-red-700 border-none shadow-sm"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
