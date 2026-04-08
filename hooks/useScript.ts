// FILE: hooks/useScript.ts
import { useState, useEffect } from 'react';
import { ScriptWithDetails, Node, Edge, Block } from '@/lib/types';

export const useScript = (scriptId: string) => {
  const [script, setScript] = useState<ScriptWithDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScript = async () => {
    try {
      const res = await fetch(`/api/scripts/${scriptId}`);
      if (!res.ok) throw new Error('Failed to fetch script');
      const data = await res.json();
      setScript(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (scriptId) {
      fetchScript();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptId]);

  const updateScriptTitle = async (title: string) => {
    if (!script) return;
    setScript({ ...script, title });
    await fetch(`/api/scripts/${scriptId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
  };

  return { script, setScript, loading, error, updateScriptTitle, refresh: fetchScript };
};
