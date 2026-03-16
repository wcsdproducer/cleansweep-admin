
"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ProjectsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/customers');
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="flex flex-col items-center gap-2">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-muted-foreground">Redirecting to Customers...</p>
      </div>
    </div>
  );
}
