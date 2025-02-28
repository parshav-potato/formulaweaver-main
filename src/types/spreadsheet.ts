
export type CellValue = string | number | null;

export interface CellData {
  value: CellValue;
  formula: string;
  formatted: string;
  type: 'text' | 'number' | 'formula' | 'date';
  style?: {
    bold?: boolean;
    italic?: boolean;
    fontSize?: number;
    color?: string;
    align?: 'left' | 'center' | 'right';
    backgroundColor?: string;
  };
}

export interface SpreadsheetState {
  cells: { [key: string]: CellData };
  selectedCell: string | null;
  formulaBarValue: string;
  columnWidths: { [key: string]: number };
  rowHeights: { [key: string]: number };
  savedSheets: { [key: string]: { cells: { [key: string]: CellData }, name: string } };
  selectedRange: CellRange | null;
}

export type CellPosition = {
  col: number;
  row: number;
};

export type CellRange = {
  start: CellPosition;
  end: CellPosition;
};

export type FormulaFunction = (args: CellValue[], state: SpreadsheetState) => CellValue;
