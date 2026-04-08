// FILE: components/panel/AiTab.tsx
'use client';

import React, { useState } from 'react';
import { Block } from '@/lib/types';
import { Button } from '@/components/ui/Button';
import { Sparkles, RefreshCw, Check } from 'lucide-react';

interface AiTabProps {
  blocks: Block[];
  onAddBlock: (type: 'prompt' | 'note', content: string) => void;
}

export const AiTab = ({ blocks, onAddBlock }: AiTabProps) => {
  const [loading, setLoading] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [currentAction, setCurrentAction] = useState<string | null>(null);

  const handleAiAction = async (action: 'generate-prompt' | 'improve-prompt' | 'suggest-notes') => {
    setLoading(action);
    setResult(null);
    setCurrentAction(action);

    const scriptContent = blocks.filter(b => b.type === 'script').map(b => b.content).join('\n');
    const promptContent = blocks.filter(b => b.type === 'prompt').map(b => b.content).join('\n');

    try {
      const res = await fetch('/api/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, scriptContent, promptContent }),
      });
      const data = await res.json();
      setResult(data.result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(null);
    }
  };

  const handleApply = () => {
    if (!result || !currentAction) return;
    const type = currentAction === 'suggest-notes' ? 'note' : 'prompt';
    onAddBlock(type, result);
    setResult(null);
    setCurrentAction(null);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="space-y-3">
        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Acciones AI</p>
        
        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={() => handleAiAction('generate-prompt')}
          isLoading={loading === 'generate-prompt'}
        >
          <Sparkles className="w-4 h-4 mr-2 text-[#7F77DD]" />
          Generar Prompt desde Guion
        </Button>

        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={() => handleAiAction('improve-prompt')}
          isLoading={loading === 'improve-prompt'}
        >
          <RefreshCw className="w-4 h-4 mr-2 text-[#7F77DD]" />
          Mejorar Prompt Existente
        </Button>

        <Button 
          variant="outline" 
          className="w-full justify-start" 
          onClick={() => handleAiAction('suggest-notes')}
          isLoading={loading === 'suggest-notes'}
        >
          <StickyNote className="w-4 h-4 mr-2 text-[#7F77DD]" />
          Sugerir Notas de Producción
        </Button>
      </div>

      {result && (
        <div className="bg-[#F5F5F3] rounded-xl p-4 border border-[#E5E5E3] animate-in fade-in slide-in-from-bottom-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Resultado</p>
          <div className="text-sm text-gray-700 whitespace-pre-wrap mb-4 max-h-[200px] overflow-y-auto">
            {result}
          </div>
          <div className="flex gap-2">
            <Button size="sm" className="flex-1" onClick={handleApply}>
              <Check className="w-4 h-4 mr-2" /> Aplicar
            </Button>
            <Button size="sm" variant="outline" onClick={() => handleAiAction(currentAction as any)}>
              <RefreshCw className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

const StickyNote = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);
