import React from 'react';
import styles from './Card.module.css';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    padding?: 'none' | 'sm' | 'md' | 'lg';
}

export function Card({
    children,
    className = '',
    padding = 'md'
}: CardProps) {
    return (
        <div className={`${styles.card} ${styles['p-' + padding]} ${className}`}>
            {children}
        </div>
    );
}
