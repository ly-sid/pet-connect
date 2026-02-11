"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { backendService } from '@/lib/backend-service';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await backendService.addProduct({
                name: formData.name,
                price: parseFloat(formData.price),
                image: formData.image
            });
            alert('Product added successfully!');
            router.push('/dashboard/marketplace');
        } catch (error) {
            console.error('Failed to add product:', error);
            alert('Failed to add product. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container max-w-2xl mx-auto py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-2xl font-bold">Add New Product</h1>
                <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
            </div>

            <Card>
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <Input
                        label="Product Name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Premium Dog Food"
                        required
                    />

                    <Input
                        label="Price (₹)"
                        name="price"
                        type="number"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="0.00"
                        required
                    />

                    <Input
                        label="Image URL"
                        name="image"
                        value={formData.image}
                        onChange={handleChange}
                        placeholder="https://..."
                        required
                    />

                    {formData.image && (
                        <div className="mt-2">
                            <p className="text-sm font-medium mb-2 text-subtle">Preview:</p>
                            <div className="aspect-video w-full rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                                <img
                                    src={formData.image}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => (e.currentTarget.style.display = 'none')}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex justify-end pt-4">
                        <Button type="submit" loading={loading} fullWidth>
                            Add Product
                        </Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}
