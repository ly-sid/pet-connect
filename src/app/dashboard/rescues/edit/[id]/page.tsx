"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { backendService } from '@/lib/backend-service';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Animal } from '@/lib/types';
import styles from '../../../intake/Intake.module.css'; // Reuse styles

export default function EditAnimalPage() {
    const router = useRouter();
    const { id } = useParams();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const [isAdopted, setIsAdopted] = useState(false);

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

    useEffect(() => {
        if (typeof id === 'string') {
            const fetchAnimal = async () => {
                setLoading(true);
                try {
                    const animal = await backendService.getAnimalById(id);
                    if (animal) {
                        setFormData({
                            name: animal.name,
                            species: animal.species,
                            breed: animal.breed,
                            age: animal.age.toString(),
                            gender: animal.gender,
                            location: animal.location,
                            description: animal.description,
                            fee: animal.fee.toString()
                        });
                        setPreview(animal.images[0]);
                        setIsAdopted(animal.status === 'ADOPTED');
                    }
                } catch (error) {
                    console.error('Failed to fetch animal details:', error);
                } finally {
                    setLoading(false);
                }
            };
            fetchAnimal();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
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
                if (ev.target?.result) setPreview(ev.target.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            if (typeof id === 'string') {
                await backendService.updateAnimal(id, {
                    ...formData,
                    gender: formData.gender as "Male" | "Female",
                    age: parseInt(formData.age) || 0,
                    fee: parseInt(formData.fee) || 0,
                    // Preserve existing image or use new preview
                    images: preview ? [preview] : undefined
                });
                alert('Animal details updated successfully!');
                router.push('/dashboard/rescues');
            }
        } catch (error) {
            console.error('Failed to update animal:', error);
            alert('Failed to update record.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="container py-12 text-center text-subtle">Loading animal details...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <button onClick={() => router.back()} className="text-sm text-subtle hover:text-primary">← Back</button>
                    </div>
                    <h1 className={styles.title}>Edit Animal: {formData.name}</h1>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
                    {!isAdopted && (
                        <Button onClick={handleSubmit} loading={submitting}>
                            Save Changes
                        </Button>
                    )}
                </div>
            </div>

            {isAdopted && (
                <div className="mb-6 p-4 bg-blue-50 border border-blue-100 rounded-lg text-blue-800 flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-full">ⓘ</div>
                    <div>
                        <p className="font-medium">This animal has been happily adopted! 🎉</p>
                        <p className="text-sm text-blue-600">To preserve historical records, editing details is disabled. You can still view medical records.</p>
                    </div>
                </div>
            )}

            <form className={styles.grid}>
                {/* Left Column: Media & Core ID */}
                <div className={styles.imageSection}>
                    <Card padding="none" className={styles.imageUpload}>
                        {!isAdopted && (
                            <input
                                type="file"
                                accept="image/*"
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                onChange={handleImageChange}
                                disabled={isAdopted}
                            />
                        )}
                        {preview ? (
                            <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                            <span className="font-medium text-sm">Click to change photo</span>
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
                                disabled={isAdopted}
                            />

                            <div className={styles.inputWrapper}>
                                <label className="text-sm font-medium">Species</label>
                                <select
                                    name="species"
                                    value={formData.species}
                                    onChange={handleChange}
                                    className={styles.select}
                                    disabled={isAdopted}
                                >
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
                                disabled={isAdopted}
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
                                disabled={isAdopted}
                            />
                            <div className={styles.inputWrapper}>
                                <label className="text-sm font-medium">Gender</label>
                                <select
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    className={styles.select}
                                    disabled={isAdopted}
                                >
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
                                disabled={isAdopted}
                            />

                            <div className={styles.inputWrapper}>
                                <label className="text-sm font-medium">Description</label>
                                <textarea
                                    name="description"
                                    className={styles.textarea}
                                    value={formData.description}
                                    onChange={handleChange}
                                    disabled={isAdopted}
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
                            disabled={isAdopted}
                        />
                    </Card>
                </div>
            </form>
        </div>
    );
}
