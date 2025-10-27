/**
 * MenuBlock Sidebar Settings Component
 * Comprehensive settings panel for menu customization
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Plus,
  Copy,
  Trash2,
  GripVertical,
  ChevronDown,
  ChevronRight,
  Upload,
  Download,
  Save,
  Eye,
  FileJson,
  FileCode,
  Image as ImageIcon,
  AlertCircle,
  Check,
  Flame
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Card } from '@/components/ui/card';
import { 
  getAllPresets, 
  applyPreset, 
  FONT_FAMILIES, 
  CURRENCIES, 
  LOCALES 
} from './presets';
import { ALL_ICONS, getIcon } from './icons.jsx';
import { exportAsJSON, exportAsHTML } from './MenuBlock';

/**
 * Collapsible Section Component
 */
const Section = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger className="flex items-center justify-between w-full py-3 px-4 hover:bg-muted/50 transition-colors">
        <h3 className="font-semibold text-sm">{title}</h3>
        {isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="px-4 pb-4">
          {children}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
};

/**
 * Main MenuBlock Sidebar Component
 */
export const MenuBlockSidebar = ({ menuData, onUpdate, onClose }) => {
  const [addingItem, setAddingItem] = useState(false);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: 0,
    tag: 'veg',
    icon: 'leaf',
    spicy: false,
    image: ''
  });

  // Safety check: Ensure menuData has required structure
  if (!menuData || !menuData.layout || !menuData.styles || !menuData.items || !menuData.settings) {
    return (
      <div className="flex items-center justify-center h-full p-8 text-center">
        <div>
          <p className="text-muted-foreground mb-2">Invalid menu data</p>
          <Button onClick={onClose} variant="outline" size="sm">
            Close
          </Button>
        </div>
      </div>
    );
  }

  // Update menu data helper
  const updateData = (path, value) => {
    const keys = path.split('.');
    const newData = JSON.parse(JSON.stringify(menuData));
    
    let current = newData;
    for (let i = 0; i < keys.length - 1; i++) {
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    
    onUpdate(newData);
  };

  // Add new item
  const handleAddItem = () => {
    if (!newItem.name || !newItem.price) return;
    
    const item = {
      ...newItem,
      id: `item-${Date.now()}`,
      price: parseFloat(newItem.price)
    };
    
    onUpdate({
      ...menuData,
      items: [...menuData.items, item]
    });
    
    setNewItem({
      name: '',
      description: '',
      price: 0,
      tag: 'veg',
      icon: 'leaf',
      spicy: false,
      image: ''
    });
    setAddingItem(false);
  };

  // Delete item
  const handleDeleteItem = (itemId) => {
    onUpdate({
      ...menuData,
      items: menuData.items.filter(item => item.id !== itemId)
    });
  };

  // Duplicate item
  const handleDuplicateItem = (item) => {
    const duplicated = {
      ...item,
      id: `item-${Date.now()}`,
      name: `${item.name} (Copy)`
    };
    
    onUpdate({
      ...menuData,
      items: [...menuData.items, duplicated]
    });
  };

  // Update item
  const handleUpdateItem = (itemId, field, value) => {
    onUpdate({
      ...menuData,
      items: menuData.items.map(item => 
        item.id === itemId ? { ...item, [field]: value } : item
      )
    });
  };

  // Apply preset
  const handleApplyPreset = (presetName) => {
    const newData = applyPreset(menuData, presetName);
    onUpdate(newData);
  };

  // CSV Import
  const handleCSVImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target.result;
      const lines = text.split('\n');
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const newItems = lines.slice(1)
        .filter(line => line.trim())
        .map((line, index) => {
          const values = line.split(',').map(v => v.trim());
          const item = {
            id: `item-csv-${Date.now()}-${index}`,
            name: '',
            description: '',
            price: 0,
            tag: 'veg',
            icon: 'leaf',
            spicy: false
          };
          
          headers.forEach((header, i) => {
            if (header === 'name') item.name = values[i];
            else if (header === 'description') item.description = values[i];
            else if (header === 'price') item.price = parseFloat(values[i]) || 0;
            else if (header === 'tag') item.tag = values[i] || 'veg';
          });
          
          return item;
        })
        .filter(item => item.name && item.price > 0);
      
      onUpdate({
        ...menuData,
        items: [...menuData.items, ...newItems]
      });
    };
    
    reader.readAsText(file);
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
        <h3 className="font-semibold text-base">Menu Settings</h3>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Content */}
      <ScrollArea className="flex-1">
        <div className="space-y-0">
          
          {/* LAYOUT SECTION */}
          <Section title="Layout" defaultOpen={true}>
            <div className="space-y-4">
              <div>
                <Label className="text-xs">Columns</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {[1, 2, 3].map(col => (
                    <Button
                      key={col}
                      variant={menuData.layout.columns === col ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateData('layout.columns', col)}
                      className="w-full"
                    >
                      {col} Col
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-xs">Padding: {menuData.layout.padding}px</Label>
                <Slider
                  value={[menuData.layout.padding]}
                  onValueChange={([value]) => updateData('layout.padding', value)}
                  min={0}
                  max={100}
                  step={4}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-xs">Gap: {menuData.layout.gap}px</Label>
                <Slider
                  value={[menuData.layout.gap]}
                  onValueChange={([value]) => updateData('layout.gap', value)}
                  min={0}
                  max={50}
                  step={2}
                  className="mt-2"
                />
              </div>
            </div>
          </Section>

          <Separator />

          {/* PRESETS SECTION */}
          <Section title="Presets">
            <div className="grid grid-cols-2 gap-3">
              {getAllPresets().map(preset => (
                <Card
                  key={preset.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    menuData.meta.preset === preset.id ? 'ring-2 ring-primary' : ''
                  }`}
                  onClick={() => handleApplyPreset(preset.id)}
                >
                  <div className="aspect-video relative overflow-hidden rounded-t-lg">
                    <img 
                      src={preset.thumbnail} 
                      alt={preset.name}
                      className="w-full h-full object-cover"
                    />
                    {menuData.meta.preset === preset.id && (
                      <div className="absolute top-1 right-1 bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="h-3 w-3" />
                      </div>
                    )}
                  </div>
                  <div className="p-2">
                    <p className="font-semibold text-xs">{preset.name}</p>
                    <p className="text-xs text-muted-foreground line-clamp-1">{preset.description}</p>
                  </div>
                </Card>
              ))}
            </div>
            
            <Button variant="outline" size="sm" className="w-full mt-3">
              <Save className="h-3 w-3 mr-2" />
              Save as Custom Preset
            </Button>
          </Section>

          <Separator />

          {/* BACKGROUND SECTION */}
          <Section title="Background">
            <div className="space-y-4">
              <div>
                <Label className="text-xs">Type</Label>
                <Select 
                  value={menuData.styles.background.type}
                  onValueChange={(value) => updateData('styles.background.type', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="color">Color</SelectItem>
                    <SelectItem value="gradient">Gradient</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {menuData.styles.background.type === 'color' && (
                <div>
                  <Label className="text-xs">Color</Label>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="color"
                      value={menuData.styles.background.value}
                      onChange={(e) => updateData('styles.background.value', e.target.value)}
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={menuData.styles.background.value}
                      onChange={(e) => updateData('styles.background.value', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              )}

              {menuData.styles.background.type === 'gradient' && (
                <div>
                  <Label className="text-xs">Gradient CSS</Label>
                  <Textarea
                    value={menuData.styles.background.value}
                    onChange={(e) => updateData('styles.background.value', e.target.value)}
                    placeholder="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                    rows={3}
                    className="mt-2 font-mono text-xs"
                  />
                </div>
              )}

              {menuData.styles.background.type === 'image' && (
                <div>
                  <Label className="text-xs">Image URL</Label>
                  <Input
                    value={menuData.styles.background.value}
                    onChange={(e) => updateData('styles.background.value', e.target.value)}
                    placeholder="https://..."
                    className="mt-2"
                  />
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    <Upload className="h-3 w-3 mr-2" />
                    Upload Image
                  </Button>
                </div>
              )}
            </div>
          </Section>

          <Separator />

          {/* TYPOGRAPHY SECTION */}
          <Section title="Typography">
            <div className="space-y-4">
              <div>
                <Label className="text-xs">Font Family</Label>
                <Select 
                  value={menuData.styles.font.family}
                  onValueChange={(value) => updateData('styles.font.family', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FONT_FAMILIES.map(font => (
                      <SelectItem key={font.value} value={font.value}>
                        {font.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Headline Size</Label>
                  <Input
                    type="number"
                    value={menuData.styles.font.headlineSize}
                    onChange={(e) => updateData('styles.font.headlineSize', parseInt(e.target.value))}
                    min={12}
                    max={120}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label className="text-xs">Body Size</Label>
                  <Input
                    type="number"
                    value={menuData.styles.font.bodySize}
                    onChange={(e) => updateData('styles.font.bodySize', parseInt(e.target.value))}
                    min={10}
                    max={80}
                    className="mt-2"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs">Weight</Label>
                <Select 
                  value={menuData.styles.font.weight}
                  onValueChange={(value) => updateData('styles.font.weight', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="300">Light (300)</SelectItem>
                    <SelectItem value="400">Regular (400)</SelectItem>
                    <SelectItem value="500">Medium (500)</SelectItem>
                    <SelectItem value="600">Semibold (600)</SelectItem>
                    <SelectItem value="700">Bold (700)</SelectItem>
                    <SelectItem value="800">Extra Bold (800)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <div>
                  <Label className="text-xs">Headline Color</Label>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="color"
                      value={menuData.styles.font.headlineColor || '#000000'}
                      onChange={(e) => updateData('styles.font.headlineColor', e.target.value)}
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={menuData.styles.font.headlineColor || '#000000'}
                      onChange={(e) => updateData('styles.font.headlineColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Body Color</Label>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="color"
                      value={menuData.styles.font.bodyColor || '#666666'}
                      onChange={(e) => updateData('styles.font.bodyColor', e.target.value)}
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={menuData.styles.font.bodyColor || '#666666'}
                      onChange={(e) => updateData('styles.font.bodyColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label className="text-xs">Price Color</Label>
                  <div className="flex gap-2 mt-2">
                    <input
                      type="color"
                      value={menuData.styles.font.priceColor || menuData.styles.accentColor}
                      onChange={(e) => updateData('styles.font.priceColor', e.target.value)}
                      className="w-12 h-10 rounded border cursor-pointer"
                    />
                    <Input
                      value={menuData.styles.font.priceColor || menuData.styles.accentColor}
                      onChange={(e) => updateData('styles.font.priceColor', e.target.value)}
                      className="flex-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Separator />

          {/* PRICE & CURRENCY SECTION */}
          <Section title="Price & Currency">
            <div className="space-y-4">
              <div>
                <Label className="text-xs">Currency</Label>
                <Select 
                  value={menuData.styles.currency}
                  onValueChange={(value) => updateData('styles.currency', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CURRENCIES.map(curr => (
                      <SelectItem key={curr.code} value={curr.value}>
                        {curr.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-xs">Decimals</Label>
                <RadioGroup 
                  value={menuData.settings.priceDecimals.toString()}
                  onValueChange={(value) => updateData('settings.priceDecimals', parseInt(value))}
                  className="flex gap-4 mt-2"
                >
                  {[0, 1, 2].map(dec => (
                    <div key={dec} className="flex items-center space-x-2">
                      <RadioGroupItem value={dec.toString()} id={`dec-${dec}`} />
                      <Label htmlFor={`dec-${dec}`} className="text-xs">{dec}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label className="text-xs">Position</Label>
                <RadioGroup 
                  value={menuData.settings.currencyPosition}
                  onValueChange={(value) => updateData('settings.currencyPosition', value)}
                  className="flex gap-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="before" id="pos-before" />
                    <Label htmlFor="pos-before" className="text-xs">Before (₹199)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="after" id="pos-after" />
                    <Label htmlFor="pos-after" className="text-xs">After (199₹)</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label className="text-xs">Price Alignment</Label>
                <Select 
                  value={menuData.styles.priceAlign}
                  onValueChange={(value) => updateData('styles.priceAlign', value)}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Section>

          <Separator />

          {/* ITEM CONTROLS SECTION */}
          <Section title="Menu Items" defaultOpen={true}>
            <div className="space-y-4">
              {/* Items List */}
              <div className="space-y-2">
                {menuData.items.map((item, index) => (
                  <Card key={item.id} className="p-3">
                    <div className="flex items-start gap-2">
                      <GripVertical className="h-4 w-4 text-muted-foreground mt-1 cursor-move" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-sm">{item.name}</p>
                          {item.tag === 'veg' && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700">Veg</Badge>
                          )}
                          {item.tag === 'nonveg' && (
                            <Badge variant="outline" className="text-xs bg-red-50 text-red-700">Non-veg</Badge>
                          )}
                          {item.spicy && (
                            <Flame className="h-3 w-3 text-orange-500" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                        <p className="text-sm font-bold mt-1">
                          {menuData.styles.currency}{item.price}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0"
                                onClick={() => handleDuplicateItem(item)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Duplicate</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                        
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 w-7 p-0 text-destructive"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Delete</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Add Item Form */}
              {addingItem ? (
                <Card className="p-3">
                  <div className="space-y-3">
                    <div>
                      <Label className="text-xs">Name *</Label>
                      <Input
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        placeholder="Item name"
                        className="mt-1"
                      />
                    </div>
                    
                    <div>
                      <Label className="text-xs">Description</Label>
                      <Textarea
                        value={newItem.description}
                        onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                        placeholder="Brief description"
                        rows={2}
                        className="mt-1"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Price *</Label>
                        <Input
                          type="number"
                          value={newItem.price}
                          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                          min={0}
                          step={0.01}
                          className="mt-1"
                        />
                      </div>
                      
                      <div>
                        <Label className="text-xs">Tag</Label>
                        <Select 
                          value={newItem.tag}
                          onValueChange={(value) => setNewItem({ ...newItem, tag: value })}
                        >
                          <SelectTrigger className="mt-1">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="veg">Veg</SelectItem>
                            <SelectItem value="nonveg">Non-veg</SelectItem>
                            <SelectItem value="contains-nuts">Contains Nuts</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newItem.spicy}
                        onCheckedChange={(checked) => setNewItem({ ...newItem, spicy: checked })}
                        id="spicy"
                      />
                      <Label htmlFor="spicy" className="text-xs">
                        <Flame className="h-3 w-3 inline mr-1" />
                        Spicy
                      </Label>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleAddItem} className="flex-1">
                        <Check className="h-3 w-3 mr-1" />
                        Add
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setAddingItem(false)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </Card>
              ) : (
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="w-full"
                  onClick={() => setAddingItem(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              )}

              {/* CSV Import */}
              <div>
                <Label htmlFor="csv-import" className="text-xs cursor-pointer">
                  <Button variant="outline" size="sm" className="w-full" asChild>
                    <span>
                      <Upload className="h-3 w-3 mr-2" />
                      Import from CSV
                    </span>
                  </Button>
                </Label>
                <input
                  id="csv-import"
                  type="file"
                  accept=".csv"
                  onChange={handleCSVImport}
                  className="hidden"
                />
              </div>
            </div>
          </Section>

          <Separator />

          {/* ICONS & TAGGING SECTION */}
          <Section title="Icons & Badges">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Show Icons</Label>
                <Switch
                  checked={menuData.settings.showIcons}
                  onCheckedChange={(checked) => updateData('settings.showIcons', checked)}
                />
              </div>

              {menuData.settings.showIcons && (
                <div>
                  <Label className="text-xs mb-2 block">Icon Library</Label>
                  <div className="grid grid-cols-4 gap-2">
                    {ALL_ICONS.slice(0, 12).map(icon => (
                      <TooltipProvider key={icon.id}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-10 w-10 p-0"
                            >
                              {getIcon(icon.id, { className: "w-5 h-5" })}
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>{icon.name}</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </Section>

          <Separator />

          {/* DIVIDERS SECTION */}
          <Section title="Dividers">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Show Dividers</Label>
                <Switch
                  checked={menuData.settings.showDivider}
                  onCheckedChange={(checked) => updateData('settings.showDivider', checked)}
                />
              </div>

              {menuData.settings.showDivider && (
                <>
                  <div>
                    <Label className="text-xs">Style</Label>
                    <Select 
                      value={menuData.styles.divider?.style || 'solid'}
                      onValueChange={(value) => updateData('styles.divider.style', value)}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="solid">Solid</SelectItem>
                        <SelectItem value="dashed">Dashed</SelectItem>
                        <SelectItem value="dotted">Dotted</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs">Thickness: {menuData.styles.divider?.thickness || 1}px</Label>
                    <Slider
                      value={[menuData.styles.divider?.thickness || 1]}
                      onValueChange={([value]) => updateData('styles.divider.thickness', value)}
                      min={1}
                      max={10}
                      step={1}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-xs">Color</Label>
                    <div className="flex gap-2 mt-2">
                      <input
                        type="color"
                        value={menuData.styles.divider?.color || '#e0e0e0'}
                        onChange={(e) => updateData('styles.divider.color', e.target.value)}
                        className="w-12 h-10 rounded border cursor-pointer"
                      />
                      <Input
                        value={menuData.styles.divider?.color || '#e0e0e0'}
                        onChange={(e) => updateData('styles.divider.color', e.target.value)}
                        className="flex-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs">Indent: {menuData.styles.divider?.indent || 0}px</Label>
                    <Slider
                      value={[menuData.styles.divider?.indent || 0]}
                      onValueChange={([value]) => updateData('styles.divider.indent', value)}
                      min={0}
                      max={100}
                      step={5}
                      className="mt-2"
                    />
                  </div>
                </>
              )}
            </div>
          </Section>

          <Separator />

          {/* VISIBILITY SECTION */}
          <Section title="Visibility">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Show Descriptions</Label>
                <Switch
                  checked={menuData.settings.showDescriptions}
                  onCheckedChange={(checked) => updateData('settings.showDescriptions', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label className="text-xs">Show Item Images</Label>
                <Switch
                  checked={menuData.settings.imageForItem}
                  onCheckedChange={(checked) => updateData('settings.imageForItem', checked)}
                />
              </div>
            </div>
          </Section>

          <Separator />

          {/* ACCESSIBILITY SECTION */}
          <Section title="Accessibility">
            <div className="space-y-4">
              <div>
                <Label className="text-xs">Locale</Label>
                <Select defaultValue="en-IN">
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LOCALES.map(locale => (
                      <SelectItem key={locale.value} value={locale.value}>
                        {locale.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="text-xs font-medium">Contrast Check</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Headline-to-background contrast is good (WCAG AA)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          <Separator />

          {/* EXPORT SECTION */}
          <Section title="Export">
            <div className="space-y-2">
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => window.alert('Preview functionality - open in new tab')}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview Full Screen
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => exportAsJSON(menuData)}
              >
                <FileJson className="h-4 w-4 mr-2" />
                Export as JSON
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
                onClick={() => exportAsHTML(menuData)}
              >
                <FileCode className="h-4 w-4 mr-2" />
                Export as HTML
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full justify-start"
              >
                <ImageIcon className="h-4 w-4 mr-2" />
                Export as Image
              </Button>
              
              <Button 
                size="sm" 
                className="w-full justify-start"
              >
                <Save className="h-4 w-4 mr-2" />
                Save as Template
              </Button>
            </div>
          </Section>

        </div>
      </ScrollArea>
    </div>
  );
};

export default MenuBlockSidebar;

