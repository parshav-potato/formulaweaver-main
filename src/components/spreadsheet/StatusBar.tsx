
import React from 'react';

interface StatusBarProps {
  selectedRange: {
    cells: number;
    sum: number;
    average: number;
  } | null;
}

export const StatusBar = ({ selectedRange }: StatusBarProps) => {
  return (
    <div className="h-[30px] border-t border-sheet-border bg-gray-100 flex items-center justify-between px-4 text-xs text-gray-600">
      <div className="flex items-center space-x-6">
        <div className="flex items-center">
          <svg className="h-3 w-3 mr-1 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="4" y="4" width="16" height="16" rx="2" />
            <path d="M9 9h6v6H9z" />
          </svg>
          <span>Ready</span>
        </div>
        
        {selectedRange && (
          <>
            <div className="flex items-center">
              <span className="mr-1">Cells:</span>
              <span className="font-medium">{selectedRange.cells}</span>
            </div>
            
            <div className="flex items-center">
              <svg className="h-3 w-3 mr-1 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 7h16M4 12h4M4 17h8" />
              </svg>
              <span className="mr-1">Sum:</span>
              <span className="font-medium">{selectedRange.sum.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
            
            <div className="flex items-center">
              <svg className="h-3 w-3 mr-1 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 12h16M12 4v16" />
              </svg>
              <span className="mr-1">Average:</span>
              <span className="font-medium">{selectedRange.average.toFixed(2)}</span>
            </div>
          </>
        )}
      </div>
      
      <div className="flex items-center">
        <span className="text-gray-500">Built by Parshav Jain</span>
      </div>
    </div>
  );
};

export default StatusBar;
