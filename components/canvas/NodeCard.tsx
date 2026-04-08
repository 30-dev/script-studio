// FILE: components/canvas/NodeCard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Node, Block } from '@/lib/types';
import { useDrag } from '@/hooks/useDrag';
import { FileText, Sparkles, StickyNote, Code, Image as ImageIcon } from 'lucide-react';

interface NodeCardProps {
  node: Node;
  blocks: Block[];
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onUpdateTitle: (id: string, title: string) => void;
  onConnectStart: (nodeId: string, e: React.MouseEvent) => void;
  onConnectEnd: (nodeId: string) => void;
}

export const NodeCard = ({
  node,
  blocks,
  isSelected,
  onSelect,
  onUpdatePosition,
  onUpdateTitle,
  onConnectStart,
  onConnectEnd,
}: NodeCardProps) => {
  const { position, onMouseDown, onMouseMove, onMouseUp } = useDrag(
    { x: node.position_x, y: node.position_y },
    (pos) => onUpdatePosition(node.id, pos.x, pos.y)
  );

  const [title, setTitle] = useState(node.title);

  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => onMouseMove(e);
    const handleGlobalMouseUp = () => onMouseUp();

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [onMouseMove, onMouseUp]);

  const blockTypeIcons = {
    script: <FileText className="w-3 h-3" />,
    prompt: <Sparkles className="w-3 h-3" />,
    note: <StickyNote className="w-3 h-3" />,
    code: <Code className="w-3 h-3" />,
    asset: <ImageIcon className="w-3 h-3" />,
  };

  const blockTypeColors = {
    script: 'bg-[#E6F1FB] text-[#185FA5]',
    prompt: 'bg-[#EEEDFE] text-[#534AB7]',
    note: 'bg-[#FAEEDA] text-[#854F0B]',
    code: 'bg-[#EAF3DE] text-[#3B6D11]',
    asset: 'bg-[#FAECE7] text-[#993C1D]',
  };

  const assetBlock = blocks.find(b => b.type === 'asset' && b.asset_url);

  return (
    <div
      className={`absolute w-[280px] bg-white rounded-xl border transition-shadow cursor-grab active:cursor-grabbing ${
        isSelected ? 'border-[#7F77DD] ring-2 ring-[#7F77DD]/20 shadow-lg' : 'border-[#E5E5E3] shadow-sm'
      }`}
      style={{ left: position.x, top: position.y }}
      onMouseDown={(e) => {
        onMouseDown(e);
        onSelect(node.id);
      }}
      onMouseUp={() => onConnectEnd(node.id)}
    >
      {/* Left Connector Dot */}
      <div 
        className="absolute -left-1.5 top-[60px] w-3 h-3 bg-white border border-[#E5E5E3] rounded-full hover:bg-[#7F77DD] transition-colors"
        onMouseUp={(e) => {
          e.stopPropagation();
          onConnectEnd(node.id);
        }}
      />

      {/* Right Connector Dot */}
      <div 
        className="absolute -right-1.5 top-[60px] w-3 h-3 bg-white border border-[#E5E5E3] rounded-full hover:bg-[#7F77DD] transition-colors cursor-crosshair"
        onMouseDown={(e) => {
          e.stopPropagation();
          onConnectStart(node.id, e);
        }}
      />

      <div className="p-4 border-b border-[#E5E5E3]">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Escena</span>
          <input
            className="min-w-0 flex-1 bg-transparent font-bold text-[#1A1A1A] focus:outline-none truncate"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => onUpdateTitle(node.id, title)}
            onMouseDown={(e) => e.stopPropagation()}
          />
        </div>
      </div>

      <div className="p-4 space-y-3">
        {assetBlock && (
          <div className="w-full h-32 bg-gray-100 rounded-lg overflow-hidden border border-[#E5E5E3]">
            <img src={assetBlock.asset_url} alt="Asset preview" className="w-full h-full object-cover" />
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {blocks.map((block) => (
            <div
              key={block.id}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md text-[10px] font-medium ${blockTypeColors[block.type]}`}
            >
              {blockTypeIcons[block.type]}
              <span className="capitalize">{block.type}</span>
            </div>
          ))}
          {blocks.length === 0 && (
            <span className="text-xs text-gray-400 italic">Sin bloques</span>
          )}
        </div>
      </div>
    </div>
  );
};
