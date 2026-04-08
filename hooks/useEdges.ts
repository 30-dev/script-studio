// FILE: hooks/useEdges.ts
import { Edge } from '@/lib/types';

export const useEdges = (scriptId: string, setScript: any) => {
  const addEdge = async (from: string, to: string) => {
    // Check if edge already exists
    const res = await fetch('/api/edges', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ script_id: scriptId, from_node: from, to_node: to }),
    });
    const newEdge = await res.json();
    setScript((prev: any) => ({ ...prev, edges: [...prev.edges, newEdge] }));
  };

  const deleteEdge = async (id: string) => {
    setScript((prev: any) => ({
      ...prev,
      edges: prev.edges.filter((e: Edge) => e.id !== id)
    }));
    await fetch('/api/edges', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
  };

  return { addEdge, deleteEdge };
};
