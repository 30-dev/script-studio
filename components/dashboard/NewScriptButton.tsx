// FILE: components/dashboard/NewScriptButton.tsx
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';

export const NewScriptButton = () => {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleCreate = async () => {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) return;

    const { data, error } = await supabase
      .from('scripts')
      .insert([{ user_id: user.id, title: 'Nuevo Guion' }])
      .select()
      .single();

    if (error) {
      console.error(error);
      setLoading(false);
    } else {
      router.push(`/scripts/${data.id}`);
    }
  };

  return (
    <Button onClick={handleCreate} isLoading={loading}>
      <Plus className="w-5 h-5 mr-2" />
      Nuevo Guion
    </Button>
  );
};
