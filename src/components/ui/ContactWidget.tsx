"use client";

import React, { useState } from 'react';
import styles from './ContactWidget.module.css';
import { Input } from './Input';
import { Button } from './Button';

export function ContactWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSubmitted(true);
            setTimeout(() => {
                setSubmitted(false);
                setIsOpen(false);
            }, 3000);
        }, 1000);
    };

    return (
        <div className={styles.wrapper}>
            {isOpen && (
                <div className={styles.window}>
                    <div className={styles.header}>
                        <h3>Contact Us</h3>
                        <p>We'll get back to you soon!</p>
                    </div>

                    {submitted ? (
                        <div className={styles.successMsg}>
                            <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <p className="font-bold">Message Sent!</p>
                            <p className="text-sm text-subtle">Thank you for reaching out.</p>
                        </div>
                    ) : (
                        <form className={styles.form} onClick={(e) => e.stopPropagation()} onSubmit={handleSubmit}>
                            <Input label="Name" required placeholder="Your name" />
                            <Input label="Email" type="email" required placeholder="your@email.com" />
                            <div>
                                <label className="text-sm font-medium mb-1 block">Message</label>
                                <textarea
                                    className={styles.textarea}
                                    required
                                    placeholder="How can we help?"
                                />
                            </div>
                            <Button fullWidth loading={loading} type="submit">Send Message</Button>
                        </form>
                    )}
                </div>
            )}

            <button
                className={styles.toggleBtn}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle contact form"
            >
                {isOpen ? (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                ) : (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
                    </svg>
                )}
            </button>
        </div>
    );
}
