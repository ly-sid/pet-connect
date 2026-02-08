"use client";

import { useEffect, useState } from 'react';

interface CountUpProps {
    end: number;
    duration?: number;
    prefix?: string;
    suffix?: string;
}

export function CountUp({ end, duration = 2000, prefix = '', suffix = '' }: CountUpProps) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime: number | null = null;
        const animate = (currentTime: number) => {
            if (!startTime) startTime = currentTime;
            const progress = currentTime - startTime;

            const percentage = Math.min(progress / duration, 1);
            // Ease out quart
            const ease = 1 - Math.pow(1 - percentage, 4);

            setCount(Math.floor(ease * end));

            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [end, duration]);

    // Format with commas for standard numbers, but handle INR manually if needed elsewhere using Intl
    // For simplicity, we just formatting basic locale string
    const formatted = count.toLocaleString('en-IN');

    return <span>{prefix}{formatted}{suffix}</span>;
}
