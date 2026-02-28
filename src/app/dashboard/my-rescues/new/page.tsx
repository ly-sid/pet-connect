"use client";

import { useState } from 'react';
import { backendService } from '@/lib/backend-service';
import { useRouter } from 'next/navigation';

export default function NewRescueReportPage() {
    const router = useRouter();
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
            alert('Rescue report submitted successfully! Thank you for helping.');
            window.close(); // For popup
            router.push('/dashboard/my-rescues'); // Fallback if popup blocker or navigated directly
        } catch (error) {
            alert('Failed to submit rescue request.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#FDFDFD] flex justify-center py-10 px-4 sm:px-6 lg:px-8 font-sans transition-all">
            <div className="w-full max-w-2xl bg-white rounded-3xl shadow-[0_8px_40px_-12px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">

                {/* Header Area */}
                <div className="bg-[#111111] px-8 py-10 text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mr-8 -mt-8 w-64 h-64 rounded-full bg-white opacity-5 blur-3xl mix-blend-overlay pointer-events-none"></div>
                    <h1 className="text-3xl font-extrabold tracking-tight mb-2 relative z-10">Report Found Pet.</h1>
                    <p className="text-gray-400 text-sm font-medium max-w-sm relative z-10 leading-relaxed">
                        Submit details about the stray or rescued animal so our dedicated transfer network can safely intake them.
                    </p>
                </div>

                {/* Form Area */}
                <form onSubmit={handleSubmit} className="px-8 py-10 flex flex-col gap-8">

                    {/* Pet Identifier Section */}
                    <div className="space-y-6">
                        <div className="border-b border-gray-100 pb-2">
                            <h2 className="text-xs uppercase font-bold tracking-widest text-gray-400">Animal Details</h2>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm border-0 font-semibold text-gray-800">Pet's Name <span className="text-gray-400 font-normal">(Leave blank if unknown)</span></label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 border-transparent rounded-xl px-4 py-3.5 text-gray-900 border transition-all focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-100 outline-none"
                                placeholder="E.g. Spot, or leave blank"
                                value={formData.petName}
                                onChange={e => setFormData({ ...formData, petName: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-800">Species</label>
                                <div className="relative">
                                    <select
                                        className="w-full bg-gray-50 border-transparent rounded-xl px-4 py-3.5 text-gray-900 border transition-all focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-100 outline-none appearance-none"
                                        value={formData.species}
                                        onChange={e => setFormData({ ...formData, species: e.target.value })}
                                    >
                                        <option value="Dog">Dog</option>
                                        <option value="Cat">Cat</option>
                                        <option value="Other">Other</option>
                                    </select>
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
                                        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" /></svg>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="text-sm font-semibold text-gray-800">Breed / Appearance</label>
                                <input
                                    type="text"
                                    className="w-full bg-gray-50 border-transparent rounded-xl px-4 py-3.5 text-gray-900 border transition-all focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-100 outline-none"
                                    placeholder="E.g. Mixed Terrier, Small Black Cat"
                                    value={formData.breed}
                                    onChange={e => setFormData({ ...formData, breed: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    {/* Geography & Details Section */}
                    <div className="space-y-6">
                        <div className="border-b border-gray-100 pb-2 pt-2">
                            <h2 className="text-xs uppercase font-bold tracking-widest text-gray-400">Location & Intel</h2>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-800">Found Location</label>
                            <input
                                type="text"
                                className="w-full bg-gray-50 border-transparent rounded-xl px-4 py-3.5 text-gray-900 border transition-all focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-100 outline-none"
                                placeholder="Full address or precise intersection..."
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-800">Condition & Description</label>
                            <textarea
                                className="w-full bg-gray-50 border-transparent rounded-xl px-4 py-3.5 text-gray-900 border transition-all focus:bg-white focus:border-gray-200 focus:ring-4 focus:ring-gray-100 outline-none resize-none"
                                rows={4}
                                placeholder="Describe physical condition, injuries, temperament, etc."
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    {/* File Upload Section */}
                    <div className="space-y-6">
                        <div className="border-b border-gray-100 pb-2 pt-2">
                            <h2 className="text-xs uppercase font-bold tracking-widest text-gray-400">Media</h2>
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-semibold text-gray-800">Attach Photograph</label>
                            <div className="relative group cursor-pointer border-2 border-dashed border-gray-200 rounded-2xl p-6 transition-all hover:bg-gray-50 hover:border-gray-300 flex flex-col items-center justify-center overflow-hidden min-h-[160px]">
                                <input
                                    type="file"
                                    accept="image/*"
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                                    onChange={handleImageChange}
                                />

                                {preview ? (
                                    <div className="w-full flex items-center gap-4 bg-white p-3 rounded-xl shadow-sm border border-gray-100 z-10 relative">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 shadow-sm border border-gray-100">
                                            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-bold text-gray-900 truncate">Photo successfully attached</p>
                                            <p className="text-xs text-green-600 font-medium mt-0.5">Click to replace</p>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center text-center z-10 relative pointer-events-none">
                                        <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">Drop a photo here or click to upload</p>
                                        <p className="text-xs text-gray-400 mt-1">PNG, JPG up to 5MB</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 mt-2 flex flex-col sm:flex-row gap-3">
                        <button
                            type="button"
                            onClick={() => { window.close(); router.back(); }}
                            className="px-6 py-3.5 rounded-xl font-semibold text-gray-600 bg-gray-50 hover:bg-gray-100 transition-colors w-full sm:w-auto text-center"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-6 py-3.5 rounded-xl font-semibold text-white bg-[#111111] hover:bg-black hover:shadow-lg hover:-translate-y-0.5 transition-all w-full flex-1 flex justify-center items-center gap-2"
                        >
                            {submitting ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    Processing
                                </>
                            ) : (
                                "Submit Rescue Request"
                            )}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
