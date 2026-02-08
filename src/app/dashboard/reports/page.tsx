"use client";

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function ReportsPage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Platform Reports</h1>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => alert('Downloading CSV...')}>Export CSV</Button>
                    <Button variant="outline" size="sm" onClick={() => alert('Downloading PDF...')}>Export PDF</Button>
                </div>
            </div>

            <div className="grid gap-6">
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <Card padding="md">
                        <div className="text-subtle text-sm uppercase font-bold">Total Adoptions</div>
                        <div className="text-3xl font-bold mt-1">1,248</div>
                        <div className="text-green-600 text-sm mt-1">↑ 12% from last month</div>
                    </Card>
                    <Card padding="md">
                        <div className="text-subtle text-sm uppercase font-bold">Donations Raised</div>
                        <div className="text-3xl font-bold mt-1">₹45,20,000</div>
                        <div className="text-green-600 text-sm mt-1">↑ 5% from last month</div>
                    </Card>
                    <Card padding="md">
                        <div className="text-subtle text-sm uppercase font-bold">Active Rescues</div>
                        <div className="text-3xl font-bold mt-1">85</div>
                        <div className="text-subtle text-sm mt-1">Across 12 shelters</div>
                    </Card>
                </div>

                {/* Recent Activity Table */}
                <Card padding="none">
                    <div className="p-4 border-b border-gray-100 font-bold">Recent Transaction Log</div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-gray-50 text-gray-500 font-medium">
                                <tr>
                                    <th className="p-3">Reference ID</th>
                                    <th className="p-3">Type</th>
                                    <th className="p-3">User</th>
                                    <th className="p-3">Amount/Status</th>
                                    <th className="p-3">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                <tr>
                                    <td className="p-3 font-mono text-xs">TXN-8821</td>
                                    <td className="p-3">Donation</td>
                                    <td className="p-3">alice@example.com</td>
                                    <td className="p-3 text-green-600 font-medium">+₹5,000.00</td>
                                    <td className="p-3 text-subtle">Oct 24, 2023</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-mono text-xs">ADP-4402</td>
                                    <td className="p-3">Adoption Fee</td>
                                    <td className="p-3">john.doe@gmail.com</td>
                                    <td className="p-3 text-green-600 font-medium">+₹15,000.00</td>
                                    <td className="p-3 text-subtle">Oct 23, 2023</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-mono text-xs">EXT-1102</td>
                                    <td className="p-3">Vet Payment</td>
                                    <td className="p-3">Dr. Smith</td>
                                    <td className="p-3 text-red-600 font-medium">-₹20,000.00</td>
                                    <td className="p-3 text-subtle">Oct 22, 2023</td>
                                </tr>
                                <tr>
                                    <td className="p-3 font-mono text-xs">ORD-9931</td>
                                    <td className="p-3">Shop Order</td>
                                    <td className="p-3">guest_user</td>
                                    <td className="p-3 text-green-600 font-medium">+₹3,500.00</td>
                                    <td className="p-3 text-subtle">Oct 22, 2023</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className="p-3 text-center border-t border-gray-100">
                        <button className="text-blue-500 text-sm font-medium hover:underline">View All Activity</button>
                    </div>
                </Card>
            </div>
        </div>
    );
}
