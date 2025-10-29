import { useState, useEffect } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";

interface SchemaField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'single-select' | 'multi-select' | 'boolean' | 'date';
  options?: string[];
  required?: boolean;
  helpText?: string;
}

interface Schema {
  version: number;
  fields: SchemaField[];
}

interface AdminSchemaModalProps {
  open: boolean;
  onClose: () => void;
  schema: Schema;
  onUpdateSchema: (schema: Schema) => void;
  defaultSchema: Schema;
}

export default function AdminSchemaModal({
  open,
  onClose,
  schema,
  onUpdateSchema,
  defaultSchema,
}: AdminSchemaModalProps) {
  const { toast } = useToast();
  const [editingSchema, setEditingSchema] = useState<Schema>(schema);
  const [deleteConfirmIndex, setDeleteConfirmIndex] = useState<number | null>(null);
  const [newOptionInputs, setNewOptionInputs] = useState<Record<number, string>>({});

  useEffect(() => {
    setEditingSchema(schema);
  }, [schema, open]);

  const addField = () => {
    const newField: SchemaField = {
      id: `field_${Date.now()}`,
      label: 'New Field',
      type: 'text',
      required: false,
    };
    
    setEditingSchema(prev => ({
      ...prev,
      fields: [...prev.fields, newField],
    }));
  };

  const updateField = (index: number, updates: Partial<SchemaField>) => {
    setEditingSchema(prev => ({
      ...prev,
      fields: prev.fields.map((field, i) => 
        i === index ? { ...field, ...updates } : field
      ),
    }));
  };

  const deleteField = (index: number) => {
    setEditingSchema(prev => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));
    setDeleteConfirmIndex(null);
  };

  const moveField = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= editingSchema.fields.length) return;

    setEditingSchema(prev => {
      const newFields = [...prev.fields];
      [newFields[index], newFields[newIndex]] = [newFields[newIndex], newFields[index]];
      return { ...prev, fields: newFields };
    });
  };

  const addOption = (fieldIndex: number) => {
    const newOption = newOptionInputs[fieldIndex]?.trim();
    if (!newOption) return;

    updateField(fieldIndex, {
      options: [...(editingSchema.fields[fieldIndex].options || []), newOption],
    });
    
    setNewOptionInputs(prev => ({ ...prev, [fieldIndex]: '' }));
  };

  const removeOption = (fieldIndex: number, optionIndex: number) => {
    const field = editingSchema.fields[fieldIndex];
    updateField(fieldIndex, {
      options: field.options?.filter((_, i) => i !== optionIndex),
    });
  };

  const handleSave = () => {
    // Validate that all fields have labels
    const invalidFields = editingSchema.fields.filter(f => !f.label.trim());
    if (invalidFields.length > 0) {
      toast({
        title: "Validation Error",
        description: "All fields must have a label",
        variant: "destructive",
      });
      return;
    }

    // Validate that select fields have options
    const selectFieldsWithoutOptions = editingSchema.fields.filter(
      f => (f.type === 'single-select' || f.type === 'multi-select') && (!f.options || f.options.length === 0)
    );
    if (selectFieldsWithoutOptions.length > 0) {
      toast({
        title: "Validation Error",
        description: "Select fields must have at least one option",
        variant: "destructive",
      });
      return;
    }

    onUpdateSchema({ ...editingSchema, version: editingSchema.version + 1 });
    toast({
      title: "Schema Updated",
      description: "Custom field schema has been saved successfully",
    });
    onClose();
  };

  const handleReset = () => {
    setEditingSchema(defaultSchema);
    toast({
      title: "Schema Reset",
      description: "Schema has been reset to default",
    });
  };

  const fieldTypeOptions = [
    { value: 'text', label: 'Text' },
    { value: 'number', label: 'Number' },
    { value: 'single-select', label: 'Single Select' },
    { value: 'multi-select', label: 'Multi Select' },
    { value: 'boolean', label: 'Boolean' },
    { value: 'date', label: 'Date' },
  ];

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Manage Custom Fields</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {editingSchema.fields.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No custom fields defined. Click "Add Field" to create one.
              </div>
            ) : (
              editingSchema.fields.map((field, index) => (
                <Card key={field.id} className="p-4 space-y-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 space-y-4">
                      {/* Label */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <Label htmlFor={`label-${index}`} className="text-sm">Field Label</Label>
                          <Input
                            id={`label-${index}`}
                            value={field.label}
                            onChange={(e) => updateField(index, { label: e.target.value })}
                            placeholder="Field label"
                          />
                        </div>

                        {/* Type */}
                        <div className="space-y-2">
                          <Label htmlFor={`type-${index}`} className="text-sm">Field Type</Label>
                          <Select
                            value={field.type}
                            onValueChange={(value: any) => {
                              const updates: Partial<SchemaField> = { type: value };
                              // Clear options if changing from select type
                              if (value !== 'single-select' && value !== 'multi-select') {
                                updates.options = undefined;
                              } else if (!field.options) {
                                updates.options = [];
                              }
                              updateField(index, updates);
                            }}
                          >
                            <SelectTrigger id={`type-${index}`}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {fieldTypeOptions.map(opt => (
                                <SelectItem key={opt.value} value={opt.value}>
                                  {opt.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Required Checkbox */}
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`required-${index}`}
                          checked={field.required || false}
                          onCheckedChange={(checked) => updateField(index, { required: !!checked })}
                        />
                        <Label
                          htmlFor={`required-${index}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          Required field
                        </Label>
                      </div>

                      {/* Help Text */}
                      <div className="space-y-2">
                        <Label htmlFor={`help-${index}`} className="text-sm">Help Text (optional)</Label>
                        <Input
                          id={`help-${index}`}
                          value={field.helpText || ''}
                          onChange={(e) => updateField(index, { helpText: e.target.value })}
                          placeholder="Helpful description for users"
                        />
                      </div>

                      {/* Options for Select Types */}
                      {(field.type === 'single-select' || field.type === 'multi-select') && (
                        <div className="space-y-2">
                          <Label className="text-sm">Options</Label>
                          <div className="space-y-2">
                            {field.options?.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center gap-2">
                                <Input value={option} disabled className="flex-1" />
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeOption(index, optIndex)}
                                  className="h-8 w-8 shrink-0"
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                            <div className="flex items-center gap-2">
                              <Input
                                placeholder="Add new option"
                                value={newOptionInputs[index] || ''}
                                onChange={(e) => setNewOptionInputs(prev => ({
                                  ...prev,
                                  [index]: e.target.value
                                }))}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addOption(index);
                                  }
                                }}
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addOption(index)}
                                disabled={!newOptionInputs[index]?.trim()}
                              >
                                Add
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => moveField(index, 'up')}
                        disabled={index === 0}
                        className="h-8 w-8"
                      >
                        <ChevronUp className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => moveField(index, 'down')}
                        disabled={index === editingSchema.fields.length - 1}
                        className="h-8 w-8"
                      >
                        <ChevronDown className="h-4 w-4" />
                      </Button>
                      <Separator className="my-1" />
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setDeleteConfirmIndex(index)}
                        className="h-8 w-8 text-destructive hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}

            <Button
              variant="outline"
              onClick={addField}
              className="w-full gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Field
            </Button>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="ghost" onClick={handleReset}>
              Reset to Default
            </Button>
            <div className="flex gap-2">
              <Button variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Schema
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmIndex !== null} onOpenChange={() => setDeleteConfirmIndex(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Field</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the field "
              {deleteConfirmIndex !== null && editingSchema.fields[deleteConfirmIndex]?.label}"? 
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteConfirmIndex !== null && deleteField(deleteConfirmIndex)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

