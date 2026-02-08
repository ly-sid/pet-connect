"use client";

import { Card } from '@/components/ui/Card';

const NOTIFICATIONS = [
    { id: 1, title: 'Adoption Request Approved', message: 'Your request to adopt Bella has been approved! The rescue team will contact you shortly.', date: '2 hours ago', type: 'success' },
    { id: 2, title: 'Donation Receipt', message: 'Thank you for your donation of $50.00. Your transaction ID is TXN-8821.', date: '1 day ago', type: 'info' },
    { id: 3, title: 'New Arrival at Shelter', message: 'A new Golden Retriever matching your preferences is now available for adoption.', date: '3 days ago', type: 'info' }
];

export default function NotificationsPage() {
    return (
        <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Notifications</h1>

            <div className="flex flex-col gap-4">
                {NOTIFICATIONS.map(notification => (
                    <Card key={notification.id} padding="md" className={notification.type === 'success' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-blue-500'}>
                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-lg mb-1">{notification.title}</h3>
                                <p className="text-secondary">{notification.message}</p>
                            </div>
                            <span className="text-xs text-subtle whitespace-nowrap ml-4">{notification.date}</span>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
