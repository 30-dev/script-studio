// FILE: components/panel/blocks/AssetBlock.tsx
'use client';

import React, { useState } from 'react';
import { Block } from '@/lib/types';
import { Upload, Link as LinkIcon, X } from 'lucide-react';

interface AssetBlockProps {
  block: Block;
  onUpdate: (id: string, updates: Partial<Block>) => void;
  onDelete: (id: string) => void;
}

export const AssetBlock = ({ block, onUpdate, onDelete }: AssetBlockProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // In a real app, upload to Supabase Storage
      // For this demo, we'll use a local object URL
      const url = URL.createObjectURL(e.dataTransfer.files[0]);
      onUpdate(block.id, { asset_url: url });
    }
  };

  return (
    <div className="bg-white border border-[#E5E5E3] rounded-xl overflow-hidden shadow-sm">
      <div className="bg-[#FAECE7] px-3 py-2 flex justify-between items-center">
        <span className="text-xs font-bold text-[#993C1D] uppercase tracking-wider">Asset</span>
        <button onClick={() => onDelete(block.id)} className="text-[#993C1D] hover:text-red-500 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>
      <div className="p-3 space-y-3">
        {block.asset_url ? (
          <div className="relative group">
            <img src={block.asset_url} alt="Asset" className="w-full h-32 object-cover rounded-lg border border-[#E5E5E3]" />
            <button 
              onClick={() => onUpdate(block.id, { asset_url: '' })}
              className="absolute top-2 right-2 p-1 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ) : (
          <div
            className={`w-full h-32 border-2 border-dashed rounded-lg flex flex-col items-center justify-center transition-colors ${
              dragActive ? 'border-[#7F77DD] bg-[#7F77DD]/5' : 'border-[#E5E5E3]'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className="w-6 h-6 text-gray-400 mb-2" />
            <p className="text-xs text-gray-500">Arrastra un archivo o haz clic</p>
            <input 
              type="file" 
              className="absolute inset-0 opacity-0 cursor-pointer" 
              onChange={(e) => e.target.files?.[0] && onUpdate(block.id, { asset_url: URL.createObjectURL(e.target.files[0]) })}
            />
          </div>
        )}
        <div className="flex items-center gap-2 px-3 py-2 bg-[#F5F5F3] rounded-lg">
          <LinkIcon className="w-3 h-3 text-gray-400" />
          <input
            className="flex-1 bg-transparent text-xs text-gray-600 focus:outline-none"
            placeholder="URL del asset..."
            value={block.asset_url || ''}
            onChange={(e) => onUpdate(block.id, { asset_url: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};
