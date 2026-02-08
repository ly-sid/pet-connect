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
        // Simulate image preview
        if (e.target.files && e.target.files[0]) {
            const reader = new FileReader();
            reader.onload = (ev) => {
                if (ev.target?.result) setPreview(ev.target.result as string);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            await backendService.addAnimal({
                ...formData,
                age: parseInt(formData.age) || 0,
                fee: parseInt(formData.fee) || 0,
                status: 'AVAILABLE',
                images: [preview || 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=600&q=80'],
                gender: formData.gender as 'Male' | 'Female'
            });
            router.push('/dashboard/rescues');
        } catch (error) {
            console.error('Failed to save animal record:', error);
            alert('Failed to save record.');
        } finally {
            setLoading(false);
        }
    };


    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>Register New Intake</h1>
                    <p className="text-subtle">Add a rescued animal to the platform</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Saving...' : 'Save Record'}
                    </Button>
                </div>
            </div>

            <form className={styles.grid}>
                {/* Left Column: Media & Core ID */}
                <div className={styles.imageSection}>
                    <Card padding="none" className={styles.imageUpload}>
                        <input
                            type="file"
                            accept="image/*"
                            className="absolute inset-0 opacity-0 cursor-pointer"
                            onChange={handleImageChange}
                        />
                        {preview ? (
                            <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <>
                                <svg className="w-12 h-12 mb-2 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <span className="font-medium text-sm">Click to upload photo</span>
                            </>
                        )}
                    </Card>

                    <Card padding="md">
                        <div className={styles.sectionLabel}>Identification</div>
                        <div className="flex flex-col gap-4">
                            <Input
                                label="Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="e.g. Buddy"
                            />

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">Species</label>
                                <select name="species" value={formData.species} onChange={handleChange} className={styles.select}>
                                    <option value="Dog">Dog</option>
                                    <option value="Cat">Cat</option>
                                    <option value="Bird">Bird</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>

                            <Input
                                label="Breed"
                                name="breed"
                                value={formData.breed}
                                onChange={handleChange}
                                placeholder="e.g. Mixed"
                            />
                        </div>
                    </Card>
                </div>

                {/* Right Column: Details */}
                <div className={styles.formSection}>
                    <Card padding="md">
                        <div className={styles.sectionLabel}>Physical Details</div>
                        <div className={styles.row}>
                            <Input
                                label="Age (Years)"
                                name="age"
                                type="number"
                                value={formData.age}
                                onChange={handleChange}
                            />
                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">Gender</label>
                                <select name="gender" value={formData.gender} onChange={handleChange} className={styles.select}>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                </select>
                            </div>
                        </div>
                    </Card>

                    <Card padding="md">
                        <div className={styles.sectionLabel}>History & Status</div>
                        <div className="flex flex-col gap-4">
                            <Input
                                label="Source / Location"
                                name="location"
                                value={formData.location}
                                onChange={handleChange}
                                placeholder="e.g. South Street Rescue"
                            />

                            <div className="flex flex-col gap-1">
                                <label className="text-sm font-medium">Description & Medical Notes</label>
                                <textarea
                                    name="description"
                                    className={styles.textarea}
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Describe personality, history, and any medical conditions..."
                                />
                            </div>
                        </div>
                    </Card>

                    <Card padding="md">
                        <div className={styles.sectionLabel}>Adoption</div>
                        <Input
                            label="Adoption Fee (₹)"
                            name="fee"
                            type="number"
                            value={formData.fee}
                            onChange={handleChange}
                        />
                    </Card>
                </div>
            </form>
        </div>
    );
}
