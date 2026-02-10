"use client";

import { useEffect, useState } from 'react';
import { backendService } from '@/lib/backend-service';
import { Card } from '@/components/ui/Card';
import { Notification } from '@/lib/types';
import { useAuth } from '@/lib/auth-context';

export default function NotificationsPage() {
    const { user } = useAuth();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            if (!user) return;
            try {
                const data = await backendService.getNotifications();
                setNotifications(data);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchNotifications();
    }, [user]);

    if (loading) return <div className="p-8 text-center text-subtle">Loading notifications...</div>;

    return (
        <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Notifications</h1>

            <div className="flex flex-col gap-4">
                {notifications.length === 0 ? (
                    <div className="text-center py-12 text-subtle bg-gray-50 rounded-lg">
                        You have no new notifications.
                    </div>
                ) : (
                    notifications.map(notification => (
                        <Card key={notification.id} padding="md" className={notification.type === 'success' ? 'border-l-4 border-l-green-500' : 'border-l-4 border-l-blue-500'}>
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{notification.title}</h3>
                                    <p className="text-secondary">{notification.message}</p>
                                </div>
                                <span className="text-xs text-subtle whitespace-nowrap ml-4">
                                    {new Date(notification.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </Card>
                    ))
                )}
            </div>
        </div>
    );
}
