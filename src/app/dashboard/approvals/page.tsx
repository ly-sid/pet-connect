"use client";

import { useEffect, useState } from 'react';
import { mockService } from '@/lib/mock-data';
import { AdoptionRequest } from '@/lib/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ApprovalsPage() {
    const [requests, setRequests] = useState<AdoptionRequest[]>([]);

    const loadRequests = () => {
        setRequests([...mockService.getAdoptionRequests()]);
    };

    useEffect(() => {
        loadRequests();
    }, []);

    const handleAction = (id: string, status: 'APPROVED' | 'REJECTED') => {
        mockService.updateRequestStatus(id, status);
        loadRequests(); // Refresh
    };

    return (
        <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Adoption Approvals</h1>

            {requests.length === 0 ? (
                <div className="p-8 text-center bg-white rounded-lg border border-gray-200 text-subtle">
                    No pending adoption requests.
                </div>
            ) : (
                <div className="grid gap-4">
                    {requests.map((request) => (
                        <Card key={request.id} padding="md">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className={`px-2 py-0.5 rounded text-xs font-bold ${request.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                                                request.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                                                    'bg-red-100 text-red-800'
                                            }`}>
                                            {request.status}
                                        </span>
                                        <span className="text-sm text-subtle">{request.applicationDate}</span>
                                    </div>
                                    <h3 className="font-bold text-lg mb-1">Request for {mockService.getAnimalById(request.animalId)?.name || 'Unknown Animal'}</h3>
                                    <p className="text-sm text-secondary">Applicant: <b>{request.userName}</b> ({request.userId})</p>
                                    <p className="mt-2 text-sm italic">"{request.message}"</p>
                                </div>

                                {request.status === 'PENDING' && (
                                    <div className="flex flex-col gap-2">
                                        <Button size="sm" onClick={() => handleAction(request.id, 'APPROVED')}>Approve</Button>
                                        <Button size="sm" variant="danger" onClick={() => handleAction(request.id, 'REJECTED')}>Reject</Button>
                                    </div>
                                )}
                            </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
