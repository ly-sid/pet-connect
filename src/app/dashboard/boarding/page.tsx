"use client";

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

// Simple helper to get days in month
const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

export default function BoardingPage() {
    const [date, setDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<number | null>(null);
    const [bookingType, setBookingType] = useState('Overnight');

    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handleBooking = () => {
        if (!selectedDay) return;
        alert(`Booking confirmed for ${monthNames[month]} ${selectedDay}, ${year} - ${bookingType}. Check your email for details.`);
        setSelectedDay(null);
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Pet Boarding</h1>
            <p className="text-subtle mb-8">Book a safe and comfortable stay for your pet while you are away.</p>

            <div className="grid md:grid-cols-2 gap-8">

                {/* Calendar Section */}
                <Card padding="lg">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg">{monthNames[month]} {year}</h3>
                        <div className="flex gap-2">
                            <button onClick={() => setDate(new Date(year, month - 1))} className="p-1 hover:bg-gray-100 rounded">←</button>
                            <button onClick={() => setDate(new Date(year, month + 1))} className="p-1 hover:bg-gray-100 rounded">→</button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                            <div key={d} className="text-gray-400 font-medium py-1">{d}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                            <div key={`empty-${i}`} />
                        ))}
                        {Array.from({ length: daysInMonth }).map((_, i) => {
                            const day = i + 1;
                            const isSelected = selectedDay === day;
                            const isToday = day === new Date().getDate() && month === new Date().getMonth();

                            return (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDay(day)}
                                    className={`
                     aspect-square flex items-center justify-center rounded-md text-sm transition-colors
                     ${isSelected ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-blue-50 text-gray-700'}
                     ${isToday && !isSelected ? 'border border-blue-600 font-bold' : ''}
                   `}
                                >
                                    {day}
                                </button>
                            )
                        })}
                    </div>

                    <div className="mt-4 flex gap-4 text-xs text-subtle justify-center">
                        <div className="flex items-center gap-1"><div className="w-3 h-3 border border-blue-600 rounded"></div> Today</div>
                        <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-600 rounded"></div> Selected</div>
                    </div>
                </Card>

                {/* Booking Form Section */}
                <div>
                    <Card padding="lg" className="h-full flex flex-col">
                        <h3 className="font-bold text-lg mb-6">Reservation Details</h3>

                        {selectedDay ? (
                            <div className="flex-1 flex flex-col gap-4">
                                <div className="bg-blue-50 p-4 rounded-lg text-blue-800 mb-2">
                                    <span className="block text-xs uppercase tracking-wide font-bold opacity-70">Selected Date</span>
                                    <span className="text-xl font-bold">{monthNames[month]} {selectedDay}, {year}</span>
                                </div>

                                <div className="flex flex-col gap-2">
                                    <label className="text-sm font-medium">Service Type</label>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Button
                                            variant={bookingType === 'Overnight' ? 'primary' : 'outline'}
                                            size="sm"
                                            onClick={() => setBookingType('Overnight')}
                                        >
                                            Overnight
                                        </Button>
                                        <Button
                                            variant={bookingType === 'Daycare' ? 'primary' : 'outline'}
                                            size="sm"
                                            onClick={() => setBookingType('Daycare')}
                                        >
                                            Daycare
                                        </Button>
                                    </div>
                                </div>

                                <Input label="Pet Name" placeholder="e.g. Bella" />
                                <Input label="Special Instructions" placeholder="Dietary needs, meds..." />

                                <div className="mt-auto pt-4 border-t border-gray-100">
                                    <div className="flex justify-between items-center mb-4 text-lg font-bold">
                                        <span>Total</span>
                                        <span>{bookingType === 'Overnight' ? '₹450.00' : '₹250.00'}</span>
                                    </div>
                                    <Button fullWidth onClick={handleBooking}>Confirm Booking</Button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex-1 flex flex-col items-center justify-center text-center text-subtle p-8">
                                <svg className="w-12 h-12 mb-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                </svg>
                                <p>Please select a date from the calendar to start your reservation.</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
}
