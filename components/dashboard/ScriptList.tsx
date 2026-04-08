// FILE: components/dashboard/ScriptList.tsx
'use client';

import React from 'react';
import { Script } from '@/lib/types';
import Link from 'next/link';
import { FileText, ChevronRight, Clock } from 'lucide-react';

interface ScriptListProps {
  initialScripts: Script[];
}

export const ScriptList = ({ initialScripts }: ScriptListProps) => {
  if (initialScripts.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-[#E5E5E3]">
        <p className="text-gray-500">No tienes guiones todavía. ¡Crea uno nuevo!</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {initialScripts.map((script) => (
        <Link
          key={script.id}
          href={`/scripts/${script.id}`}
          className="group bg-white p-6 rounded-2xl border border-[#E5E5E3] hover:border-[#7F77DD] transition-all hover:shadow-md"
        >
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-[#EEEDFE] rounded-xl text-[#7F77DD]">
              <FileText className="w-6 h-6" />
            </div>
            <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-[#7F77DD] transition-colors" />
          </div>
          <h3 className="text-lg font-bold text-[#1A1A1A] mb-2 truncate">{script.title}</h3>
          <div className="flex items-center text-sm text-gray-500">
            <Clock className="w-4 h-4 mr-1" />
            <span>Actualizado {new Date(script.updated_at).toLocaleDateString()}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};
