
import React, { useState, useEffect, useCallback } from 'react';
import Cell from './Cell';
import { SpreadsheetState, CellRange } from '@/types/spreadsheet';
import { Move } from 'lucide-react';

const COLUMNS = 26; // A to Z
const ROWS = 100;

interface GridProps {
  state: SpreadsheetState;
  onCellChange: (cellId: string, value: string) => void;
  onCellSelect: (cellId: string) => void;
  onRangeSelect?: (range: CellRange | null) => void;
}

export const Grid = ({ state, onCellChange, onCellSelect, onRangeSelect }: GridProps) => {
  const [dragStart, setDragStart] = useState<string | null>(null);
  const [selectedRange, setSelectedRange] = useState<CellRange | null>(null);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const getColumnLabel = (index: number) => String.fromCharCode(65 + index);
  
  // Convert cell ID (like "A1") to row and column indices
  const getCellIndices = (cellId: string) => {
    const colChar = cellId.match(/[A-Z]+/)?.[0] || 'A';
    const rowStr = cellId.match(/\d+/)?.[0] || '1';
    
    const colIndex = colChar.charCodeAt(0) - 65; // A=0, B=1, etc.
    const rowIndex = parseInt(rowStr) - 1; // 1-based to 0-based
    
    return { colIndex, rowIndex };
  };
  
  // Convert row and column indices to cell ID (like "A1")
  const getCellId = (colIndex: number, rowIndex: number) => {
    return `${getColumnLabel(colIndex)}${rowIndex + 1}`;
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!state.selectedCell || editingCell) return;
      
      const { colIndex, rowIndex } = getCellIndices(state.selectedCell);
      let newColIndex = colIndex;
      let newRowIndex = rowIndex;
      
      switch (e.key) {
        case 'ArrowUp':
          newRowIndex = Math.max(0, rowIndex - 1);
          e.preventDefault();
          break;
        case 'ArrowDown':
          newRowIndex = Math.min(ROWS - 1, rowIndex + 1);
          e.preventDefault();
          break;
        case 'ArrowLeft':
          newColIndex = Math.max(0, colIndex - 1);
          e.preventDefault();
          break;
        case 'ArrowRight':
          newColIndex = Math.min(COLUMNS - 1, colIndex + 1);
          e.preventDefault();
          break;
        case 'Tab':
          newColIndex = e.shiftKey ? Math.max(0, colIndex - 1) : Math.min(COLUMNS - 1, colIndex + 1);
          e.preventDefault();
          break;
        case 'Enter':
          if (e.shiftKey) {
            newRowIndex = Math.max(0, rowIndex - 1);
          } else {
            newRowIndex = Math.min(ROWS - 1, rowIndex + 1);
          }
          e.preventDefault();
          break;
        case 'F2':
          setEditingCell(state.selectedCell);
          e.preventDefault();
          break;
        default:
          // For any other key, if it's a printable character, start editing the cell
          if (e.key.length === 1 && !e.ctrlKey && !e.altKey && !e.metaKey) {
            setEditingCell(state.selectedCell);
          }
          break;
      }
      
      if (newColIndex !== colIndex || newRowIndex !== rowIndex) {
        const newCellId = getCellId(newColIndex, newRowIndex);
        onCellSelect(newCellId);
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selectedCell, editingCell, onCellSelect]);

  const handleMouseDown = useCallback((cellId: string) => {
    setDragStart(cellId);
    setSelectedRange(null);
    onCellSelect(cellId);
    setIsDragging(true);
  }, [onCellSelect]);

  const handleMouseUp = useCallback(() => {
    setDragStart(null);
    setIsDragging(false);
  }, []);

  const handleMouseEnter = useCallback((cellId: string) => {
    if (dragStart && dragStart !== cellId) {
      const startIndices = getCellIndices(dragStart);
      const currentIndices = getCellIndices(cellId);
      
      const startCol = Math.min(startIndices.colIndex, currentIndices.colIndex);
      const endCol = Math.max(startIndices.colIndex, currentIndices.colIndex);
      const startRow = Math.min(startIndices.rowIndex, currentIndices.rowIndex);
      const endRow = Math.max(startIndices.rowIndex, currentIndices.rowIndex);
      
      const newRange = {
        start: { col: startCol, row: startRow },
        end: { col: endCol, row: endRow }
      };
      
      setSelectedRange(newRange);
      onRangeSelect?.(newRange);
    }
  }, [dragStart, onRangeSelect]);

  const isInSelectedRange = useCallback((cellId: string) => {
    if (!selectedRange) return false;
    
    const { colIndex, rowIndex } = getCellIndices(cellId);
    return (
      colIndex >= selectedRange.start.col && 
      colIndex <= selectedRange.end.col && 
      rowIndex >= selectedRange.start.row && 
      rowIndex <= selectedRange.end.row
    );
  }, [selectedRange]);

  const handleDoubleClick = useCallback((cellId: string) => {
    setEditingCell(cellId);
  }, []);

  const handleCellBlur = useCallback(() => {
    setEditingCell(null);
  }, []);

  return (
    <div 
      className="overflow-auto flex-1 relative" 
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: isDragging ? 'grabbing' : 'default' }}
    >
      <div className="min-w-max">
        {/* Header Row */}
        <div className="flex sticky top-0 z-10 bg-sheet-header border-b border-sheet-border">
          <div className="w-[50px] h-[30px] flex items-center justify-center border-r border-sheet-border bg-sheet-header">
            <Move className="h-4 w-4 text-gray-400" />
          </div>
          {Array.from({ length: COLUMNS }).map((_, i) => (
            <div
              key={`header-${i}`}
              className="w-[100px] h-[30px] flex items-center justify-center border-r border-sheet-border bg-sheet-header font-medium text-sm text-gray-600"
            >
              {getColumnLabel(i)}
            </div>
          ))}
        </div>

        {/* Grid Body */}
        <div className="relative">
          {Array.from({ length: ROWS }).map((_, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex">
              {/* Row Header */}
              <div className="sticky left-0 w-[50px] h-[30px] flex items-center justify-center border-r border-b border-sheet-border bg-sheet-header font-medium text-sm text-gray-600">
                {rowIndex + 1}
              </div>
              {/* Row Cells */}
              {Array.from({ length: COLUMNS }).map((_, colIndex) => {
                const cellId = `${getColumnLabel(colIndex)}${rowIndex + 1}`;
                return (
                  <Cell
                    key={cellId}
                    id={cellId}
                    isSelected={state.selectedCell === cellId}
                    isInRange={isInSelectedRange(cellId)}
                    isEditing={editingCell === cellId}
                    onSelect={() => onCellSelect(cellId)}
                    data={state.cells[cellId]}
                    onChange={(value) => onCellChange(cellId, value)}
                    onMouseDown={() => handleMouseDown(cellId)}
                    onMouseEnter={() => handleMouseEnter(cellId)}
                    onDoubleClick={() => handleDoubleClick(cellId)}
                    onBlur={handleCellBlur}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Grid;
