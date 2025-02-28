
import React, { useState, useCallback, useEffect, useMemo } from 'react';
import Grid from '@/components/spreadsheet/Grid';
import Toolbar from '@/components/spreadsheet/Toolbar';
import FormulaBar from '@/components/spreadsheet/FormulaBar';
import StatusBar from '@/components/spreadsheet/StatusBar';
import { SpreadsheetState, CellData, CellRange } from '@/types/spreadsheet';
import { evaluateFormula, formatCellValue } from '@/utils/formulaEvaluator';
import { findAndReplace, removeDuplicates } from '@/utils/formulaFunctions';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [state, setState] = useState<SpreadsheetState>({
    cells: {},
    selectedCell: null,
    formulaBarValue: '',
    columnWidths: {},
    rowHeights: {},
    savedSheets: {},
    selectedRange: null
  });
  
  const [clipboardData, setClipboardData] = useState<{[key: string]: CellData} | null>(null);

  // Calculate stats for selected range
  const rangeStats = useMemo(() => {
    if (!state.selectedRange) return null;
    
    const { start, end } = state.selectedRange;
    let sum = 0;
    let count = 0;
    let numericCount = 0;
    
    for (let row = start.row; row <= end.row; row++) {
      for (let col = start.col; col <= end.col; col++) {
        const colChar = String.fromCharCode(65 + col);
        const cellId = `${colChar}${row + 1}`;
        count++;
        
        const cellValue = state.cells[cellId]?.value;
        if (typeof cellValue === 'number') {
          sum += cellValue;
          numericCount++;
        } else if (typeof cellValue === 'string' && !isNaN(Number(cellValue))) {
          sum += Number(cellValue);
          numericCount++;
        }
      }
    }
    
    return {
      cells: count,
      sum,
      average: numericCount > 0 ? sum / numericCount : 0
    };
  }, [state.selectedRange, state.cells]);

  // Function to recalculate all formula cells
  const recalculateFormulas = useCallback((newState: SpreadsheetState) => {
    const updatedState = { ...newState };
    
    Object.entries(updatedState.cells).forEach(([cellId, cell]) => {
      if (cell.formula) {
        updatedState.cells[cellId] = {
          ...cell,
          formatted: formatCellValue(evaluateFormula(cell.formula, updatedState))
        };
      }
    });
    
    return updatedState;
  }, []);

  const handleCellChange = useCallback((cellId: string, value: string) => {
    setState((prevState) => {
      const newCellData: CellData = {
        value: value,
        formula: value.startsWith('=') ? value : '',
        formatted: value.startsWith('=') 
          ? formatCellValue(evaluateFormula(value, prevState))
          : value,
        type: value.startsWith('=') ? 'formula' : isNaN(Number(value)) ? 'text' : 'number',
        style: prevState.cells[cellId]?.style || {},
      };

      const newState = {
        ...prevState,
        cells: {
          ...prevState.cells,
          [cellId]: newCellData,
        },
      };

      // Recalculate dependent cells
      Object.entries(prevState.cells).forEach(([id, cell]) => {
        if (cell.formula?.includes(cellId)) {
          newState.cells[id] = {
            ...cell,
            formatted: formatCellValue(evaluateFormula(cell.formula, newState)),
          };
        }
      });

      return newState;
    });
  }, []);

  const handleCellSelect = useCallback((cellId: string) => {
    setState(prev => {
      const cell = prev.cells[cellId];
      return {
        ...prev,
        selectedCell: cellId,
        formulaBarValue: cell?.formula || cell?.formatted || '',
      };
    });
  }, []);

  const handleFormulaBarChange = useCallback((value: string) => {
    setState(prev => ({ ...prev, formulaBarValue: value }));
    if (state.selectedCell) {
      handleCellChange(state.selectedCell, value);
    }
  }, [state.selectedCell, handleCellChange]);

  const handleStyleChange = useCallback((cellId: string, style: Partial<CellData['style']>) => {
    setState(prev => ({
      ...prev,
      cells: {
        ...prev.cells,
        [cellId]: {
          ...prev.cells[cellId] || { value: '', formula: '', formatted: '', type: 'text' },
          style: {
            ...prev.cells[cellId]?.style || {},
            ...style,
          },
        },
      },
    }));
  }, []);
  
  const handleRangeSelect = useCallback((range: CellRange | null) => {
    setState(prev => ({
      ...prev,
      selectedRange: range
    }));
  }, []);
  
  const handleAddRow = useCallback(() => {
    if (!state.selectedCell) {
      toast({
        title: "Select a cell first",
        description: "Please select a cell to determine where to add a row",
      });
      return;
    }
    
    const rowMatch = state.selectedCell.match(/\d+/);
    if (!rowMatch) return;
    
    const rowIndex = parseInt(rowMatch[0]);
    const newCells = { ...state.cells };
    
    // Shift all cells below the current row down by one
    Object.keys(state.cells).forEach(cellId => {
      const cellRowMatch = cellId.match(/([A-Z]+)(\d+)/);
      if (!cellRowMatch) return;
      
      const [_, col, rowStr] = cellRowMatch;
      const cellRow = parseInt(rowStr);
      
      if (cellRow >= rowIndex) {
        const newCellId = `${col}${cellRow + 1}`;
        newCells[newCellId] = state.cells[cellId];
        delete newCells[cellId];
      }
    });
    
    setState(prev => ({
      ...prev,
      cells: newCells
    }));
    
    toast({
      title: "Row added",
      description: `A new row has been added at position ${rowIndex}`
    });
  }, [state.selectedCell, state.cells]);
  
  const handleDeleteRow = useCallback(() => {
    if (!state.selectedCell) {
      toast({
        title: "Select a cell first",
        description: "Please select a cell to determine which row to delete",
      });
      return;
    }
    
    const rowMatch = state.selectedCell.match(/\d+/);
    if (!rowMatch) return;
    
    const rowIndex = parseInt(rowMatch[0]);
    const newCells = { ...state.cells };
    
    // Remove cells in the current row and shift cells below up
    Object.keys(state.cells).forEach(cellId => {
      const cellRowMatch = cellId.match(/([A-Z]+)(\d+)/);
      if (!cellRowMatch) return;
      
      const [_, col, rowStr] = cellRowMatch;
      const cellRow = parseInt(rowStr);
      
      if (cellRow === rowIndex) {
        delete newCells[cellId];
      } else if (cellRow > rowIndex) {
        const newCellId = `${col}${cellRow - 1}`;
        newCells[newCellId] = state.cells[cellId];
        delete newCells[cellId];
      }
    });
    
    setState(prev => ({
      ...prev,
      cells: newCells
    }));
    
    toast({
      title: "Row deleted",
      description: `Row ${rowIndex} has been deleted`
    });
  }, [state.selectedCell, state.cells]);
  
  const handleAddColumn = useCallback(() => {
    if (!state.selectedCell) {
      toast({
        title: "Select a cell first",
        description: "Please select a cell to determine where to add a column",
      });
      return;
    }
    
    const colMatch = state.selectedCell.match(/([A-Z]+)/);
    if (!colMatch) return;
    
    const colStr = colMatch[0];
    const colNum = colStr.charCodeAt(0) - 64; // A=1, B=2, etc.
    const newCells = { ...state.cells };
    
    // Shift all cells to the right of the current column
    Object.keys(state.cells).forEach(cellId => {
      const cellColMatch = cellId.match(/([A-Z]+)(\d+)/);
      if (!cellColMatch) return;
      
      const [_, col, row] = cellColMatch;
      const cellColNum = col.charCodeAt(0) - 64;
      
      if (cellColNum >= colNum) {
        const newColChar = String.fromCharCode(cellColNum + 1 + 64);
        const newCellId = `${newColChar}${row}`;
        newCells[newCellId] = state.cells[cellId];
        delete newCells[cellId];
      }
    });
    
    setState(prev => ({
      ...prev,
      cells: newCells
    }));
    
    toast({
      title: "Column added",
      description: `A new column has been added at position ${colStr}`
    });
  }, [state.selectedCell, state.cells]);
  
  const handleDeleteColumn = useCallback(() => {
    if (!state.selectedCell) {
      toast({
        title: "Select a cell first",
        description: "Please select a cell to determine which column to delete",
      });
      return;
    }
    
    const colMatch = state.selectedCell.match(/([A-Z]+)/);
    if (!colMatch) return;
    
    const colStr = colMatch[0];
    const colNum = colStr.charCodeAt(0) - 64; // A=1, B=2, etc.
    const newCells = { ...state.cells };
    
    // Remove cells in the current column and shift cells to the right
    Object.keys(state.cells).forEach(cellId => {
      const cellColMatch = cellId.match(/([A-Z]+)(\d+)/);
      if (!cellColMatch) return;
      
      const [_, col, row] = cellColMatch;
      const cellColNum = col.charCodeAt(0) - 64;
      
      if (cellColNum === colNum) {
        delete newCells[cellId];
      } else if (cellColNum > colNum) {
        const newColChar = String.fromCharCode(cellColNum - 1 + 64);
        const newCellId = `${newColChar}${row}`;
        newCells[newCellId] = state.cells[cellId];
        delete newCells[cellId];
      }
    });
    
    setState(prev => ({
      ...prev,
      cells: newCells
    }));
    
    toast({
      title: "Column deleted",
      description: `Column ${colStr} has been deleted`
    });
  }, [state.selectedCell, state.cells]);
  
  const handleSaveSheet = useCallback((name: string) => {
    setState(prev => ({
      ...prev,
      savedSheets: {
        ...prev.savedSheets,
        [Date.now()]: { 
          cells: { ...prev.cells },
          name
        }
      }
    }));
    
    toast({
      title: "Spreadsheet saved",
      description: `"${name}" has been saved`
    });
  }, []);
  
  const handleLoadSheet = useCallback((sheetId: string) => {
    setState(prev => {
      const savedSheet = prev.savedSheets[sheetId];
      if (!savedSheet) return prev;
      
      return {
        ...prev,
        cells: { ...savedSheet.cells }
      };
    });
    
    toast({
      title: "Spreadsheet loaded",
      description: "The selected spreadsheet has been loaded"
    });
  }, []);
  
  const handleFindReplace = useCallback((find: string, replace: string) => {
    if (!find) {
      toast({
        title: "Error",
        description: "Please enter text to find",
        variant: "destructive"
      });
      return;
    }
    
    setState(prev => {
      const newCells = { ...prev.cells };
      let replacementCount = 0;
      
      Object.entries(newCells).forEach(([cellId, cell]) => {
        if (typeof cell.value === 'string' && cell.value.includes(find)) {
          const newValue = cell.value.replace(new RegExp(find, 'g'), replace);
          newCells[cellId] = {
            ...cell,
            value: newValue,
            formatted: cell.formula ? cell.formatted : newValue
          };
          replacementCount++;
        }
      });
      
      if (replacementCount > 0) {
        toast({
          title: "Replacements made",
          description: `Replaced ${replacementCount} occurrences of "${find}" with "${replace}"`
        });
      } else {
        toast({
          title: "No replacements",
          description: `"${find}" was not found in any cell`
        });
      }
      
      // Also update formulas that might reference changed cells
      return recalculateFormulas({
        ...prev,
        cells: newCells
      });
    });
  }, [recalculateFormulas]);
  
  // Handle copy/paste keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Copy: Ctrl+C
      if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        if (state.selectedCell) {
          const cellData = state.cells[state.selectedCell];
          if (cellData) {
            setClipboardData({ [state.selectedCell]: cellData });
            toast({
              title: "Copied",
              description: "Cell content copied to clipboard"
            });
          }
        }
      }
      
      // Paste: Ctrl+V
      if ((e.ctrlKey || e.metaKey) && e.key === 'v') {
        if (state.selectedCell && clipboardData) {
          const targetCellId = state.selectedCell;
          const [[sourceCellId, sourceData]] = Object.entries(clipboardData);
          
          // Handle single cell paste
          if (sourceData) {
            const value = sourceData.formula || sourceData.formatted;
            handleCellChange(targetCellId, value);
            toast({
              title: "Pasted",
              description: "Cell content pasted from clipboard"
            });
          }
        }
      }
      
      // Cut: Ctrl+X
      if ((e.ctrlKey || e.metaKey) && e.key === 'x') {
        if (state.selectedCell) {
          const cellData = state.cells[state.selectedCell];
          if (cellData) {
            setClipboardData({ [state.selectedCell]: cellData });
            handleCellChange(state.selectedCell, '');
            toast({
              title: "Cut",
              description: "Cell content moved to clipboard"
            });
          }
        }
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state.selectedCell, state.cells, clipboardData, handleCellChange]);
  
  // Function to remove duplicates from the selected range
  const handleRemoveDuplicates = useCallback(() => {
    if (!state.selectedRange) {
      toast({
        title: "No range selected",
        description: "Please select a range of cells to remove duplicates"
      });
      return;
    }
    
    // Collect all cells in the range
    const { start, end } = state.selectedRange;
    const rowsData: Array<{ [key: string]: CellData }> = [];
    
    for (let row = start.row; row <= end.row; row++) {
      const rowData: { [key: string]: CellData } = {};
      for (let col = start.col; col <= end.col; col++) {
        const colChar = String.fromCharCode(65 + col);
        const cellId = `${colChar}${row + 1}`;
        rowData[cellId] = state.cells[cellId] || {
          value: '',
          formula: '',
          formatted: '',
          type: 'text',
          style: {}
        };
      }
      rowsData.push(rowData);
    }
    
    // Use our generic removeDuplicates function
    const uniqueRows = removeDuplicates(rowsData);
    
    // Update state with unique rows
    setState(prev => {
      const newCells = { ...prev.cells };
      
      // Clear the range first
      for (let row = start.row; row <= end.row; row++) {
        for (let col = start.col; col <= end.col; col++) {
          const colChar = String.fromCharCode(65 + col);
          const cellId = `${colChar}${row + 1}`;
          delete newCells[cellId];
        }
      }
      
      // Add unique rows back
      uniqueRows.forEach((rowData, index) => {
        const newRowIndex = start.row + index;
        
        Object.entries(rowData).forEach(([cellId, cellData]) => {
          const colMatch = cellId.match(/([A-Z]+)/);
          if (!colMatch) return;
          
          const colChar = colMatch[0];
          const newCellId = `${colChar}${newRowIndex + 1}`;
          newCells[newCellId] = cellData;
        });
      });
      
      toast({
        title: "Duplicates removed",
        description: `Removed ${rowsData.length - uniqueRows.length} duplicate rows`
      });
      
      return {
        ...prev,
        cells: newCells
      };
    });
  }, [state.selectedRange, state.cells]);

  return (
    <div className="h-screen flex flex-col bg-white">
      <Toolbar 
        selectedCell={state.selectedCell}
        onStyleChange={handleStyleChange}
        onAddRow={handleAddRow}
        onDeleteRow={handleDeleteRow}
        onAddColumn={handleAddColumn}
        onDeleteColumn={handleDeleteColumn}
        onSaveSheet={handleSaveSheet}
        onLoadSheet={handleLoadSheet}
        onFindReplace={handleFindReplace}
        onRemoveDuplicates={handleRemoveDuplicates}
        savedSheets={state.savedSheets}
      />
      <FormulaBar 
        value={state.formulaBarValue}
        onChange={handleFormulaBarChange}
        selectedCell={state.selectedCell}
      />
      <Grid 
        state={state}
        onCellChange={handleCellChange}
        onCellSelect={handleCellSelect}
        onRangeSelect={handleRangeSelect}
      />
      <StatusBar selectedRange={rangeStats} />
    </div>
  );
};

export default Index;
