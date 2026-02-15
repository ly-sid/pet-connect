"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { backendService } from '@/lib/backend-service';

export default function EditProductPage(props: { params: Promise<{ id: string }> }) {
    const params = use(props.params);
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image: '',
        stock: '0'
    });

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                // We'll add getProduct to backendService or fetch directly
                const response = await fetch(`/api/products/${params.id}`);
                const data = await response.json();

                if (response.ok) {
                    setFormData({
                        name: data.name,
                        price: data.price.toString(),
                        image: data.image,
                        stock: data.stock ? data.stock.toString() : '0'
                    });
                } else {
                    alert('Failed to load product');
                    router.push('/dashboard/marketplace');
                }
            } catch (error) {
                console.error('Error loading product:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [params.id, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const response = await fetch(`/api/products/${params.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            if (response.ok) {
                router.push('/dashboard/marketplace');
                router.refresh();
            } else {
                alert('Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
            alert('An error occurred');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center text-gray-500">Loading product details...</div>;
    }

    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
            <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

            <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-xl border shadow-sm">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Name
                    </label>
                    <Input
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="e.g. Premium Dog Food"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price (₹)
                        </label>
                        <Input
                            required
                            type="number"
                            min="0"
                            step="0.01"
                            value={formData.price}
                            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                            placeholder="0.00"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Stock Quantity
                        </label>
                        <Input
                            required
                            type="number"
                            min="0"
                            step="1"
                            value={formData.stock}
                            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                            placeholder="0"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Product Image
                    </label>
                    <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-gray-400 transition-colors bg-gray-50 text-center cursor-pointer group">
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    if (file.size > 5 * 1024 * 1024) {
                                        alert("File size must be less than 5MB");
                                        return;
                                    }
                                    const reader = new FileReader();
                                    reader.onload = (ev) => {
                                        if (ev.target?.result) {
                                            setFormData({ ...formData, image: ev.target.result as string });
                                        }
                                    };
                                    reader.readAsDataURL(file);
                                }
                            }}
                        />
                        {formData.image ? (
                            <div className="relative">
                                <img
                                    src={formData.image}
                                    alt="Product Preview"
                                    className="h-48 w-full object-contain mx-auto rounded mb-2"
                                />
                                <p className="text-xs text-gray-500 mt-2 group-hover:text-blue-600 transition-colors">Click to change image</p>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-4">
                                <svg className="w-12 h-12 text-gray-300 mb-2 group-hover:text-gray-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-600 group-hover:text-blue-600 transition-colors">Click to upload image</span>
                                <span className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</span>
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => router.back()}
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        disabled={saving}
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
