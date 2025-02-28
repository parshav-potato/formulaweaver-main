
import { CellData, SpreadsheetState } from '@/types/spreadsheet';
import { formulaFunctions, parseRange } from './formulaFunctions';

const getCellValue = (cellId: string, state: SpreadsheetState): any => {
  const cell = state.cells[cellId];
  if (!cell) return null;
  if (cell.type === 'number') return Number(cell.value);
  return cell.value;
};

export const evaluateFormula = (formula: string, state: SpreadsheetState): number | string => {
  if (!formula.startsWith('=')) {
    return formula;
  }

  const expression = formula.substring(1).trim().toUpperCase();
  
  // Handle function calls
  const functionMatch = expression.match(/^([A-Z_]+)\((.*)\)$/);
  if (functionMatch) {
    const [_, functionName, argsString] = functionMatch;
    const func = formulaFunctions[functionName];
    
    if (!func) {
      return '#NAME?';
    }

    // Parse arguments
    const args = argsString.split(',').map(arg => {
      arg = arg.trim();
      if (arg.includes(':')) {
        // Handle range
        const rangeCells = parseRange(arg);
        return rangeCells.map(cell => getCellValue(cell, state));
      } else if (arg.match(/^[A-Z]+\d+$/)) {
        // Handle cell reference
        return getCellValue(arg, state);
      } else if (!isNaN(Number(arg))) {
        // Handle numeric literal
        return Number(arg);
      } else if (arg.startsWith('"') && arg.endsWith('"')) {
        // Handle string literal
        return arg.substring(1, arg.length - 1);
      }
      // Handle other literals
      return arg;
    }).flat();

    try {
      return func(args, state);
    } catch (e) {
      console.error("Formula evaluation error:", e);
      return '#ERROR!';
    }
  }

  // Handle basic arithmetic
  try {
    if (expression.match(/^[\d\s+\-*/().]+$/)) {
      // Replace cell references with values
      const cellRefs = expression.match(/[A-Z]+\d+/g) || [];
      let evalExpression = expression;
      
      cellRefs.forEach(cellRef => {
        const value = getCellValue(cellRef, state);
        evalExpression = evalExpression.replace(
          new RegExp(cellRef, 'g'), 
          value === null ? '0' : value.toString()
        );
      });
      
      // eslint-disable-next-line no-eval
      return eval(evalExpression);
    }
  } catch (e) {
    console.error("Arithmetic evaluation error:", e);
    return '#ERROR!';
  }

  return '#NOT_IMPLEMENTED';
};

export const formatCellValue = (value: string | number): string => {
  if (typeof value === 'number') {
    // Handle different number formatting here
    if (isNaN(value)) return '#NaN';
    if (!isFinite(value)) return value > 0 ? '#INF' : '#-INF';
    
    // Format with commas for thousands and limit decimal places
    return value.toLocaleString(undefined, {
      maximumFractionDigits: 10
    });
  }
  return value;
};

export const getCellContent = (cell: CellData | undefined): string => {
  if (!cell) return '';
  return cell.formula || cell.formatted;
};
