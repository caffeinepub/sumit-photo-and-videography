import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { parseBigIntSafe, calculateLineTotal, formatCurrency } from '../../lib/order-utils';
import type { OrderItem } from '../../types/orders';

interface OrderLineItemsEditorProps {
  items: OrderItem[];
  onChange: (items: OrderItem[]) => void;
}

interface LocalItem {
  itemName: string;
  quantity: string;
  unitPrice: string;
}

export default function OrderLineItemsEditor({ items, onChange }: OrderLineItemsEditorProps) {
  // Convert OrderItem[] to local editable format
  const [localItems, setLocalItems] = useState<LocalItem[]>(
    items.length > 0
      ? items.map((item) => ({
          itemName: item.itemName,
          quantity: item.quantity.toString(),
          unitPrice: item.unitPrice.toString(),
        }))
      : [{ itemName: '', quantity: '1', unitPrice: '0' }]
  );

  const handleAddItem = () => {
    const newItems = [...localItems, { itemName: '', quantity: '1', unitPrice: '0' }];
    setLocalItems(newItems);
    syncToParent(newItems);
  };

  const handleRemoveItem = (index: number) => {
    const newItems = localItems.filter((_, i) => i !== index);
    // Ensure at least one item remains
    if (newItems.length === 0) {
      newItems.push({ itemName: '', quantity: '1', unitPrice: '0' });
    }
    setLocalItems(newItems);
    syncToParent(newItems);
  };

  const handleItemChange = (index: number, field: keyof LocalItem, value: string) => {
    const newItems = [...localItems];
    if (field === 'quantity' || field === 'unitPrice') {
      // Prevent negative values
      const num = parseInt(value, 10);
      if (value !== '' && (isNaN(num) || num < 0)) return;
    }
    newItems[index] = { ...newItems[index], [field]: value };
    setLocalItems(newItems);
    syncToParent(newItems);
  };

  const syncToParent = (items: LocalItem[]) => {
    const orderItems: OrderItem[] = items
      .filter((item) => item.itemName.trim() !== '')
      .map((item) => ({
        itemName: item.itemName.trim(),
        quantity: parseBigIntSafe(item.quantity),
        unitPrice: parseBigIntSafe(item.unitPrice),
      }));
    onChange(orderItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <Label className="font-semibold text-base">Order Items</Label>
        <Button type="button" size="sm" variant="outline" onClick={handleAddItem} className="gap-1.5 hover:border-accent/50">
          <Plus className="h-3.5 w-3.5" />
          Add Item
        </Button>
      </div>

      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
        {localItems.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-2 items-end p-3 rounded-lg border border-accent/20 bg-accent/5">
            <div className="col-span-5">
              <Label htmlFor={`item-name-${index}`} className="text-xs mb-1.5 block">
                Item Name
              </Label>
              <Input
                id={`item-name-${index}`}
                value={item.itemName}
                onChange={(e) => handleItemChange(index, 'itemName', e.target.value)}
                placeholder="e.g., Photo Print"
                className="control-surface h-9"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor={`item-qty-${index}`} className="text-xs mb-1.5 block">
                Qty
              </Label>
              <Input
                id={`item-qty-${index}`}
                type="number"
                min="0"
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                className="control-surface h-9"
              />
            </div>
            <div className="col-span-2">
              <Label htmlFor={`item-price-${index}`} className="text-xs mb-1.5 block">
                Price
              </Label>
              <Input
                id={`item-price-${index}`}
                type="number"
                min="0"
                value={item.unitPrice}
                onChange={(e) => handleItemChange(index, 'unitPrice', e.target.value)}
                className="control-surface h-9"
              />
            </div>
            <div className="col-span-2">
              <Label className="text-xs mb-1.5 block">Total</Label>
              <div className="h-9 flex items-center justify-center text-sm font-semibold text-accent">
                {formatCurrency(calculateLineTotal(parseBigIntSafe(item.quantity), parseBigIntSafe(item.unitPrice)))}
              </div>
            </div>
            <div className="col-span-1 flex justify-end">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={() => handleRemoveItem(index)}
                disabled={localItems.length === 1}
                className="h-9 w-9 p-0 hover:bg-destructive/10 hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {localItems.filter((item) => item.itemName.trim() !== '').length === 0 && (
        <p className="text-xs text-muted-foreground italic">Add at least one item with a name</p>
      )}
    </div>
  );
}
