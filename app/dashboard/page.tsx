// FILE: app/dashboard/page.tsx
import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { ScriptList } from '@/components/dashboard/ScriptList';
import { NewScriptButton } from '@/components/dashboard/NewScriptButton';
import { Button } from '@/components/ui/Button';
import { LogOut } from 'lucide-react';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const isConfigured = !!process.env.NEXT_PUBLIC_SUPABASE_URL && !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  const { data: scripts } = isConfigured 
    ? await supabase.from('scripts').select('*').order('updated_at', { ascending: false })
    : { data: [] };

  return (
    <div className="min-h-screen bg-[#F5F5F3]">
      <header className="bg-white border-b border-[#E5E5E3] px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-[#1A1A1A]">Script Studio</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user.email || 'Usuario'}</span>
          <form action="/api/auth/signout" method="post">
            <Button variant="ghost" size="sm" type="submit">
              <LogOut className="w-4 h-4 mr-2" />
              Salir
            </Button>
          </form>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-8 py-12">
        {!isConfigured && (
          <div className="mb-8 p-4 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-sm">
            <strong>Configuración requerida:</strong> Por favor, añade las variables de entorno de Supabase en el panel de Secretos para habilitar la base de datos.
          </div>
        )}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-[#1A1A1A]">Mis Guiones</h2>
          <NewScriptButton />
        </div>
        <ScriptList initialScripts={scripts || []} />
      </main>
    </div>
  );
}
