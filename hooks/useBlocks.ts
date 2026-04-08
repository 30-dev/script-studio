// FILE: hooks/useBlocks.ts
import { Block, BlockType } from '@/lib/types';

export const useBlocks = (setScript: any) => {
  const addBlock = async (nodeId: string, type: BlockType) => {
    const res = await fetch('/api/blocks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ node_id: nodeId, type, content: '', position: 0 }),
    });
    const newBlock = await res.json();
    setScript((prev: any) => ({ ...prev, blocks: [...prev.blocks, newBlock] }));
  };

  const updateBlock = async (id: string, updates: Partial<Block>) => {
    setScript((prev: any) => ({
      ...prev,
      blocks: prev.blocks.map((b: Block) => b.id === id ? { ...b, ...updates } : b)
    }));
    await fetch(`/api/blocks/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates),
    });
  };

  const deleteBlock = async (id: string) => {
    setScript((prev: any) => ({
      ...prev,
      blocks: prev.blocks.filter((b: Block) => b.id !== id)
    }));
    await fetch(`/api/blocks/${id}`, { method: 'DELETE' });
  };

  return { addBlock, updateBlock, deleteBlock };
};
