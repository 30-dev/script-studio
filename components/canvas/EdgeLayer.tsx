// FILE: components/canvas/EdgeLayer.tsx
'use client';

import React from 'react';
import { Node, Edge } from '@/lib/types';

interface EdgeLayerProps {
  nodes: Node[];
  edges: Edge[];
}

export const EdgeLayer = ({ nodes, edges }: EdgeLayerProps) => {
  const getNodePosition = (id: string) => {
    const node = nodes.find(n => n.id === id);
    if (!node) return { x: 0, y: 0 };
    return {
      x: node.position_x,
      y: node.position_y
    };
  };

  return (
    <svg className="absolute inset-0 pointer-events-none w-full h-full">
      <defs>
        <marker
          id="arrowhead"
          markerWidth="10"
          markerHeight="7"
          refX="9"
          refY="3.5"
          orient="auto"
        >
          <polygon points="0 0, 10 3.5, 0 7" fill="#E5E5E3" />
        </marker>
      </defs>
      {edges.map((edge) => {
        const from = getNodePosition(edge.from_node);
        const to = getNodePosition(edge.to_node);

        // Calculate start and end points (right side of from, left side of to)
        // Assuming node width is roughly 280px
        const startX = from.x + 280;
        const startY = from.y + 60; // Middle of card header
        const endX = to.x;
        const endY = to.y + 60;

        const cp1x = startX + (endX - startX) / 2;
        const cp2x = startX + (endX - startX) / 2;

        const path = `M ${startX} ${startY} C ${cp1x} ${startY}, ${cp2x} ${endY}, ${endX} ${endY}`;

        return (
          <path
            key={edge.id}
            d={path}
            stroke="#E5E5E3"
            strokeWidth="2"
            fill="none"
            markerEnd="url(#arrowhead)"
          />
        );
      })}
    </svg>
  );
};
