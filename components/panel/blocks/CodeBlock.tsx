// FILE: components/panel/blocks/CodeBlock.tsx
'use client';

import React from 'react';
import { Block } from '@/lib/types';

interface CodeBlockProps {
  block: Block;
  onUpdate: (id: string, updates: Partial<Block>) => void;
  onDelete: (id: string) => void;
}

export const CodeBlock = ({ block, onUpdate, onDelete }: CodeBlockProps) => {
  return (
    <div className="bg-white border border-[#E5E5E3] rounded-xl overflow-hidden shadow-sm">
      <div className="bg-[#EAF3DE] px-3 py-2 flex justify-between items-center">
        <span className="text-xs font-bold text-[#3B6D11] uppercase tracking-wider">Código</span>
        <button onClick={() => onDelete(block.id)} className="text-[#3B6D11] hover:text-red-500 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="p-3">
        <textarea
          className="w-full min-h-[80px] text-sm font-mono text-gray-700 bg-transparent focus:outline-none resize-none"
          placeholder="// Código o snippets..."
          value={block.content}
          onChange={(e) => onUpdate(block.id, { content: e.target.value })}
        />
      </div>
    </div>
  );
};
