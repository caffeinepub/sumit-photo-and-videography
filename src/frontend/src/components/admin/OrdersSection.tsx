import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Package, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { useCreateOrder, useGetOrdersByStatus } from '../../hooks/useQueries';
import { OrderStatus, type OrderItem, type CreateOrderRequest } from '../../types/orders';
import OrderLineItemsEditor from './OrderLineItemsEditor';
import { dateToTime, formatTime } from '../../lib/time-utils';
import { calculateOrderSubtotal, formatCurrency, parseBigIntSafe } from '../../lib/order-utils';
import { toast } from 'sonner';

export default function OrdersSection() {
  const [filterStatus, setFilterStatus] = useState<OrderStatus | null>(null);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  // Create form state
  const [customerName, setCustomerName] = useState('');
  const [orderDate, setOrderDate] = useState('');
  const [fulfillDate, setFulfillDate] = useState('');
  const [numberOfDvd, setNumberOfDvd] = useState('0');
  const [numberOfPrints, setNumberOfPrints] = useState('0');
  const [items, setItems] = useState<OrderItem[]>([]);
  const [advance, setAdvance] = useState('0');

  const { data: orders = [] } = useGetOrdersByStatus(filterStatus);
  const createOrder = useCreateOrder();

  const handleCreateOrder = async () => {
    if (!customerName.trim()) {
      toast.error('Customer name is required');
      return;
    }

    if (!orderDate || !fulfillDate) {
      toast.error('Order date and fulfill date are required');
      return;
    }

    if (items.length === 0) {
      toast.error('At least one order item is required');
      return;
    }

    const subtotal = calculateOrderSubtotal(items);
    const advanceAmount = parseBigIntSafe(advance);
    const remainingDue = subtotal > advanceAmount ? subtotal - advanceAmount : BigInt(0);

    const request: CreateOrderRequest = {
      customerName: customerName.trim(),
      orderDate: dateToTime(orderDate),
      fulfillDate: dateToTime(fulfillDate),
      numberOfDvd: parseBigIntSafe(numberOfDvd),
      numberOfPrints: parseBigIntSafe(numberOfPrints),
      items,
      payment: {
        total: subtotal,
        advance: advanceAmount,
        remainingDue,
      },
    };

    try {
      await createOrder.mutateAsync(request);
      
      // Reset form
      setCustomerName('');
      setOrderDate('');
      setFulfillDate('');
      setNumberOfDvd('0');
      setNumberOfPrints('0');
      setItems([]);
      setAdvance('0');
      setCreateDialogOpen(false);
    } catch (error) {
      console.error('Create order error:', error);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return <Badge variant="outline" className="gap-1"><Clock className="h-3 w-3" />Pending</Badge>;
      case OrderStatus.Fulfilled:
        return <Badge variant="outline" className="gap-1 border-green-500 text-green-700"><CheckCircle className="h-3 w-3" />Fulfilled</Badge>;
      case OrderStatus.Cancelled:
        return <Badge variant="outline" className="gap-1 border-red-500 text-red-700"><XCircle className="h-3 w-3" />Cancelled</Badge>;
    }
  };

  const subtotal = calculateOrderSubtotal(items);
  const advanceAmount = parseBigIntSafe(advance);
  const remainingDue = subtotal > advanceAmount ? subtotal - advanceAmount : BigInt(0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                Orders Management
              </CardTitle>
              <CardDescription>
                Create and manage customer orders
              </CardDescription>
            </div>
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Order
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Order</DialogTitle>
                  <DialogDescription>
                    Fill in the order details below
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Customer Name *</Label>
                    <Input
                      id="customer-name"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder="Enter customer name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="order-date">Order Date *</Label>
                      <Input
                        id="order-date"
                        type="date"
                        value={orderDate}
                        onChange={(e) => setOrderDate(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="fulfill-date">Fulfill Date *</Label>
                      <Input
                        id="fulfill-date"
                        type="date"
                        value={fulfillDate}
                        onChange={(e) => setFulfillDate(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="num-dvd">Number of DVDs</Label>
                      <Input
                        id="num-dvd"
                        type="number"
                        min="0"
                        value={numberOfDvd}
                        onChange={(e) => setNumberOfDvd(e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="num-prints">Number of Prints</Label>
                      <Input
                        id="num-prints"
                        type="number"
                        min="0"
                        value={numberOfPrints}
                        onChange={(e) => setNumberOfPrints(e.target.value)}
                      />
                    </div>
                  </div>

                  <OrderLineItemsEditor items={items} onChange={setItems} />

                  <div className="space-y-3 p-4 bg-accent/5 rounded-lg border">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">Subtotal:</span>
                      <span className="font-semibold">{formatCurrency(subtotal)}</span>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="advance">Advance Payment</Label>
                      <Input
                        id="advance"
                        type="number"
                        min="0"
                        value={advance}
                        onChange={(e) => setAdvance(e.target.value)}
                        placeholder="0"
                      />
                    </div>

                    <div className="flex justify-between text-sm pt-2 border-t">
                      <span className="font-medium">Remaining Due:</span>
                      <span className="font-semibold text-accent">{formatCurrency(remainingDue)}</span>
                    </div>
                  </div>
                </div>

                <DialogFooter>
                  <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleCreateOrder}
                    disabled={!customerName.trim() || !orderDate || !fulfillDate || items.length === 0 || createOrder.isPending}
                  >
                    {createOrder.isPending ? 'Creating...' : 'Create Order'}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Button
                variant={filterStatus === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(null)}
              >
                All
              </Button>
              <Button
                variant={filterStatus === OrderStatus.Pending ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(OrderStatus.Pending)}
              >
                Pending
              </Button>
              <Button
                variant={filterStatus === OrderStatus.Fulfilled ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(OrderStatus.Fulfilled)}
              >
                Fulfilled
              </Button>
              <Button
                variant={filterStatus === OrderStatus.Cancelled ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(OrderStatus.Cancelled)}
              >
                Cancelled
              </Button>
            </div>

            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">
                No orders found
              </p>
            ) : (
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={Number(order.id)} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">Order #{Number(order.id)}</h3>
                        <p className="text-sm text-muted-foreground">{order.customerName}</p>
                      </div>
                      {getStatusBadge(order.status)}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Order: {formatTime(order.orderDate)}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        <span>Fulfill: {formatTime(order.fulfillDate)}</span>
                      </div>
                    </div>

                    {order.items.length > 0 && (
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Items:</p>
                        <div className="space-y-1">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="text-sm flex justify-between">
                              <span>{item.itemName} × {Number(item.quantity)}</span>
                              <span className="font-medium">{formatCurrency(BigInt(item.unitPrice) * BigInt(item.quantity))}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="pt-2 border-t space-y-1">
                      <div className="flex justify-between text-sm">
                        <span>Total:</span>
                        <span className="font-semibold">{formatCurrency(order.payment.total)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>Advance:</span>
                        <span>{formatCurrency(order.payment.advance)}</span>
                      </div>
                      <div className="flex justify-between text-sm font-medium">
                        <span>Remaining:</span>
                        <span className="text-accent">{formatCurrency(order.payment.remainingDue)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
