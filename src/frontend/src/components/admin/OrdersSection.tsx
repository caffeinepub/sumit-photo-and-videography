import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus, Pencil, Trash2, ShoppingCart, DollarSign, Package } from 'lucide-react';
import { toast } from 'sonner';
import { OrderStatus } from '../../types/orders';
import type { Order, CreateOrderRequest, UpdateOrderRequest, UpdateOrderStatusRequest, OrderItem, PaymentFields } from '../../types/orders';
import { useGetOrdersByStatus, useCreateOrder, useUpdateOrder, useUpdateOrderStatus, useDeleteOrder } from '../../hooks/useQueries';
import { dateToTime, timeToDate, formatTime } from '../../lib/time-utils';
import { parseBigIntSafe, clampNonNegative, calculateRemainingDue, formatCurrency, calculateOrderSubtotal } from '../../lib/order-utils';
import OrderLineItemsEditor from './OrderLineItemsEditor';

export default function OrdersSection() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const { data: orders = [], isLoading } = useGetOrdersByStatus(statusFilter);
  const createOrder = useCreateOrder();
  const updateOrder = useUpdateOrder();
  const updateOrderStatus = useUpdateOrderStatus();
  const deleteOrder = useDeleteOrder();

  // Form state for create/edit
  const [formData, setFormData] = useState({
    orderDate: '',
    fulfillDate: '',
    customerName: '',
    numberOfDvd: '0',
    numberOfPrints: '0',
    paymentTotal: '0',
    paymentAdvance: '0',
    items: [] as OrderItem[],
  });

  const resetForm = () => {
    setFormData({
      orderDate: '',
      fulfillDate: '',
      customerName: '',
      numberOfDvd: '0',
      numberOfPrints: '0',
      paymentTotal: '0',
      paymentAdvance: '0',
      items: [],
    });
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const openEditDialog = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      orderDate: timeToDate(order.orderDate),
      fulfillDate: timeToDate(order.fulfillDate),
      customerName: order.customerName,
      numberOfDvd: order.numberOfDvd.toString(),
      numberOfPrints: order.numberOfPrints.toString(),
      paymentTotal: order.payment.total.toString(),
      paymentAdvance: order.payment.advance.toString(),
      items: order.items,
    });
    setIsEditDialogOpen(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.customerName.trim()) {
      toast.error('Customer name is required');
      return;
    }

    if (!formData.orderDate || !formData.fulfillDate) {
      toast.error('Order date and fulfill date are required');
      return;
    }

    const total = parseBigIntSafe(formData.paymentTotal);
    const advance = parseBigIntSafe(formData.paymentAdvance);
    const remainingDue = calculateRemainingDue(total, advance);

    const payment: PaymentFields = {
      total,
      advance,
      remainingDue,
    };

    const request: CreateOrderRequest = {
      orderDate: dateToTime(formData.orderDate),
      fulfillDate: dateToTime(formData.fulfillDate),
      customerName: formData.customerName.trim(),
      numberOfDvd: parseBigIntSafe(formData.numberOfDvd),
      numberOfPrints: parseBigIntSafe(formData.numberOfPrints),
      payment,
      items: formData.items,
    };

    createOrder.mutate(request, {
      onSuccess: () => {
        toast.success('Order created successfully');
        setIsCreateDialogOpen(false);
        resetForm();
      },
      onError: (error) => {
        console.error('Failed to create order:', error);
        toast.error('Failed to create order');
      },
    });
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!editingOrder) return;

    const total = parseBigIntSafe(formData.paymentTotal);
    const advance = parseBigIntSafe(formData.paymentAdvance);
    const remainingDue = calculateRemainingDue(total, advance);

    const payment: PaymentFields = {
      total,
      advance,
      remainingDue,
    };

    const request: UpdateOrderRequest = {
      fulfillDate: dateToTime(formData.fulfillDate),
      customerName: formData.customerName.trim(),
      numberOfDvd: parseBigIntSafe(formData.numberOfDvd),
      numberOfPrints: parseBigIntSafe(formData.numberOfPrints),
      payment,
      items: formData.items,
    };

    updateOrder.mutate(
      { orderId: editingOrder.id, request },
      {
        onSuccess: () => {
          toast.success('Order updated successfully');
          setIsEditDialogOpen(false);
          setEditingOrder(null);
          resetForm();
        },
        onError: (error) => {
          console.error('Failed to update order:', error);
          toast.error('Failed to update order');
        },
      }
    );
  };

  const handleStatusChange = (orderId: bigint, newStatus: OrderStatus) => {
    const request: UpdateOrderStatusRequest = { status: newStatus };
    updateOrderStatus.mutate(
      { orderId, request },
      {
        onSuccess: () => {
          toast.success(`Order marked as ${newStatus}`);
        },
        onError: (error) => {
          console.error('Failed to update order status:', error);
          toast.error('Failed to update order status');
        },
      }
    );
  };

  const handleDelete = (orderId: bigint) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    deleteOrder.mutate(orderId, {
      onSuccess: () => {
        toast.success('Order deleted successfully');
      },
      onError: (error) => {
        console.error('Failed to delete order:', error);
        toast.error('Failed to delete order');
      },
    });
  };

  const getStatusBadgeVariant = (status: OrderStatus): 'default' | 'secondary' | 'destructive' => {
    switch (status) {
      case OrderStatus.Fulfilled:
        return 'default';
      case OrderStatus.Pending:
        return 'secondary';
      case OrderStatus.Cancelled:
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Orders</h2>
          <p className="text-muted-foreground">Manage customer orders with payment tracking</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Order
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
              <DialogDescription>Add a new order with payment details and items</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderDate">Order Date</Label>
                  <Input
                    id="orderDate"
                    type="date"
                    value={formData.orderDate}
                    onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fulfillDate">Fulfill Date</Label>
                  <Input
                    id="fulfillDate"
                    type="date"
                    value={formData.fulfillDate}
                    onChange={(e) => setFormData({ ...formData, fulfillDate: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customerName">Customer Name</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                  placeholder="Enter customer name"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="numberOfDvd">Number of DVDs</Label>
                  <Input
                    id="numberOfDvd"
                    type="number"
                    min="0"
                    value={formData.numberOfDvd}
                    onChange={(e) => setFormData({ ...formData, numberOfDvd: clampNonNegative(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numberOfPrints">Number of Prints</Label>
                  <Input
                    id="numberOfPrints"
                    type="number"
                    min="0"
                    value={formData.numberOfPrints}
                    onChange={(e) => setFormData({ ...formData, numberOfPrints: clampNonNegative(e.target.value) })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="paymentTotal">Total Amount</Label>
                  <Input
                    id="paymentTotal"
                    type="number"
                    min="0"
                    value={formData.paymentTotal}
                    onChange={(e) => setFormData({ ...formData, paymentTotal: clampNonNegative(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="paymentAdvance">Advance Paid</Label>
                  <Input
                    id="paymentAdvance"
                    type="number"
                    min="0"
                    value={formData.paymentAdvance}
                    onChange={(e) => setFormData({ ...formData, paymentAdvance: clampNonNegative(e.target.value) })}
                  />
                </div>
              </div>

              <OrderLineItemsEditor
                items={formData.items}
                onChange={(items) => setFormData({ ...formData, items })}
              />

              <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createOrder.isPending}>
                  {createOrder.isPending ? 'Creating...' : 'Create Order'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={statusFilter === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter(null)}
        >
          All
        </Button>
        <Button
          variant={statusFilter === OrderStatus.Pending ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter(OrderStatus.Pending)}
        >
          Pending
        </Button>
        <Button
          variant={statusFilter === OrderStatus.Fulfilled ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter(OrderStatus.Fulfilled)}
        >
          Fulfilled
        </Button>
        <Button
          variant={statusFilter === OrderStatus.Cancelled ? 'default' : 'outline'}
          size="sm"
          onClick={() => setStatusFilter(OrderStatus.Cancelled)}
        >
          Cancelled
        </Button>
      </div>

      {/* Orders List */}
      {isLoading ? (
        <Card>
          <CardContent className="py-12">
            <p className="text-center text-muted-foreground">Loading orders...</p>
          </CardContent>
        </Card>
      ) : orders.length === 0 ? (
        <Card>
          <CardContent className="py-12">
            <div className="flex flex-col items-center justify-center text-center">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
              <p className="text-lg text-muted-foreground mb-2">No orders found</p>
              <p className="text-sm text-muted-foreground">Create your first order to get started</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id.toString()} className="border-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5" />
                      Order #{order.id.toString()}
                    </CardTitle>
                    <CardDescription>
                      Customer: {order.customerName} • Order Date: {formatTime(order.orderDate)} • Fulfill Date:{' '}
                      {formatTime(order.fulfillDate)}
                    </CardDescription>
                  </div>
                  <Badge variant={getStatusBadgeVariant(order.status)}>{order.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Payment Details */}
                <div className="grid grid-cols-3 gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Total Amount</p>
                      <p className="font-semibold">{formatCurrency(order.payment.total)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Advance Paid</p>
                      <p className="font-semibold">{formatCurrency(order.payment.advance)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Remaining Due</p>
                      <p className="font-semibold">{formatCurrency(order.payment.remainingDue)}</p>
                    </div>
                  </div>
                </div>

                {/* Items */}
                {order.items.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Package className="h-4 w-4" />
                      Order Items
                    </div>
                    <div className="space-y-1">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-sm p-2 rounded bg-muted/30">
                          <span>
                            {item.itemName} (x{item.quantity.toString()})
                          </span>
                          <span className="font-medium">{formatCurrency(item.quantity * item.unitPrice)}</span>
                        </div>
                      ))}
                      <div className="flex justify-between text-sm font-semibold p-2 rounded bg-muted/50">
                        <span>Subtotal</span>
                        <span>{formatCurrency(calculateOrderSubtotal(order.items))}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  {order.status === OrderStatus.Pending && (
                    <>
                      <Button size="sm" variant="outline" onClick={() => handleStatusChange(order.id, OrderStatus.Fulfilled)}>
                        Mark Fulfilled
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleStatusChange(order.id, OrderStatus.Cancelled)}
                      >
                        Cancel Order
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(order)} className="gap-2">
                    <Pencil className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(order.id)}
                    className="gap-2 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>Update order details and payment information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-orderDate">Order Date</Label>
                <Input id="edit-orderDate" type="date" value={formData.orderDate} disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-fulfillDate">Fulfill Date</Label>
                <Input
                  id="edit-fulfillDate"
                  type="date"
                  value={formData.fulfillDate}
                  onChange={(e) => setFormData({ ...formData, fulfillDate: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-customerName">Customer Name</Label>
              <Input
                id="edit-customerName"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Enter customer name"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-numberOfDvd">Number of DVDs</Label>
                <Input
                  id="edit-numberOfDvd"
                  type="number"
                  min="0"
                  value={formData.numberOfDvd}
                  onChange={(e) => setFormData({ ...formData, numberOfDvd: clampNonNegative(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-numberOfPrints">Number of Prints</Label>
                <Input
                  id="edit-numberOfPrints"
                  type="number"
                  min="0"
                  value={formData.numberOfPrints}
                  onChange={(e) => setFormData({ ...formData, numberOfPrints: clampNonNegative(e.target.value) })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-paymentTotal">Total Amount</Label>
                <Input
                  id="edit-paymentTotal"
                  type="number"
                  min="0"
                  value={formData.paymentTotal}
                  onChange={(e) => setFormData({ ...formData, paymentTotal: clampNonNegative(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-paymentAdvance">Advance Paid</Label>
                <Input
                  id="edit-paymentAdvance"
                  type="number"
                  min="0"
                  value={formData.paymentAdvance}
                  onChange={(e) => setFormData({ ...formData, paymentAdvance: clampNonNegative(e.target.value) })}
                />
              </div>
            </div>

            <OrderLineItemsEditor
              items={formData.items}
              onChange={(items) => setFormData({ ...formData, items })}
            />

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsEditDialogOpen(false);
                  setEditingOrder(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateOrder.isPending}>
                {updateOrder.isPending ? 'Updating...' : 'Update Order'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
