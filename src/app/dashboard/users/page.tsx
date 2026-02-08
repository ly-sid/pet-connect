"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

// Mock Users
const MOCK_USERS = [
    { id: 'u_1', name: 'Admin User', email: 'admin@petconnect.com', role: 'ADMIN', status: 'Active' },
    { id: 'u_2', name: 'Dr. Sarah Wilson', email: 'sarah@vetclinic.com', role: 'VET', status: 'Active' },
    { id: 'u_3', name: 'Downtown Rescue', email: 'info@downtownrescue.org', role: 'RESCUE', status: 'Active' },
    { id: 'u_4', name: 'John Smith', email: 'john@gmail.com', role: 'USER', status: 'Active' },
    { id: 'u_5', name: 'Jane Doe', email: 'jane@yahoo.com', role: 'USER', status: 'Suspended' },
];

export default function UsersPage() {
    const [users, setUsers] = useState(MOCK_USERS);

    const toggleStatus = (id: string) => {
        setUsers(users.map(u =>
            u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u
        ));
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>User Management</h1>
                <Button>+ Invite User</Button>
            </div>

            <Card padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Status</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50/50">
                                    <td className="p-4">
                                        <div className="font-bold text-gray-900">{user.name}</div>
                                        <div className="text-gray-500">{user.email}</div>
                                    </td>
                                    <td className="p-4">
                                        <span className="px-2 py-1 rounded text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="p-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            <span className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-red-500'}`}></span>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="p-4 text-right">
                                        <div className="flex gap-2 justify-end">
                                            <Button size="sm" variant="outline">Edit</Button>
                                            <Button
                                                size="sm"
                                                variant={user.status === 'Active' ? 'danger' : 'outline'}
                                                onClick={() => toggleStatus(user.id)}
                                            >
                                                {user.status === 'Active' ? 'Suspend' : 'Activate'}
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}
