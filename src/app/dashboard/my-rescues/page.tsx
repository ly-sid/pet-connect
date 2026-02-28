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

    const openNewRequestWindow = () => {
        window.open('/dashboard/my-rescues/new', 'RescueReportWindow', 'width=800,height=750,left=200,top=100');
    };

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

        // Refresh when returning to the window
        const handleFocus = () => {
            if (user) fetchRequests();
        };
        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, [user]);

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
                <Button onClick={openNewRequestWindow}>
                    + New Rescue Report
                </Button>
            </div>

            {loading ? (
                <div className="text-center py-12 text-subtle">Loading your reports...</div>
            ) : requests.length === 0 ? (
                <Card padding="lg" className="text-center">
                    <p className="text-subtle mb-4">You haven't submitted any rescue requests yet.</p>
                    <Button variant="outline" onClick={openNewRequestWindow}>Report a Found Pet</Button>
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
