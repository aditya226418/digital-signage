/**
 * MenuItemEditModal - Modal for editing and managing menu items
 * Opens when clicking on menu items in the MenuBlock canvas
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Plus,
  Copy,
  Trash2,
  GripVertical,
  Upload,
  Check,
  Flame,
  Save
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
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
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ALL_ICONS, getIcon } from './icons.jsx';

/**
 * Main MenuItemEditModal Component
 */
export const MenuItemEditModal = ({ 
  open, 
  onOpenChange, 
  menuData, 
  onUpdate,
  selectedItemId = null 
}) => {
  const [addingItem, setAddingItem] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: 0,
    tag: 'veg',
    icon: 'leaf',
    spicy: false,
    image: ''
  });

  // When modal opens with a selected item, scroll to it and highlight it
  useEffect(() => {
    if (open && selectedItemId) {
      setEditingItemId(selectedItemId);
      // Auto-scroll to selected item
      setTimeout(() => {
        const element = document.getElementById(`item-card-${selectedItemId}`);
        element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  }, [open, selectedItemId]);

  // Safety check
  if (!menuData || !menuData.items) {
    return null;
  }

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
    if (confirm('Are you sure you want to delete this item?')) {
      onUpdate({
        ...menuData,
        items: menuData.items.filter(item => item.id !== itemId)
      });
      if (editingItemId === itemId) {
        setEditingItemId(null);
      }
    }
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

  // Move item up/down
  const handleMoveItem = (itemId, direction) => {
    const items = [...menuData.items];
    const index = items.findIndex(item => item.id === itemId);
    
    if (direction === 'up' && index > 0) {
      [items[index], items[index - 1]] = [items[index - 1], items[index]];
    } else if (direction === 'down' && index < items.length - 1) {
      [items[index], items[index + 1]] = [items[index + 1], items[index]];
    }
    
    onUpdate({
      ...menuData,
      items
    });
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle className="text-xl">Menu Items Manager</DialogTitle>
          <DialogDescription>
            Add, edit, and reorder your menu items. Click on any item to edit its details.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 p-6 overflow-hidden">
          {/* Items List - Left Side */}
          <div className="flex-1 min-w-0">
            <ScrollArea className="h-[60vh]">
              <div className="space-y-3 pr-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm">All Items ({menuData.items.length})</h3>
                  <Button 
                    variant="default" 
                    size="sm"
                    onClick={() => {
                      setAddingItem(true);
                      setEditingItemId(null);
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Item
                  </Button>
                </div>

                {menuData.items.map((item, index) => (
                  <Card 
                    key={item.id} 
                    id={`item-card-${item.id}`}
                    className={`p-3 cursor-pointer transition-all hover:shadow-md ${
                      editingItemId === item.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => {
                      setEditingItemId(item.id);
                      setAddingItem(false);
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex flex-col gap-1">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveItem(item.id, 'up');
                                }}
                                disabled={index === 0}
                              >
                                <GripVertical className="h-3 w-3" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>Reorder</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-semibold text-sm">{item.name}</p>
                          {item.tag === 'veg' && (
                            <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">Veg</Badge>
                          )}
                          {item.tag === 'nonveg' && (
                            <Badge variant="outline" className="text-xs bg-red-50 text-red-700 border-red-200">Non-veg</Badge>
                          )}
                          {item.tag === 'contains-nuts' && (
                            <Badge variant="outline" className="text-xs bg-amber-50 text-amber-700 border-amber-200">Contains Nuts</Badge>
                          )}
                          {item.spicy && (
                            <Flame className="h-3 w-3 text-orange-500" />
                          )}
                        </div>
                        {item.description && (
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>
                        )}
                        <p className="text-sm font-bold mt-1">
                          {menuData.styles?.currency || '₹'}{item.price.toFixed(menuData.settings?.priceDecimals || 0)}
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDuplicateItem(item);
                                }}
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
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteItem(item.id);
                                }}
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

                {menuData.items.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground">
                    <p className="mb-4">No menu items yet</p>
                    <Button onClick={() => setAddingItem(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add First Item
                    </Button>
                  </div>
                )}

                {/* CSV Import */}
                <div className="pt-2">
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
            </ScrollArea>
          </div>

          {/* Edit Panel - Right Side */}
          <div className="w-full md:w-80 border-l pl-6">
            <ScrollArea className="h-[60vh]">
              {addingItem ? (
                <div>
                  <h3 className="font-semibold text-sm mb-4">Add New Item</h3>
                  <div className="space-y-4">
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
                        rows={3}
                        className="mt-1"
                      />
                    </div>
                    
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

                    <div className="flex items-center space-x-2">
                      <Switch
                        checked={newItem.spicy}
                        onCheckedChange={(checked) => setNewItem({ ...newItem, spicy: checked })}
                        id="new-spicy"
                      />
                      <Label htmlFor="new-spicy" className="text-xs">
                        <Flame className="h-3 w-3 inline mr-1" />
                        Spicy
                      </Label>
                    </div>

                    <div>
                      <Label className="text-xs">Image URL (Optional)</Label>
                      <Input
                        value={newItem.image}
                        onChange={(e) => setNewItem({ ...newItem, image: e.target.value })}
                        placeholder="https://..."
                        className="mt-1"
                      />
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" onClick={handleAddItem} className="flex-1">
                        <Check className="h-3 w-3 mr-1" />
                        Add Item
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setAddingItem(false)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              ) : editingItemId ? (
                <div>
                  {(() => {
                    const item = menuData.items.find(i => i.id === editingItemId);
                    if (!item) return null;
                    
                    return (
                      <>
                        <h3 className="font-semibold text-sm mb-4">Edit Item</h3>
                        <div className="space-y-4">
                          <div>
                            <Label className="text-xs">Name *</Label>
                            <Input
                              value={item.name}
                              onChange={(e) => handleUpdateItem(item.id, 'name', e.target.value)}
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-xs">Description</Label>
                            <Textarea
                              value={item.description || ''}
                              onChange={(e) => handleUpdateItem(item.id, 'description', e.target.value)}
                              rows={3}
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-xs">Price *</Label>
                            <Input
                              type="number"
                              value={item.price}
                              onChange={(e) => handleUpdateItem(item.id, 'price', parseFloat(e.target.value) || 0)}
                              min={0}
                              step={0.01}
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label className="text-xs">Tag</Label>
                            <Select 
                              value={item.tag}
                              onValueChange={(value) => handleUpdateItem(item.id, 'tag', value)}
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

                          <div className="flex items-center space-x-2">
                            <Switch
                              checked={item.spicy || false}
                              onCheckedChange={(checked) => handleUpdateItem(item.id, 'spicy', checked)}
                              id={`edit-spicy-${item.id}`}
                            />
                            <Label htmlFor={`edit-spicy-${item.id}`} className="text-xs">
                              <Flame className="h-3 w-3 inline mr-1" />
                              Spicy
                            </Label>
                          </div>

                          <div>
                            <Label className="text-xs">Image URL (Optional)</Label>
                            <Input
                              value={item.image || ''}
                              onChange={(e) => handleUpdateItem(item.id, 'image', e.target.value)}
                              placeholder="https://..."
                              className="mt-1"
                            />
                          </div>

                          <div className="flex gap-2 pt-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              onClick={() => setEditingItemId(null)} 
                              className="flex-1"
                            >
                              Done
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDeleteItem(item.id)}
                              className="flex-1"
                            >
                              <Trash2 className="h-3 w-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </>
                    );
                  })()}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p className="text-sm">Select an item to edit or add a new one</p>
                </div>
              )}
            </ScrollArea>
          </div>
        </div>

        <div className="border-t p-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MenuItemEditModal;

