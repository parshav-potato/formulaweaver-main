
import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { CellData } from '@/types/spreadsheet';

interface CellProps {
  id: string;
  isSelected: boolean;
  isInRange?: boolean;
  isEditing?: boolean;
  onSelect: () => void;
  data?: CellData;
  onChange: (value: string) => void;
  onMouseDown: () => void;
  onMouseEnter: () => void;
  onDoubleClick: () => void;
  onBlur: () => void;
}

const Cell = ({
  id,
  isSelected,
  isInRange = false,
  isEditing = false,
  onSelect,
  data,
  onChange,
  onMouseDown,
  onMouseEnter,
  onDoubleClick,
  onBlur,
}: CellProps) => {
  const [editValue, setEditValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);
  
  useEffect(() => {
    // When editing, initialize with the formula or value
    if (isEditing) {
      setEditValue(data?.formula || data?.value?.toString() || '');
    }
  }, [isEditing, data]);

  const handleBlur = () => {
    onBlur();
    // Apply the change when blurring
    if (editValue !== (data?.formula || data?.value?.toString() || '')) {
      onChange(editValue);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // Prevent form submission
      // Save the value first
      if (editValue !== (data?.formula || data?.value?.toString() || '')) {
        onChange(editValue);
      }
      // Then blur the field
      onBlur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      // Revert to original value
      setEditValue(data?.formula || data?.value?.toString() || '');
      onBlur();
    }
  };

  const handleCellMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    onMouseDown();
    
    // Add global mouse up event
    const handleMouseUp = () => {
      setIsDragging(false);
      document.removeEventListener('mouseup', handleMouseUp);
    };
    document.addEventListener('mouseup', handleMouseUp);
  };

  const displayValue = data?.formatted || '';
  
  const cellStyle = data?.style || {};
  const { bold, italic, fontSize, color, align, backgroundColor } = cellStyle;
  
  // Check if the cell contains a formula
  const isFormula = data?.formula && data.formula.startsWith('=');
  
  // Check if the cell contains a number
  const isNumber = data?.type === 'number';

  return (
    <div
      className={cn(
        'w-[100px] h-[30px] border-r border-b border-sheet-border relative transition-colors duration-100',
        isSelected && 'z-10',
        isInRange && !isSelected && 'bg-blue-50/70 animate-pulse',
        !isSelected && !isInRange && 'hover:bg-gray-50',
        isFormula && 'text-blue-700',
        isNumber && 'text-green-700',
        isDragging && 'cursor-grabbing',
        isInRange && isDragging && 'animate-pulse'
      )}
      onClick={onSelect}
      onDoubleClick={onDoubleClick}
      onMouseDown={handleCellMouseDown}
      onMouseEnter={onMouseEnter}
      style={{
        fontWeight: bold ? 'bold' : 'normal',
        fontStyle: italic ? 'italic' : 'normal',
        fontSize: fontSize ? `${fontSize}px` : '14px',
        color: isFormula ? '#1a56db' : isNumber ? '#15803d' : color || 'inherit',
        textAlign: align || (isNumber ? 'right' : 'left'),
        backgroundColor: backgroundColor || 'transparent'
      }}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={editValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full h-full px-2 outline-none border-none bg-white absolute top-0 left-0 z-20"
          autoFocus
        />
      ) : (
        <>
          <div className="w-full h-full px-2 overflow-hidden whitespace-nowrap text-sm flex items-center">
            {displayValue}
          </div>
          {isSelected && (
            <div className="absolute inset-0 ring-2 ring-blue-500 ring-offset-0 pointer-events-none animate-pulse" />
          )}
          {isInRange && !isSelected && (
            <div className="absolute inset-0 ring-1 ring-blue-400 ring-offset-0 pointer-events-none" />
          )}
        </>
      )}
    </div>
  );
};

export default Cell;
