"use client";

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function SettingsPage() {
    return (
        <div className="max-w-2xl mx-auto">
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '1.5rem' }}>Account Settings</h1>

            <div className="flex flex-col gap-6">
                <Card padding="md">
                    <h3 className="font-bold text-lg mb-4">Notifications</h3>
                    <div className="flex flex-col gap-3">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                            <span>Email me about adoption updates</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" defaultChecked className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                            <span>Email me about donation receipts</span>
                        </label>
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 border-gray-300" />
                            <span>Subscribe to weekly newsletter</span>
                        </label>
                    </div>
                </Card>

                <Card padding="md">
                    <h3 className="font-bold text-lg mb-4">Security</h3>
                    <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <div>
                            <div className="font-medium">Two-Factor Authentication</div>
                            <div className="text-sm text-subtle">Add an extra layer of security to your account</div>
                        </div>
                        <Button variant="outline" size="sm">Enable</Button>
                    </div>
                    <div className="flex justify-between items-center py-2 pt-4">
                        <div>
                            <div className="font-medium">Password</div>
                            <div className="text-sm text-subtle">Last changed 3 months ago</div>
                        </div>
                        <Button variant="outline" size="sm">Change</Button>
                    </div>
                </Card>

                <Card padding="md" className="border-red-100">
                    <h3 className="font-bold text-lg mb-2 text-red-600">Danger Zone</h3>
                    <p className="text-sm text-subtle mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                    <Button variant="danger">Delete Account</Button>
                </Card>
            </div>
        </div>
    );
}
