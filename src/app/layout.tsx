import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { ContactWidget } from '@/components/ui/ContactWidget';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Pet Connect',
  description: 'Pet Care, Rescue, and Adoption Management Platform',
  verification: {
    google: "WaNp0dI2SLEP_h6A93k2mR6B9TC-AsyB7YD_SW35Y8Q",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <AuthProvider>
          <Navbar />
          <main style={{ flex: 1 }}>
            {children}
          </main>
          <Footer />
          <ContactWidget />
        </AuthProvider>
      </body>
    </html>
  );
}
