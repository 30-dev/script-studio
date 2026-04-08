// FILE: components/panel/BlocksTab.tsx
'use client';

import React from 'react';
import { Block, BlockType } from '@/lib/types';
import { ScriptBlock } from './blocks/ScriptBlock';
import { PromptBlock } from './blocks/PromptBlock';
import { NoteBlock } from './blocks/NoteBlock';
import { CodeBlock } from './blocks/CodeBlock';
import { AssetBlock } from './blocks/AssetBlock';
import { Button } from '@/components/ui/Button';
import { Plus, ChevronUp, ChevronDown } from 'lucide-react';

interface BlocksTabProps {
  blocks: Block[];
  onAddBlock: (type: BlockType) => void;
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
  onDeleteBlock: (id: string) => void;
}

export const BlocksTab = ({ blocks, onAddBlock, onUpdateBlock, onDeleteBlock }: BlocksTabProps) => {
  const sorted = [...blocks].sort((a, b) => a.position - b.position);

  const moveBlock = (index: number, direction: 'up' | 'down') => {
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    if (swapIndex < 0 || swapIndex >= sorted.length) return;

    // Reorder array
    const reordered = [...sorted];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(swapIndex, 0, moved);

    // Assign clean sequential positions (0, 1, 2...) and save each
    reordered.forEach((block, i) => {
      onUpdateBlock(block.id, { position: i });
    });
  };

  const renderBlock = (block: Block, index: number) => {
    const controls = (
      <div className="flex flex-col gap-0.5">
        <button
          onClick={() => moveBlock(index, 'up')}
          disabled={index === 0}
          className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          title="Subir bloque"
        >
          <ChevronUp className="w-3.5 h-3.5 text-gray-400" />
        </button>
        <button
          onClick={() => moveBlock(index, 'down')}
          disabled={index === sorted.length - 1}
          className="p-0.5 rounded hover:bg-gray-100 disabled:opacity-20 disabled:cursor-not-allowed transition-colors"
          title="Bajar bloque"
        >
          <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>
    );

    const blockEl = (() => {
      switch (block.type) {
        case 'script': return <ScriptBlock key={block.id} block={block} onUpdate={onUpdateBlock} onDelete={onDeleteBlock} />;
        case 'prompt': return <PromptBlock key={block.id} block={block} onUpdate={onUpdateBlock} onDelete={onDeleteBlock} />;
        case 'note':   return <NoteBlock key={block.id} block={block} onUpdate={onUpdateBlock} onDelete={onDeleteBlock} />;
        case 'code':   return <CodeBlock key={block.id} block={block} onUpdate={onUpdateBlock} onDelete={onDeleteBlock} />;
        case 'asset':  return <AssetBlock key={block.id} block={block} onUpdate={onUpdateBlock} onDelete={onDeleteBlock} />;
        default: return null;
      }
    })();

    return (
      <div key={block.id} className="flex gap-1.5 items-start">
        <div className="mt-2 flex-shrink-0">{controls}</div>
        <div className="flex-1 min-w-0">{blockEl}</div>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {sorted.map((block, index) => renderBlock(block, index))}
        {blocks.length === 0 && (
          <div className="text-center py-12">
            <p className="text-sm text-gray-400">No hay bloques en esta escena.</p>
          </div>
        )}
      </div>

      <div className="p-4 border-t border-[#E5E5E3] bg-white">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Añadir Bloque</p>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="outline" size="sm" onClick={() => onAddBlock('script')} className="justify-start">
            <Plus className="w-3 h-3 mr-2" /> Guion
          </Button>
          <Button variant="outline" size="sm" onClick={() => onAddBlock('prompt')} className="justify-start">
            <Plus className="w-3 h-3 mr-2" /> Prompt
          </Button>
          <Button variant="outline" size="sm" onClick={() => onAddBlock('note')} className="justify-start">
            <Plus className="w-3 h-3 mr-2" /> Nota
          </Button>
          <Button variant="outline" size="sm" onClick={() => onAddBlock('code')} className="justify-start">
            <Plus className="w-3 h-3 mr-2" /> Código
          </Button>
          <Button variant="outline" size="sm" onClick={() => onAddBlock('asset')} className="justify-start col-span-2">
            <Plus className="w-3 h-3 mr-2" /> Asset
          </Button>
        </div>
      </div>
    </div>
  );
};
