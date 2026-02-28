"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { backendService } from '@/lib/backend-service';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import styles from '../../intake/Intake.module.css';

export default function NewProductPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        price: '',
        image: '',
        stock: '0'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            if (file.size > 5 * 1024 * 1024) {
                alert("File size must be less than 5MB");
                return;
            }

            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    const result = ev.target.result as string;
                    setPreview(result);
                    setFormData({ ...formData, image: result });
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await backendService.addProduct({
                name: formData.name,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                image: formData.image || 'https://images.unsplash.com/photo-1589924691195-41432c84c161?auto=format&fit=crop&w=400&q=80' // Default fallback
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
        <div style={{ padding: '20px 0', fontFamily: 'system-ui, sans-serif' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#111', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>Add New Product</h1>
                        <p style={{ color: '#666', fontSize: '1.1rem', margin: 0, maxWidth: '600px' }}>
                            List a new item in the marketplace inventory.
                        </p>
                    </div>
                </div>

                <div style={{ padding: '40px', backgroundColor: '#fff', borderTop: '6px solid var(--primary-color, #111)', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', borderRadius: '16px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

                        {/* Section 1: Product Image */}
                        <div>
                            <h3 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', color: '#999', margin: '0 0 20px 0', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Product Photography</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#666' }}>Upload a high-quality image of the product.</p>
                                <div style={{ border: '2px dashed #ccc', borderRadius: '12px', padding: '30px', position: 'relative', textAlign: 'center', backgroundColor: '#fafafa', cursor: 'pointer' }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', zIndex: 10 }}
                                        onChange={handleImageChange}
                                    />
                                    {preview ? (
                                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '15px' }}>
                                            <img src={preview} alt="Preview" style={{ width: '150px', height: '150px', objectFit: 'cover', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                                            <span style={{ color: '#2ecc71', fontWeight: 600 }}>Image Selected - Click to change</span>
                                        </div>
                                    ) : (
                                        <div style={{ color: '#888' }}>
                                            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>📷</div>
                                            <div style={{ fontWeight: 600 }}>Click or drag a photo here</div>
                                            <div style={{ fontSize: '0.8rem', marginTop: '5px' }}>Supports JPG/PNG up to 5MB</div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Product Details */}
                        <div>
                            <h3 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', color: '#999', margin: '0 0 20px 0', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Product Details</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <Input
                                    label="Product Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Premium Dog Food"
                                    required
                                />
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '20px' }}>
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
                                        label="Stock Quantity"
                                        name="stock"
                                        type="number"
                                        min="0"
                                        value={formData.stock}
                                        onChange={handleChange}
                                        placeholder="0"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel Registration</Button>
                            <Button type="submit" loading={loading}>Add Product</Button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
