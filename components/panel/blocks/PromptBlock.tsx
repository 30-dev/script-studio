// FILE: components/panel/blocks/PromptBlock.tsx
'use client';

import React from 'react';
import { Block } from '@/lib/types';
import { Copy, Check } from 'lucide-react';

interface PromptBlockProps {
  block: Block;
  onUpdate: (id: string, updates: Partial<Block>) => void;
  onDelete: (id: string) => void;
}

export const PromptBlock = ({ block, onUpdate, onDelete }: PromptBlockProps) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(block.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white border border-[#E5E5E3] rounded-xl overflow-hidden shadow-sm">
      <div className="bg-[#EEEDFE] px-3 py-2 flex justify-between items-center">
        <span className="text-xs font-bold text-[#534AB7] uppercase tracking-wider">Prompt AI</span>
        <div className="flex items-center gap-2">
          <button onClick={handleCopy} className="text-[#534AB7] hover:opacity-70 transition-opacity">
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </button>
          <button onClick={() => onDelete(block.id)} className="text-[#534AB7] hover:text-red-500 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
      <div className="p-3">
        <textarea
          className="w-full min-h-[80px] text-sm font-mono text-gray-700 bg-transparent focus:outline-none resize-none"
          placeholder="Prompt para generación visual..."
          value={block.content}
          onChange={(e) => onUpdate(block.id, { content: e.target.value })}
        />
      </div>
    </div>
  );
};
