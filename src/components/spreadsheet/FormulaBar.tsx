
import React from 'react';

interface FormulaBarProps {
  value: string;
  onChange: (value: string) => void;
  selectedCell?: string | null;
}

export const FormulaBar = ({ value, onChange, selectedCell }: FormulaBarProps) => {
  return (
    <div className="h-[40px] border-b border-sheet-border flex items-center space-x-2 px-4 bg-white shadow-sm">
      <div className="w-[80px] h-[28px] border border-sheet-border rounded flex items-center justify-center bg-gray-100 text-sm font-mono font-medium">
        {selectedCell || 'A1'}
      </div>
      <div className="flex-1 flex items-center h-[28px] px-2 border border-sheet-border rounded-md bg-white focus-within:ring-1 focus-within:ring-green-500 focus-within:border-green-500">
        <span className="text-gray-500 mr-1 text-sm">=</span>
        <input
          type="text"
          value={value.startsWith('=') ? value.substring(1) : value}
          onChange={(e) => onChange(e.target.value.startsWith('=') ? e.target.value : `=${e.target.value}`)}
          className="flex-1 h-full outline-none border-none font-mono text-sm"
          placeholder="Enter formula..."
        />
      </div>
    </div>
  );
};

export default FormulaBar;
