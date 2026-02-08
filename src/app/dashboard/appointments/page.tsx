"use client";

import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const APPOINTMENTS = [
    { id: 1, animal: 'Bella', type: 'General Checkup', date: 'Oct 25, 2023', time: '10:00 AM', doctor: 'Dr. Sarah Wilson' },
    { id: 2, animal: 'Max', type: 'Vaccination', date: 'Oct 28, 2023', time: '2:30 PM', doctor: 'Dr. Mike Jones' }
];

export default function AppointmentsPage() {
    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Upcoming Appointments</h1>
                <Button>+ Schedule New</Button>
            </div>

            <div className="grid gap-4">
                {APPOINTMENTS.map(apt => (
                    <Card key={apt.id} padding="md">
                        <div className="flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-100 text-blue-800 font-bold p-3 rounded-lg text-center min-w-[60px]">
                                    <div className="text-sm">{apt.date.split(' ')[0]}</div>
                                    <div className="text-xl">{apt.date.split(' ')[1].replace(',', '')}</div>
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{apt.type} for {apt.animal}</h3>
                                    <p className="text-secondary text-sm">with {apt.doctor} at {apt.time}</p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="outline" size="sm">Reschedule</Button>
                                <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:border-red-500 hover:bg-red-50">Cancel</Button>
                            </div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}
