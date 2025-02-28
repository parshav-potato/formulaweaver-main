
import { SpreadsheetState, CellValue, CellData } from '@/types/spreadsheet';

// Helper to get numeric values only
const getNumericValues = (values: CellValue[]): number[] => {
  return values.filter((v): v is number => typeof v === 'number');
};

export const formulaFunctions: { [key: string]: (args: CellValue[], state: SpreadsheetState) => CellValue } = {
  SUM: (args, _) => {
    const numbers = getNumericValues(args);
    return numbers.reduce((sum, num) => sum + num, 0);
  },

  AVERAGE: (args, _) => {
    const numbers = getNumericValues(args);
    return numbers.length ? numbers.reduce((sum, num) => sum + num, 0) / numbers.length : 0;
  },

  MAX: (args, _) => {
    const numbers = getNumericValues(args);
    return numbers.length ? Math.max(...numbers) : 0;
  },

  MIN: (args, _) => {
    const numbers = getNumericValues(args);
    return numbers.length ? Math.min(...numbers) : 0;
  },

  COUNT: (args, _) => {
    return getNumericValues(args).length;
  },

  TRIM: (args, _) => {
    return typeof args[0] === 'string' ? args[0].trim() : args[0];
  },

  UPPER: (args, _) => {
    return typeof args[0] === 'string' ? args[0].toUpperCase() : args[0];
  },

  LOWER: (args, _) => {
    return typeof args[0] === 'string' ? args[0].toLowerCase() : args[0];
  },
  
  CONCATENATE: (args, _) => {
    return args.map(arg => arg?.toString() || '').join('');
  },

  IF: (args, _) => {
    // IF(condition, value_if_true, value_if_false)
    if (args.length < 3) return '#ERROR!';
    return args[0] ? args[1] : args[2];
  },

  COUNTIF: (args, state) => {
    if (args.length < 2) return '#ERROR!';
    const condition = args[args.length - 1];
    const values = args.slice(0, args.length - 1);
    
    return values.filter(value => value === condition).length;
  },
  
  ROUND: (args, _) => {
    if (args.length < 1) return '#ERROR!';
    const num = typeof args[0] === 'number' ? args[0] : 0;
    const decimals = args.length > 1 && typeof args[1] === 'number' ? args[1] : 0;
    const factor = Math.pow(10, decimals);
    return Math.round(num * factor) / factor;
  }
};

export const parseRange = (range: string): string[] => {
  const [start, end] = range.split(':').map(cell => cell.trim());
  if (!end) return [start];

  const startCol = start.match(/[A-Z]+/)?.[0] ?? '';
  const startRow = parseInt(start.match(/\d+/)?.[0] ?? '0');
  const endCol = end.match(/[A-Z]+/)?.[0] ?? '';
  const endRow = parseInt(end.match(/\d+/)?.[0] ?? '0');

  const startColNum = startCol.split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0);
  const endColNum = endCol.split('').reduce((acc, char) => acc * 26 + char.charCodeAt(0) - 64, 0);

  const cells: string[] = [];
  for (let col = startColNum; col <= endColNum; col++) {
    for (let row = startRow; row <= endRow; row++) {
      const colStr = String.fromCharCode(64 + col);
      cells.push(`${colStr}${row}`);
    }
  }

  return cells;
};

// Find and replace function for ranges
export const findAndReplace = (cells: { [key: string]: CellValue }, find: string, replace: string): { [key: string]: CellValue } => {
  const newCells: { [key: string]: CellValue } = {};
  
  Object.entries(cells).forEach(([cellId, value]) => {
    if (typeof value === 'string' && value.includes(find)) {
      newCells[cellId] = value.replace(new RegExp(find, 'g'), replace);
    } else {
      newCells[cellId] = value;
    }
  });
  
  return newCells;
};

// Remove duplicates from a range - modified to work with the correct types
export const removeDuplicates = <T>(rows: T[]): T[] => {
  const uniqueRows = new Map<string, T>();
  
  rows.forEach(row => {
    const key = JSON.stringify(row);
    if (!uniqueRows.has(key)) {
      uniqueRows.set(key, row);
    }
  });
  
  return Array.from(uniqueRows.values());
};
