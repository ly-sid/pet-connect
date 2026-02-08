"use client";

import React, { useState } from 'react';
import styles from './ContactWidget.module.css';
import { Input } from './Input';
import { Button } from './Button';

export function ContactWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = () => {
        setLoading(true);
        // Page will redirect to Google Form success page
    };

    return (
        <div className={styles.wrapper}>
            {isOpen && (
                <div className={styles.window}>
                    <div className={styles.header}>
                        <h3>Contact Us</h3>
                        <p>We'll get back to you soon!</p>
                    </div>

                    <form
                        className={styles.form}
                        onClick={(e) => e.stopPropagation()}
                        action="https://docs.google.com/forms/d/e/1FAIpQLSfvHXQiFN-RtPplpAJ2N6m3c678tt6X6EMGbsJ79Nd_1A5q_Q/formResponse"
                        method="POST"
                        target="_self"
                    >
                        {/* Hidden fields required by Google Forms */}
                        <input type="hidden" name="fvv" value="1" />
                        <input type="hidden" name="pageHistory" value="0" />
                        <input type="hidden" name="fbzx" value="3941958787586152760" />

                        <div className={styles.inputGroup}>
                            <label className="text-sm font-medium mb-1 block">Name</label>
                            <input
                                name="entry.502185534"
                                className={styles.input}
                                required
                                placeholder="Your name"
                                type="text"
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className="text-sm font-medium mb-1 block">Email</label>
                            <input
                                name="entry.252297169"
                                className={styles.input}
                                required
                                placeholder="your@email.com"
                                type="email"
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium mb-1 block">Message</label>
                            <textarea
                                name="entry.276232382"
                                className={styles.textarea}
                                required
                                placeholder="How can we help?"
                            />
                        </div>
                        <Button fullWidth type="submit">Send Message</Button>
                    </form>
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
