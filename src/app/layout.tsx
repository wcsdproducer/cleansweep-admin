import type { Metadata } from 'next';
import './globals.css';
import { SidebarProvider, SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { AdminSidebar } from '@/components/AdminSidebar';
import { AdminAuthGuard } from '@/components/AdminAuthGuard';
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
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <FirebaseClientProvider>
          <AdminAuthGuard>
            <SidebarProvider>
              <AdminSidebar />
              <SidebarInset>
                <header className="flex h-16 shrink-0 items-center gap-2 border-b px-6 bg-white/95 backdrop-blur-md sticky top-0 z-10 shadow-sm border-secondary">
                  <SidebarTrigger className="-ml-1 text-primary hover:bg-secondary/20" />
                  <div className="flex-1">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                      CleanSweep Operations <span className="mx-2 opacity-30">|</span> <span className="text-primary font-bold">Admin Portal</span>
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-[10px] font-bold uppercase tracking-widest">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                      Secure Instance
                    </div>
                  </div>
                </header>
                <main className="p-6 md:p-10 bg-background/40">
                  {children}
                </main>
              </SidebarInset>
            </SidebarProvider>
          </AdminAuthGuard>
        </FirebaseClientProvider>
        <Toaster />
      </body>
    </html>
  );
}