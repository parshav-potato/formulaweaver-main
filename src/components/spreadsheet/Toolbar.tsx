
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Bold, Italic, AlignLeft, AlignCenter, AlignRight, 
  Save, FileDown, Plus, Trash2, Filter,
  Search, ChevronDown, X
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/components/ui/use-toast";

interface ToolbarProps {
  selectedCell: string | null;
  onStyleChange: (cellId: string, style: Partial<{
    bold?: boolean;
    italic?: boolean;
    align?: 'left' | 'center' | 'right';
    color?: string;
    backgroundColor?: string;
  }>) => void;
  onAddRow?: () => void;
  onDeleteRow?: () => void;
  onAddColumn?: () => void;
  onDeleteColumn?: () => void;
  onSaveSheet?: (name: string) => void;
  onLoadSheet?: (name: string) => void;
  onFindReplace?: (find: string, replace: string) => void;
  onRemoveDuplicates?: () => void;
  savedSheets?: { [key: string]: { name: string } };
}

export const Toolbar = ({ 
  selectedCell, 
  onStyleChange,
  onAddRow,
  onDeleteRow,
  onAddColumn,
  onDeleteColumn,
  onSaveSheet,
  onLoadSheet,
  onFindReplace,
  onRemoveDuplicates,
  savedSheets = {}
}: ToolbarProps) => {
  const [sheetName, setSheetName] = useState('Untitled Sheet');
  const [findText, setFindText] = useState('');
  const [replaceText, setReplaceText] = useState('');
  const [showFindReplace, setShowFindReplace] = useState(false);

  const handleStyleClick = (style: Parameters<ToolbarProps['onStyleChange']>[1]) => {
    if (selectedCell) {
      onStyleChange(selectedCell, style);
    } else {
      toast({
        title: "No cell selected",
        description: "Please select a cell to apply formatting"
      });
    }
  };

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedCell) {
      onStyleChange(selectedCell, { color: e.target.value });
    }
  };

  const handleBgColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (selectedCell) {
      onStyleChange(selectedCell, { backgroundColor: e.target.value });
    }
  };

  const handleSave = () => {
    onSaveSheet?.(sheetName);
  };

  const handleFindReplace = () => {
    onFindReplace?.(findText, replaceText);
  };

  // Prevent propagation of keyboard events from find/replace inputs
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="border-b border-sheet-border bg-white">
      {/* Main Toolbar */}
      <div className="h-[44px] flex items-center px-4 space-x-2 overflow-x-auto">
        {/* File Operations */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-1">
              File
              <ChevronDown className="h-3 w-3" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-56">
            <Popover>
              <PopoverTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </DropdownMenuItem>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="start">
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium leading-none">Save Spreadsheet</h4>
                    <p className="text-sm text-muted-foreground">Enter a name for your spreadsheet</p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="sheet-name">Name</Label>
                    <Input 
                      id="sheet-name" 
                      value={sheetName} 
                      onChange={(e) => setSheetName(e.target.value)} 
                      onKeyDown={handleInputKeyDown}
                    />
                    <Button onClick={handleSave}>Save</Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                  <FileDown className="mr-2 h-4 w-4" />
                  Open
                  <ChevronDown className="ml-auto h-3 w-3" />
                </DropdownMenuItem>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-56">
                {Object.entries(savedSheets).length > 0 ? (
                  Object.entries(savedSheets).map(([id, sheet]) => (
                    <DropdownMenuItem key={id} onClick={() => onLoadSheet?.(id)}>
                      {sheet.name}
                    </DropdownMenuItem>
                  ))
                ) : (
                  <DropdownMenuItem disabled>No saved sheets</DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-6" />
        
        {/* Text Formatting */}
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8"
            onClick={() => handleStyleClick({ bold: true })}
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8"
            onClick={() => handleStyleClick({ italic: true })}
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </Button>
          
          {/* Color Picker */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className="w-8 h-8 relative" title="Text & Background Color">
                <div className="w-4 h-4 rounded" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #10b981 100%)' }} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-4" align="start">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="text-color">Text Color</Label>
                  <Input 
                    id="text-color" 
                    type="color" 
                    onChange={handleColorChange} 
                    className="w-32 h-8"
                    onKeyDown={handleInputKeyDown}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bg-color">Background Color</Label>
                  <Input 
                    id="bg-color" 
                    type="color" 
                    onChange={handleBgColorChange} 
                    className="w-32 h-8"
                    onKeyDown={handleInputKeyDown}
                  />
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>

        <Separator orientation="vertical" className="h-6" />
        
        {/* Alignment */}
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8"
            onClick={() => handleStyleClick({ align: 'left' })}
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8"
            onClick={() => handleStyleClick({ align: 'center' })}
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-8 h-8"
            onClick={() => handleStyleClick({ align: 'right' })}
            title="Align Right"
          >
            <AlignRight className="h-4 w-4" />
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />
        
        {/* Data Tools */}
        <div className="flex items-center space-x-1">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={() => setShowFindReplace(prev => !prev)}
            className="flex items-center space-x-1"
            title="Find & Replace"
          >
            <Search className="h-4 w-4 mr-1" />
            Find
          </Button>

          <Button 
            variant="ghost" 
            size="sm"
            onClick={onRemoveDuplicates}
            className="flex items-center space-x-1"
            title="Remove Duplicates"
          >
            <Filter className="h-4 w-4 mr-1" />
            Remove Duplicates
          </Button>
        </div>

        <Separator orientation="vertical" className="h-6" />
        
        {/* Row/Column Operations */}
        <div className="flex items-center gap-1">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center space-x-1"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem onClick={onAddRow}>
                Add Row
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onAddColumn}>
                Add Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center space-x-1"
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Delete
                <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40">
              <DropdownMenuItem onClick={onDeleteRow}>
                Delete Row
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDeleteColumn}>
                Delete Column
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {/* Find and Replace Bar */}
      {showFindReplace && (
        <div className="h-[44px] flex items-center px-4 space-x-3 border-t border-sheet-border bg-gray-50 relative">
          <Button 
            variant="ghost" 
            size="icon" 
            className="w-6 h-6 absolute right-2 top-2"
            onClick={() => setShowFindReplace(false)}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <Tabs defaultValue="find" className="w-full">
            <TabsList className="grid grid-cols-2 w-64">
              <TabsTrigger value="find">Find</TabsTrigger>
              <TabsTrigger value="replace">Find & Replace</TabsTrigger>
            </TabsList>
            <div className="flex items-center space-x-2 mt-2">
              <TabsContent value="find" className="flex items-center space-x-2 mt-0">
                <Search className="h-4 w-4" />
                <Input 
                  placeholder="Find text..." 
                  value={findText}
                  onChange={(e) => setFindText(e.target.value)}
                  className="w-48 h-8"
                  onKeyDown={handleInputKeyDown}
                  onClick={(e) => e.stopPropagation()}
                />
                <Button variant="secondary" size="sm">Find Next</Button>
              </TabsContent>
              <TabsContent value="replace" className="flex items-center space-x-2 mt-0">
                <div className="flex items-center space-x-2">
                  <Input 
                    placeholder="Find text..." 
                    value={findText}
                    onChange={(e) => setFindText(e.target.value)}
                    className="w-48 h-8"
                    onKeyDown={handleInputKeyDown}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Input 
                    placeholder="Replace with..." 
                    value={replaceText}
                    onChange={(e) => setReplaceText(e.target.value)}
                    className="w-48 h-8"
                    onKeyDown={handleInputKeyDown}
                    onClick={(e) => e.stopPropagation()}
                  />
                  <Button variant="secondary" size="sm" onClick={handleFindReplace}>Replace All</Button>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      )}
    </div>
  );
};

export default Toolbar;
