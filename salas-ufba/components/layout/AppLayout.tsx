import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="bg-background flex min-h-screen">
      <Sidebar />
      <div className="ml-[280px] flex-grow flex flex-col">
        <Header />
        <main className="p-6 flex-grow overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}