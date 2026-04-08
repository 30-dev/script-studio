// FILE: components/panel/SidePanel.tsx
'use client';

import React, { useState } from 'react';
import { Block, BlockType } from '@/lib/types';
import { BlocksTab } from './BlocksTab';
import { AiTab } from './AiTab';
import { X, Layout, Sparkles } from 'lucide-react';

interface SidePanelProps {
  nodeId: string | null;
  nodeTitle: string;
  blocks: Block[];
  onClose: () => void;
  onAddBlock: (type: BlockType, content?: string) => void;
  onUpdateBlock: (id: string, updates: Partial<Block>) => void;
  onDeleteBlock: (id: string) => void;
}

export const SidePanel = ({
  nodeId,
  nodeTitle,
  blocks,
  onClose,
  onAddBlock,
  onUpdateBlock,
  onDeleteBlock,
}: SidePanelProps) => {
  const [activeTab, setActiveTab] = useState<'blocks' | 'ai'>('blocks');

  if (!nodeId) return null;

  return (
    <div className="w-[350px] bg-white border-l border-[#E5E5E3] flex flex-col h-full shadow-2xl animate-in slide-in-from-right duration-300">
      <div className="p-4 border-b border-[#E5E5E3] flex justify-between items-center">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Escena</p>
          <h2 className="text-lg font-bold text-[#1A1A1A] truncate max-w-[200px]">{nodeTitle}</h2>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-[#F5F5F3] rounded-lg transition-colors">
          <X className="w-5 h-5 text-gray-400" />
        </button>
      </div>

      <div className="flex border-b border-[#E5E5E3]">
        <button
          onClick={() => setActiveTab('blocks')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'blocks' ? 'text-[#7F77DD] border-b-2 border-[#7F77DD]' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Layout className="w-4 h-4" />
          Bloques
        </button>
        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-3 text-sm font-medium flex items-center justify-center gap-2 transition-colors ${
            activeTab === 'ai' ? 'text-[#7F77DD] border-b-2 border-[#7F77DD]' : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          Asistente AI
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'blocks' ? (
          <BlocksTab 
            blocks={blocks} 
            onAddBlock={(type) => onAddBlock(type)} 
            onUpdateBlock={onUpdateBlock} 
            onDeleteBlock={onDeleteBlock} 
          />
        ) : (
          <AiTab 
            blocks={blocks} 
            onAddBlock={(type, content) => onAddBlock(type, content)} 
          />
        )}
      </div>
    </div>
  );
};
