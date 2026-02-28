"use client";

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { backendService } from '@/lib/backend-service';

export default function UsersPage() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        role: 'VET'
    });
    const [error, setError] = useState('');

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const data = await backendService.getUsers();
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCreateUser = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);
        try {
            await backendService.createUser(formData);
            setShowModal(false);
            setFormData({ name: '', username: '', email: '', password: '', role: 'VET' });
            fetchUsers();
        } catch (err: any) {
            setError(err.message || 'Failed to create user');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>User Management</h1>
                <Button onClick={() => setShowModal(true)}>+ Invite User</Button>
            </div>

            <Card padding="none">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 text-gray-500 font-medium">
                            <tr>
                                <th className="p-4">Name</th>
                                <th className="p-4">Username</th>
                                <th className="p-4">Role</th>
                                <th className="p-4">Joined On</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr><td colSpan={4} className="p-4 text-center text-gray-500">Loading users...</td></tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} className="hover:bg-gray-50/50">
                                        <td className="p-4">
                                            <div className="font-bold text-gray-900">{user.name}</div>
                                            <div className="text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="p-4 text-gray-600">
                                            @{user.username}
                                        </td>
                                        <td className="p-4">
                                            <span className="px-2 py-1 rounded text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4 text-gray-500">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </Card>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                        <div className="border-b px-6 py-4 flex justify-between items-center bg-gray-50">
                            <h2 className="text-xl font-bold">Invite New System User</h2>
                            <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-700 text-2xl leading-none">&times;</button>
                        </div>

                        <div className="p-6">
                            {error && (
                                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-md text-sm">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleCreateUser} className="space-y-4">
                                <Input label="Full Name" name="name" value={formData.name} onChange={handleChange} required placeholder="Dr. John Smith" />
                                <Input label="Username" name="username" value={formData.username} onChange={handleChange} required placeholder="johnsmith_vet" />
                                <Input label="Email Address" type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="john@vetclinic.com" />
                                <Input label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required placeholder="SecurePassword123!" />

                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-gray-700">Role level</label>
                                    <select
                                        name="role"
                                        value={formData.role}
                                        onChange={handleChange}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="VET">Veterinarian (Medical Access)</option>
                                        <option value="RESCUE">Rescue Team (Intake Access)</option>

                                        <option value="ADMIN">Administrator (Full Access)</option>
                                    </select>
                                </div>

                                <div className="pt-4 flex gap-3">
                                    <Button type="button" variant="outline" fullWidth onClick={() => setShowModal(false)}>Cancel</Button>
                                    <Button type="submit" fullWidth loading={submitting}>Create User</Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
