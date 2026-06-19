import type { Metadata } from 'next';
import './globals.css';
import { AdminShell } from '@/components/AdminShell';
import { Toaster } from '@/components/ui/toaster';
import { FirebaseClientProvider } from '@/firebase';

export const metadata: Metadata = {
  title: 'CleanSweep | Professional Admin Portal',
  description: 'CleanSweep Admin Portal - Empowering professional cleaning services management.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <AdminShell>{children}</AdminShell>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}