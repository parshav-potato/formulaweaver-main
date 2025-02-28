
# Spreadsheet Formula Documentation

This document provides information about the various formulas available in the spreadsheet application and how to use them.

## Formula Basics

- All formulas start with an equals sign (`=`)
- Cell references can be individual (e.g., `A1`) or ranges (e.g., `A1:A5`)
- Function names are case-insensitive (e.g., `=SUM()` and `=sum()` are equivalent)

## Mathematical Functions

### SUM
Calculates the sum of values in the specified range.

**Syntax**: `=SUM(range)`

**Example**: `=SUM(A1:A5)` - Sum of values in cells A1 through A5

### AVERAGE
Calculates the average (arithmetic mean) of values in the specified range.

**Syntax**: `=AVERAGE(range)`

**Example**: `=AVERAGE(B1:B10)` - Average of values in cells B1 through B10

### MAX
Returns the maximum value from the specified range.

**Syntax**: `=MAX(range)`

**Example**: `=MAX(C1:C20)` - Highest value in cells C1 through C20

### MIN
Returns the minimum value from the specified range.

**Syntax**: `=MIN(range)`

**Example**: `=MIN(D5:D15)` - Lowest value in cells D5 through D15

### COUNT
Counts the number of cells containing numerical values in the specified range.

**Syntax**: `=COUNT(range)`

**Example**: `=COUNT(A1:D10)` - Count of numerical values in the range A1 through D10

### ROUND
Rounds a number to a specified number of decimal places.

**Syntax**: `=ROUND(number, decimals)`

**Example**: `=ROUND(A1, 2)` - Rounds the value in A1 to 2 decimal places

### COUNTIF
Counts the number of cells in a range that match a specific criterion.

**Syntax**: `=COUNTIF(range, criterion)`

**Example**: `=COUNTIF(A1:A10, "Yes")` - Counts how many cells in A1:A10 contain "Yes"

### IF
Returns one value if a condition is true and another value if it's false.

**Syntax**: `=IF(condition, value_if_true, value_if_false)`

**Example**: `=IF(A1>10, "High", "Low")` - Returns "High" if A1 is greater than 10, otherwise "Low"

## Text Functions

### TRIM
Removes leading and trailing spaces from text.

**Syntax**: `=TRIM(text)`

**Example**: `=TRIM(A1)` - Removes extra spaces from the text in cell A1

### UPPER
Converts text to uppercase.

**Syntax**: `=UPPER(text)`

**Example**: `=UPPER(A1)` - Converts the text in cell A1 to uppercase

### LOWER
Converts text to lowercase.

**Syntax**: `=LOWER(text)`

**Example**: `=LOWER(A1)` - Converts the text in cell A1 to lowercase

### CONCATENATE
Joins multiple text values into one.

**Syntax**: `=CONCATENATE(text1, text2, ...)`

**Example**: `=CONCATENATE(A1, " ", B1)` - Joins the values in A1 and B1 with a space between them

## Data Management

### REMOVE_DUPLICATES (Interface Function)
Removes duplicate rows from a selected range. This function is accessed via the toolbar and operates on the currently selected range.

### FIND_AND_REPLACE (Interface Function)
Finds and replaces specific text within the spreadsheet. This function is accessed via the toolbar.

## Formula Tips

1. **Nesting Functions**: You can nest functions within each other. For example: `=SUM(A1:A5, MAX(B1:B5))`

2. **Error Handling**: If a formula cannot be calculated, it will display an error code:
   - `#ERROR!`: General formula error
   - `#NAME?`: Unknown function name
   - `#DIV/0!`: Division by zero
   - `#NaN`: Not a number
   - `#INF`: Infinite result

3. **Cell Dependencies**: Formulas will automatically update when any referenced cell changes

4. **Cell References**:
   - Relative: `A1` (changes when formula is copied)
   - Absolute: `$A$1` (does not change when formula is copied)
   - Mixed: `$A1` or `A$1` (one part fixed, one part relative)

5. **Cell Range Notation**:
   - Contiguous range: `A1:C3`
   - Non-contiguous range: `A1,B2,C3`
