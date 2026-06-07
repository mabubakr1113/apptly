import type { Metadata } from 'next';
import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'Apptly — apply to jobs faster',
  description:
    'Apptly autofills job applications, tailors your CV and cover letter, and tracks every application — in your browser and on the web, synced to one account.',
};

const RootLayout = ({ children }: { children: ReactNode }) => (
  <ClerkProvider afterSignOutUrl="/">
    <html lang="en" className={inter.variable}>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        {children}
      </body>
    </html>
  </ClerkProvider>
);

export default RootLayout;
