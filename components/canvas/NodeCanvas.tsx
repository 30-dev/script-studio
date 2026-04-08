// FILE: components/canvas/NodeCanvas.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Node, Edge, Block } from '@/lib/types';
import { NodeCard } from './NodeCard';
import { EdgeLayer } from './EdgeLayer';
import { Button } from '@/components/ui/Button';
import { Plus, Upload, MousePointer2 } from 'lucide-react';

interface NodeCanvasProps {
  nodes: Node[];
  edges: Edge[];
  blocks: Block[];
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  onAddNode: (x: number, y: number) => void;
  onUpdateNodePosition: (id: string, x: number, y: number) => void;
  onUpdateNodeTitle: (id: string, title: string) => void;
  onAddEdge: (from: string, to: string) => void;
  onImportDocx: (file: File) => void;
}

export const NodeCanvas = ({
  nodes,
  edges,
  blocks,
  selectedNodeId,
  onSelectNode,
  onAddNode,
  onUpdateNodePosition,
  onUpdateNodeTitle,
  onAddEdge,
  onImportDocx,
}: NodeCanvasProps) => {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [connectingFrom, setConnectingFrom] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current) {
      onSelectNode(null);
    }
  };

  const handleConnectStart = (nodeId: string, e: React.MouseEvent) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (rect) {
      setConnectingFrom(nodeId);
      setMousePos({ 
        x: e.clientX - rect.left, 
        y: e.clientY - rect.top 
      });
    }
  };

  const handleConnectEnd = (toNodeId: string) => {
    if (connectingFrom && connectingFrom !== toNodeId) {
      onAddEdge(connectingFrom, toNodeId);
    }
    setConnectingFrom(null);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (connectingFrom && canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect();
        setMousePos({ 
          x: e.clientX - rect.left, 
          y: e.clientY - rect.top 
        });
      }
    };
    const handleMouseUp = () => {
      if (connectingFrom) setConnectingFrom(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [connectingFrom]);

  return (
    <div 
      ref={canvasRef}
      className="relative flex-1 bg-[#F5F5F3] overflow-hidden cursor-default"
      onClick={handleCanvasClick}
    >
      {/* Toolbar */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-10 bg-white px-4 py-2 rounded-full shadow-sm border border-[#E5E5E3] flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={() => onAddNode(100, 100)}>
          <Plus className="w-4 h-4 mr-2" />
          Escena
        </Button>
        <div className="w-px h-4 bg-[#E5E5E3]" />
        <label className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 hover:bg-[#F5F5F3] rounded-lg cursor-pointer transition-colors">
          <Upload className="w-4 h-4" />
          Importar DOCX
          <input 
            type="file" 
            accept=".docx" 
            className="hidden" 
            onChange={(e) => e.target.files?.[0] && onImportDocx(e.target.files[0])} 
          />
        </label>
      </div>

      {/* Connection Line (Preview) */}
      {connectingFrom && (
        <svg className="absolute inset-0 pointer-events-none w-full h-full z-20">
          <line
            x1={nodes.find(n => n.id === connectingFrom)!.position_x + 280}
            y1={nodes.find(n => n.id === connectingFrom)!.position_y + 60}
            x2={mousePos.x}
            y2={mousePos.y}
            stroke="#7F77DD"
            strokeWidth="2"
            strokeDasharray="4"
          />
        </svg>
      )}

      <EdgeLayer nodes={nodes} edges={edges} />

      {nodes.map((node) => (
        <NodeCard
          key={node.id}
          node={node}
          blocks={blocks.filter(b => b.node_id === node.id)}
          isSelected={selectedNodeId === node.id}
          onSelect={onSelectNode}
          onUpdatePosition={onUpdateNodePosition}
          onUpdateTitle={onUpdateNodeTitle}
          onConnectStart={handleConnectStart}
          onConnectEnd={handleConnectEnd}
        />
      ))}
    </div>
  );
};
