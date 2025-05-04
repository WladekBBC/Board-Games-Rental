'use client';

import { GameManagement } from './GameManagement';
import { AdminProtected } from '@/components/AdminProtected';

export default function GameManagingPage() {
  return (
    <AdminProtected>
      <main className="min-h-screen">
        <GameManagement />
      </main>
    </AdminProtected>
  );
} 