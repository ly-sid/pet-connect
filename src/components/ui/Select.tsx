import React from 'react';
import styles from './Select.module.css';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    options: { value: string; label: string }[];
    error?: string;
}

export function Select({ label, options, error, className = '', id, ...props }: SelectProps) {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
        <div className={styles.wrapper}>
            {label && <label htmlFor={selectId} className={styles.label}>{label}</label>}
            <div className={styles.selectWrapper}>
                <select
                    id={selectId}
                    className={`${styles.select} ${error ? styles.errorSelect : ''} ${className}`}
                    {...props}
                >
                    {options.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
                <div className={styles.arrowIcon}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M2.5 4.5L6 8L9.5 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </div>
            </div>
            {error && <span className={styles.errorText}>{error}</span>}
        </div>
    );
}
