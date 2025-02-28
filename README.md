
# Spreadsheet Application - Google Sheets Clone

## Application Overview

This web application is a Google Sheets clone built with React, TypeScript, and Tailwind CSS. It aims to provide a comprehensive spreadsheet experience with support for mathematical functions, data quality functions, drag functionality, and cell dependencies.

## Features

### 1. Spreadsheet Interface
- **Google Sheets-like UI**: The interface closely resembles Google Sheets with a toolbar, formula bar, and cell structure
- **Drag Functionality**: Support for dragging to select cell ranges
- **Cell Dependencies**: Formulas automatically update when referenced cells change
- **Cell Formatting**: Support for text formatting (bold, italics, font size, color)
- **Row and Column Management**: Add, delete, and resize rows and columns

### 2. Mathematical Functions
- **SUM**: Calculates the sum of a range of cells
- **AVERAGE**: Calculates the average of a range of cells
- **MAX**: Returns the maximum value from a range of cells
- **MIN**: Returns the minimum value from a range of cells
- **COUNT**: Counts the number of cells containing numerical values in a range
- **ROUND**: Rounds numbers to a specified number of decimal places
- **Additional Functions**: COUNTIF, IF, etc.

### 3. Data Quality Functions
- **TRIM**: Removes leading and trailing whitespace from a cell
- **UPPER**: Converts the text in a cell to uppercase
- **LOWER**: Converts the text in a cell to lowercase
- **REMOVE_DUPLICATES**: Removes duplicate rows from a selected range
- **FIND_AND_REPLACE**: Finds and replaces specific text within a range of cells

### 4. Data Entry and Validation
- **Support for Multiple Data Types**: Enter numbers, text, formulas
- **Formula Recognition**: Automatically detects and evaluates formulas starting with "="
- **Visual Feedback**: Different colors for different data types (blue for formulas, green for numbers)

### 5. Save and Load Functionality
- **Save Spreadsheets**: Save the current state with a custom name
- **Load Spreadsheets**: Load previously saved spreadsheets

## Technical Implementation

### Data Structure

The application uses a structured data model to efficiently manage the spreadsheet state:

```typescript
interface SpreadsheetState {
  cells: { [key: string]: CellData }; // Map of cell ID to cell data
  selectedCell: string | null; // Currently selected cell
  formulaBarValue: string; // Current value in the formula bar
  columnWidths: { [key: string]: number }; // Column width customizations
  rowHeights: { [key: string]: number }; // Row height customizations
  savedSheets: { [key: string]: { cells: { [key: string]: CellData }, name: string } }; // Saved sheets
  selectedRange: CellRange | null; // Currently selected range
}

interface CellData {
  value: string | number | null; // Raw cell value
  formula: string; // Formula if the cell contains one
  formatted: string; // Formatted display value
  type: 'text' | 'number' | 'formula' | 'date'; // Cell data type
  style?: {
    bold?: boolean;
    italic?: boolean;
    fontSize?: number;
    color?: string;
    align?: 'left' | 'center' | 'right';
    backgroundColor?: string;
  }; // Cell styling
}
```

### Component Architecture

The application follows a clean component architecture for maintainability:

1. **Grid Component**: Renders the spreadsheet grid and handles cell selection/navigation
2. **Cell Component**: Renders individual cells and handles cell editing
3. **Toolbar Component**: Contains formatting options and tools
4. **FormulaBar Component**: Displays and edits the current cell formula
5. **StatusBar Component**: Shows statistics about the selected range

### Formula Evaluation

Formulas are parsed and evaluated in real-time:

1. Formulas start with "=" (e.g., "=SUM(A1:A5)")
2. Cell references can be individual (A1) or ranges (A1:A5)
3. Formula results are cached for performance
4. When dependent cells change, formulas are recalculated

### Drag and Selection Operation

The application supports Google Sheets-like drag operations:

1. Click on a cell to select it
2. Click and drag to select a range of cells
3. Visual feedback during dragging with a blue highlight
4. Double-click to edit a cell
5. Cut, copy, and paste functionality with keyboard shortcuts

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm or yarn

### Installation and Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/spreadsheet-app.git
   cd spreadsheet-app
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and visit:
   ```
   http://localhost:5173
   ```

### Building for Production

1. Create a production build:
   ```bash
   npm run build
   # or
   yarn build
   ```

2. Preview the production build locally:
   ```bash
   npm run preview
   # or
   yarn preview
   ```

### Deployment Options

#### Option 1: GitHub Pages

1. Update the `vite.config.ts` file to include your repository name:
   ```typescript
   export default defineConfig({
     base: '/spreadsheet-app/', // Replace with your repo name
     // ... rest of your config
   })
   ```

2. Create a deploy script in `package.json`:
   ```json
   "scripts": {
     "deploy": "gh-pages -d dist"
   }
   ```

3. Install the gh-pages package:
   ```bash
   npm install --save-dev gh-pages
   # or
   yarn add --dev gh-pages
   ```

4. Build and deploy:
   ```bash
   npm run build && npm run deploy
   # or
   yarn build && yarn deploy
   ```

#### Option 2: Netlify/Vercel

1. Create an account on [Netlify](https://www.netlify.com/) or [Vercel](https://vercel.com/)
2. Connect your GitHub repository
3. Configure the build settings:
   - Build command: `npm run build` or `yarn build`
   - Publish directory: `dist`
4. Deploy

## Technical Stack

- **React**: UI framework
- **TypeScript**: Type safety
- **Tailwind CSS**: Styling
- **Shadcn UI**: Component library for UI elements

## Performance Considerations

1. **Virtual Rendering**: Only visible cells are rendered for memory efficiency
2. **Memoization**: Component re-renders are minimized using React hooks
3. **Efficient Updates**: Only affected cells are updated when formulas change

## Future Enhancements

1. Collaboration features
2. Import/export from CSV and Excel
3. Advanced charting capabilities
4. Mobile-responsive design
5. Undo/redo functionality
6. Custom formula creation

## Author

**Parshav Jain**

## License

This project is licensed under the MIT License.
