// FILE: hooks/useNodes.ts
import { Node } from '@/lib/types';

export const useNodes = (scriptId: string, setScript: any) => {
  const addNode = async (x: number, y: number) => {
    const res = await fetch('/api/nodes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ script_id: scriptId, position_x: x, position_y: y }),
    });
    const newNode = await res.json();
    setScript((prev: any) => ({ ...prev, nodes: [...prev.nodes, newNode] }));
    return newNode;
  };

  const updateNodePosition = async (id: string, x: number, y: number) => {
    setScript((prev: any) => ({
      ...prev,
      nodes: prev.nodes.map((n: Node) => n.id === id ? { ...n, position_x: x, position_y: y } : n)
    }));
    await fetch(`/api/nodes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ position_x: x, position_y: y }),
    });
  };

  const updateNodeTitle = async (id: string, title: string) => {
    setScript((prev: any) => ({
      ...prev,
      nodes: prev.nodes.map((n: Node) => n.id === id ? { ...n, title } : n)
    }));
    await fetch(`/api/nodes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
  };

  const deleteNode = async (id: string) => {
    setScript((prev: any) => ({
      ...prev,
      nodes: prev.nodes.filter((n: Node) => n.id !== id),
      blocks: prev.blocks.filter((b: any) => b.node_id !== id),
      edges: prev.edges.filter((e: any) => e.from_node !== id && e.to_node !== id)
    }));
    await fetch(`/api/nodes/${id}`, { method: 'DELETE' });
  };

  return { addNode, updateNodePosition, updateNodeTitle, deleteNode };
};
