"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { backendService } from '@/lib/backend-service';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import styles from './Intake.module.css';

export default function IntakePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        species: 'Dog',
        breed: '',
        age: '',
        gender: 'Male',
        location: '',
        description: '',
        fee: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];

            // Limit file size to 5MB
            if (file.size > 5 * 1024 * 1024) {
                alert("File size must be less than 5MB");
                return;
            }

            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) {
                    setPreview(ev.target.result as string);
                }
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Use the base64 preview string if available, otherwise use a placeholder
            const imageToUpload = preview || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80';

            await backendService.addAnimal({
                ...formData,
                age: parseInt(formData.age) || 0,
                fee: parseInt(formData.fee) || 0,
                status: 'AVAILABLE',
                images: [imageToUpload],
                gender: formData.gender as 'Male' | 'Female'
            });
            alert('Animal record saved successfully!');
            router.push('/dashboard/rescues');
        } catch (error) {
            console.error('Failed to save animal record:', error);
            alert('Failed to save record. Please try again.');
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
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#111', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>Register New Intake</h1>
                        <p style={{ color: '#666', fontSize: '1.1rem', margin: 0, maxWidth: '600px' }}>
                            Add a rescued animal to the platform's adoption roster.
                        </p>
                    </div>
                </div>

                <div style={{ padding: '40px', backgroundColor: '#fff', borderTop: '6px solid var(--primary-color, #111)', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', borderRadius: '16px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

                        {/* Section 1: Identification */}
                        <div>
                            <h3 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', color: '#999', margin: '0 0 20px 0', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Identification</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <Input
                                    label="Reference Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="e.g. Buddy, or Unknown"
                                />
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '20px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#444' }}>Species</label>
                                        <select
                                            name="species"
                                            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', backgroundColor: '#fff', width: '100%', boxSizing: 'border-box' }}
                                            value={formData.species}
                                            onChange={handleChange}
                                        >
                                            <option value="Dog">Dog</option>
                                            <option value="Cat">Cat</option>
                                            <option value="Bird">Bird</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <Input
                                        label="Breed / Profile"
                                        name="breed"
                                        value={formData.breed}
                                        onChange={handleChange}
                                        placeholder="e.g. Mixed, Golden Retriever"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2: Physical & History */}
                        <div>
                            <h3 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', color: '#999', margin: '0 0 20px 0', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Physical & Details</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '20px' }}>
                                    <Input
                                        label="Estimated Age (Years)"
                                        name="age"
                                        type="number"
                                        value={formData.age}
                                        onChange={handleChange}
                                    />
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#444' }}>Gender</label>
                                        <select
                                            name="gender"
                                            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', backgroundColor: '#fff', width: '100%', boxSizing: 'border-box' }}
                                            value={formData.gender}
                                            onChange={handleChange}
                                        >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                </div>

                                <Input
                                    label="Source / Rescued From"
                                    name="location"
                                    value={formData.location}
                                    onChange={handleChange}
                                    placeholder="e.g. South Street Rescue"
                                />

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#444' }}>Medical & Behavioral Profile</label>
                                    <textarea
                                        name="description"
                                        style={{ padding: '16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', width: '100%', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }}
                                        rows={4}
                                        value={formData.description}
                                        onChange={handleChange}
                                        placeholder="Describe personality, history, and medical conditions..."
                                    />
                                </div>

                                <Input
                                    label="Adoption Fee (₹)"
                                    name="fee"
                                    type="number"
                                    value={formData.fee}
                                    onChange={handleChange}
                                    placeholder="0"
                                />
                            </div>
                        </div>

                        {/* Section 3: Media */}
                        <div>
                            <h3 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', color: '#999', margin: '0 0 20px 0', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Profile Photograph</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#666' }}>Upload a clear photo to help adopters connect.</p>
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

                        {/* Footer */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', paddingTop: '20px', borderTop: '1px solid #eee' }}>
                            <Button variant="outline" type="button" onClick={() => router.back()}>Cancel Registration</Button>
                            <Button type="submit" loading={loading}>Save Intake Record</Button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
