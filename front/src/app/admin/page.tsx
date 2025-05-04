'use client';

import { GameManagement } from '../gmanaging/GameManagement';
import { AdminProtected } from '@/components/AdminProtected';

export default function AdminPage() {
  return (
    <AdminProtected>
      <main className="min-h-screen">
        <GameManagement />
      </main>
    </AdminProtected>
  );
} 