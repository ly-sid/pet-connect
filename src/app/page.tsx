import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import styles from './page.module.css';

export default function Home() {
  return (
    <div>
      <section className={styles.hero}>
        <div className="container">
          <h1 className={styles.title}>
            Connect, Rescue, <span className="text-accent">Adopt.</span>
          </h1>
          <p className={styles.subtitle}>
            A comprehensive platform connecting rescue teams, veterinarians, and animal lovers to give every pet a loving home.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/animals">
              <Button size="lg" variant="primary">Find a Pet</Button>
            </Link>
            <Link href="/register">
              <Button size="lg" variant="outline">Join the Cause</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.section}>
        <div className="container">
          <h2 className={styles.sectionTitle}>How We Help</h2>
          <div className={styles.grid}>
            <div className={styles.featureCard}>
              <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <h3>Adoption</h3>
              <p className="text-subtle">Browse profiles of rescued animals and apply to adopt them with a transparent process.</p>
            </div>
            <div className={styles.featureCard}>
              <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              </svg>
              <h3>Veterinary Care</h3>
              <p className="text-subtle">Integrated medical records ensure every animal's health history is tracked and accessible.</p>
            </div>
            <div className={styles.featureCard}>
              <svg className={styles.icon} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3>Donations</h3>
              <p className="text-subtle">Securely sponsor specific animals or support shelters with transparent transaction logs.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.section} bg-secondary`}>
        <div className="container">
          <div className={styles.grid}>
            <div className={styles.featureCard}>
              <span className={styles.statNumber}>250+</span>
              <p>Animals Rescued</p>
            </div>
            <div className={styles.featureCard}>
              <span className={styles.statNumber}>180+</span>
              <p>Happy Adoptions</p>
            </div>
            <div className={styles.featureCard}>
              <span className={styles.statNumber}>₹40L</span>
              <p>Funds Raised</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
