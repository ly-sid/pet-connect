"use client";

import { useEffect, useState } from 'react';
import { backendService } from '@/lib/backend-service';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function RescueManagementPage() {
    const [requests, setRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState<string | null>(null);

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
        fetchRequests();
    }, []);

    const handleUpdateStatus = async (id: string, status: 'APPROVED' | 'REJECTED') => {
        setUpdatingId(id);
        try {
            await backendService.updateRescueRequestStatus(id, status);
            fetchRequests();
            if (status === 'APPROVED') {
                alert('Request approved! You should now contact the user to arrange transfer.');
            }
        } catch (error) {
            alert('Failed to update request status.');
        } finally {
            setUpdatingId(null);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED': return 'text-green-600 bg-green-50 border border-green-200';
            case 'REJECTED': return 'text-red-600 bg-red-50 border border-red-200';
            default: return 'text-amber-600 bg-amber-50 border border-amber-200';
        }
    };

    return (
        <div>
            <div className="mb-6">
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Rescue Transfer Requests</h1>
                <p className="text-subtle">Manage inbound requests from the public reporting found, stray, or rescued pets.</p>
            </div>

            {loading ? (
                <div className="text-center py-12 text-subtle">Loading requests...</div>
            ) : requests.length === 0 ? (
                <Card padding="lg" className="text-center text-subtle">
                    No active rescue requests pending review. All caught up!
                </Card>
            ) : (
                <div className="grid gap-6">
                    {requests.map((req) => (
                        <Card key={req.id} padding="md">
                            <div className="flex flex-col md:flex-row justify-between gap-4 border-b border-gray-100 pb-4 mb-4">
                                <div>
                                    <div className="flex items-center gap-3 mb-1">
                                        <h3 className="font-bold text-xl">{req.petName}</h3>
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusColor(req.status)}`}>
                                            {req.status}
                                        </span>
                                    </div>
                                    <div className="text-sm font-medium text-gray-700">
                                        {req.species} • {req.breed}
                                    </div>
                                </div>
                                <div className="text-sm text-subtle md:text-right">
                                    <div className="font-medium text-gray-900 mb-1">Reporter: {req.user?.name || 'Unknown User'}</div>
                                    <div>{req.user?.email || 'N/A'}</div>
                                    <div className="text-xs mt-1">Submitted: {new Date(req.createdAt).toLocaleDateString()}</div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-subtle mb-2">Location Found</h4>
                                    <p className="text-sm bg-gray-50 p-3 rounded">{req.location}</p>
                                </div>
                                <div>
                                    <h4 className="text-xs font-bold uppercase tracking-wider text-subtle mb-2">Description & Condition</h4>
                                    <p className="text-sm bg-gray-50 p-3 rounded whitespace-pre-wrap">{req.description}</p>
                                </div>
                            </div>

                            {req.status === 'PENDING' && (
                                <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleUpdateStatus(req.id, 'REJECTED')}
                                        loading={updatingId === req.id}
                                    >
                                        Reject Request
                                    </Button>
                                    <Button
                                        style={{ backgroundColor: 'var(--success-color)', borderColor: 'var(--success-color)' }}
                                        onClick={() => handleUpdateStatus(req.id, 'APPROVED')}
                                        loading={updatingId === req.id}
                                    >
                                        Approve & Arrange Transfer
                                    </Button>
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
