"use client";

import { useState, useEffect } from 'react';
import { backendService } from '@/lib/backend-service';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/auth-context';

export default function MyRescueReportsPage() {
    const { user } = useAuth();
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
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

    const fetchRequests = async () => {
        setLoading(true);
        try {
            const data = await backendService.getRescueRequests();
            setRequests(data);
        } catch (error) {
            console.error('Failed to fetch rescue requests:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchRequests();
        }
    }, [user]);

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
            setShowForm(false);
            setFormData({ petName: '', species: 'Dog', breed: '', location: '', description: '', image: '' });
            setPreview(null);
            fetchRequests();
            alert('Your rescue request has been submitted to our team!');
        } catch (error) {
            alert('Failed to submit rescue request.');
        } finally {
            setSubmitting(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'text-green-600 bg-green-50';
            case 'REJECTED': return 'text-red-600 bg-red-50';
            default: return 'text-amber-600 bg-amber-50';
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>My Rescue Reports</h1>
                    <p className="text-subtle">Report a stray or rescued pet that needs transfer to the platform.</p>
                </div>
                <Button onClick={() => setShowForm(!showForm)}>
                    {showForm ? 'Cancel' : '+ New Rescue Report'}
                </Button>
            </div>

            {showForm && (
                <Card padding="md" className="mb-8 border-l-4 border-l-primary">
                    <h2 className="font-bold text-lg mb-4">Submit a Rescue/Transfer Request</h2>
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Pet's Name (if known)"
                                value={formData.petName}
                                onChange={e => setFormData({ ...formData, petName: e.target.value })}
                            />
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700">Species</label>
                                <select
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                    value={formData.species}
                                    onChange={e => setFormData({ ...formData, species: e.target.value })}
                                >
                                    <option value="Dog">Dog</option>
                                    <option value="Cat">Cat</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Breed / Appearance"
                                value={formData.breed}
                                onChange={e => setFormData({ ...formData, breed: e.target.value })}
                                placeholder="e.g. Mixed Terrier, or 'Small black cat'"
                                required
                            />
                            <Input
                                label="Location Found / Current Location"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                required
                            />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Description & Condition</label>
                                <textarea
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-y"
                                    rows={4}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Please describe the animal's physical condition, how you found it, and any immediate medical needs..."
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="block text-sm font-medium text-gray-700">Photo Attachment</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-md p-4 flex flex-col items-center justify-center relative bg-gray-50 hover:bg-gray-100 transition-colors h-[115px]">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        onChange={handleImageChange}
                                    />
                                    {preview ? (
                                        <div className="flex bg-white items-center gap-3 p-1 rounded-md shadow-sm z-10 w-full">
                                            <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded" />
                                            <span className="text-sm font-medium text-green-600 truncate">Photo Attached</span>
                                        </div>
                                    ) : (
                                        <div className="text-center">
                                            <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                                                <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                            </svg>
                                            <p className="mt-1 text-xs text-gray-500">Tap to upload a photo</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-end pt-2">
                            <Button type="submit" loading={submitting}>Submit Rescue Request</Button>
                        </div>
                    </form>
                </Card>
            )}

            {loading ? (
                <div className="text-center py-12 text-subtle">Loading your reports...</div>
            ) : requests.length === 0 ? (
                <Card padding="lg" className="text-center">
                    <p className="text-subtle mb-4">You haven't submitted any rescue requests yet.</p>
                    <Button variant="outline" onClick={() => setShowForm(true)}>Report a Found Pet</Button>
                </Card>
            ) : (
                <div className="grid gap-4">
                    {requests.map((req) => (
                        <Card key={req.id} padding="md">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h3 className="font-bold text-lg">{req.petName}</h3>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(req.status)}`}>
                                            {req.status}
                                        </span>
                                    </div>
                                    <p className="text-sm text-subtle mt-1">{req.species} • {req.breed}</p>
                                </div>
                                <div className="text-right text-xs text-subtle">
                                    Submitted<br />{new Date(req.createdAt).toLocaleDateString()}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mt-4 p-4 bg-gray-50 rounded-md">
                                <div>
                                    <span className="font-semibold text-gray-600 block mb-1">Location</span>
                                    {req.location}
                                </div>
                                <div>
                                    <span className="font-semibold text-gray-600 block mb-1">Details & Conditions</span>
                                    {req.description}
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
