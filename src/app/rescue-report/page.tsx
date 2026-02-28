"use client";

import { useState } from 'react';
import { backendService } from '@/lib/backend-service';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

export default function StandaloneRescueReportPage() {
    const [submitting, setSubmitting] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        petName: '',
        species: 'Dog',
        breed: '',
        location: '',
        description: '',
        image: ''
    });

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
        setSubmitting(true);
        try {
            await backendService.submitRescueRequest(formData);
            alert('Your rescue request has been submitted to our team!');
            window.close();
            // Fallback if not opened via JS
            if (typeof window !== 'undefined') {
                window.location.href = '/dashboard/my-rescues';
            }
        } catch (error) {
            alert('Failed to submit rescue request.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#fcfcfc', fontFamily: 'system-ui, sans-serif', padding: '40px 20px' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>

                {/* Header */}
                <div style={{ marginBottom: '40px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: '#111', margin: '0 0 10px 0', letterSpacing: '-0.02em' }}>Report Found Pet</h1>
                    <p style={{ color: '#666', fontSize: '1.1rem', margin: 0, maxWidth: '600px', display: 'inline-block' }}>
                        Provide details below so our dedicated transfer network can safely intake the animal.
                    </p>
                </div>

                <div style={{ padding: '40px', backgroundColor: '#fff', borderTop: '6px solid var(--primary-color, #111)', boxShadow: '0 20px 40px rgba(0,0,0,0.06)', borderRadius: '16px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>

                        {/* Section 1 */}
                        <div>
                            <h3 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', color: '#999', margin: '0 0 20px 0', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Animal Context</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <Input
                                    label="Pet's Name (if known, else leave blank)"
                                    value={formData.petName}
                                    onChange={e => setFormData({ ...formData, petName: e.target.value })}
                                />
                                <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: '20px' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#444' }}>Species</label>
                                        <select
                                            style={{ padding: '12px 16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', backgroundColor: '#fff', width: '100%', boxSizing: 'border-box' }}
                                            value={formData.species}
                                            onChange={e => setFormData({ ...formData, species: e.target.value })}
                                        >
                                            <option value="Dog">Dog</option>
                                            <option value="Cat">Cat</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <Input
                                        label="Breed / Appearance Pattern"
                                        value={formData.breed}
                                        onChange={e => setFormData({ ...formData, breed: e.target.value })}
                                        placeholder="e.g. Mixed Terrier, Small Black Cat"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 2 */}
                        <div>
                            <h3 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', color: '#999', margin: '0 0 20px 0', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Geography & Condition</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <Input
                                    label="Found Location (Precise address or intersection)"
                                    value={formData.location}
                                    onChange={e => setFormData({ ...formData, location: e.target.value })}
                                    required
                                />
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '0.875rem', fontWeight: 600, color: '#444' }}>Physical Description & Condition</label>
                                    <textarea
                                        style={{ padding: '16px', borderRadius: '8px', border: '1px solid #ddd', fontSize: '1rem', width: '100%', boxSizing: 'border-box', resize: 'vertical', fontFamily: 'inherit' }}
                                        rows={5}
                                        value={formData.description}
                                        onChange={e => setFormData({ ...formData, description: e.target.value })}
                                        placeholder="Describe injuries, temperament, behavior..."
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3 */}
                        <div>
                            <h3 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '2px', color: '#999', margin: '0 0 20px 0', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Evidence / Photography</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <p style={{ margin: '0 0 10px 0', fontSize: '0.9rem', color: '#666' }}>A photo helps rescues accurately identify and prepare for the transfer.</p>
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
                            <Button variant="outline" type="button" onClick={() => window.close()}>Cancel & Close</Button>
                            <Button type="submit" loading={submitting}>Submit Official Report</Button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    );
}
