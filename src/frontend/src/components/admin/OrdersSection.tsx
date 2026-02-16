import { useState } from 'react';
import { useGetOrdersByStatus, useCreateOrder, useUpdateOrder, useUpdateOrderStatus, useDeleteOrder } from '../../hooks/useQueries';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Plus, Pencil, Trash2, Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { dateToTime, timeToDate } from '../../lib/time-utils';
import { OrderStatus } from '../../backend';
import type { Order, CreateOrderRequest, UpdateOrderRequest, UpdateOrderStatusRequest } from '../../backend';

export default function OrdersSection() {
  const [statusFilter, setStatusFilter] = useState<OrderStatus | null>(null);
  const { data: orders = [], isLoading } = useGetOrdersByStatus(statusFilter);
  const createOrderMutation = useCreateOrder();
  const updateOrderMutation = useUpdateOrder();
  const updateOrderStatusMutation = useUpdateOrderStatus();
  const deleteOrderMutation = useDeleteOrder();

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);

  const [formData, setFormData] = useState({
    orderDate: '',
    fulfillDate: '',
    customerName: '',
    numberOfDvd: '',
    numberOfPrints: '',
  });

  const resetForm = () => {
    setFormData({
      orderDate: '',
      fulfillDate: '',
      customerName: '',
      numberOfDvd: '',
      numberOfPrints: '',
    });
  };

  const handleCreateOrder = async () => {
    if (!formData.orderDate || !formData.fulfillDate) {
      toast.error('Please fill in both order date and fulfill date');
      return;
    }

    try {
      const request: CreateOrderRequest = {
        orderDate: dateToTime(formData.orderDate),
        fulfillDate: dateToTime(formData.fulfillDate),
        customerName: formData.customerName || 'N/A',
        numberOfDvd: BigInt(formData.numberOfDvd || '0'),
        numberOfPrints: BigInt(formData.numberOfPrints || '0'),
      };

      await createOrderMutation.mutateAsync(request);
      toast.success('Order created successfully');
      setIsCreateDialogOpen(false);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create order');
    }
  };

  const handleUpdateOrder = async () => {
    if (!editingOrder) return;

    try {
      const request: UpdateOrderRequest = {
        fulfillDate: formData.fulfillDate ? dateToTime(formData.fulfillDate) : undefined,
        customerName: formData.customerName || undefined,
        numberOfDvd: formData.numberOfDvd ? BigInt(formData.numberOfDvd) : undefined,
        numberOfPrints: formData.numberOfPrints ? BigInt(formData.numberOfPrints) : undefined,
      };

      await updateOrderMutation.mutateAsync({ orderId: editingOrder.id, request });
      toast.success('Order updated successfully');
      setIsEditDialogOpen(false);
      setEditingOrder(null);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update order');
    }
  };

  const handleUpdateOrderStatus = async (orderId: bigint, status: OrderStatus) => {
    try {
      const request: UpdateOrderStatusRequest = { status };
      await updateOrderStatusMutation.mutateAsync({ orderId, request });
      toast.success(`Order marked as ${status}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update order status');
    }
  };

  const handleDeleteOrder = async (orderId: bigint) => {
    if (!confirm('Are you sure you want to delete this order?')) return;

    try {
      await deleteOrderMutation.mutateAsync(orderId);
      toast.success('Order deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete order');
    }
  };

  const openEditDialog = (order: Order) => {
    setEditingOrder(order);
    setFormData({
      orderDate: timeToDate(order.orderDate),
      fulfillDate: timeToDate(order.fulfillDate),
      customerName: order.customerName,
      numberOfDvd: order.numberOfDvd.toString(),
      numberOfPrints: order.numberOfPrints.toString(),
    });
    setIsEditDialogOpen(true);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsCreateDialogOpen(true);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.Pending:
        return (
          <Badge variant="outline" className="gap-1 border-yellow-500/50 text-yellow-500">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case OrderStatus.Fulfilled:
        return (
          <Badge variant="outline" className="gap-1 border-green-500/50 text-green-500">
            <CheckCircle2 className="h-3 w-3" />
            Fulfilled
          </Badge>
        );
      case OrderStatus.Cancelled:
        return (
          <Badge variant="outline" className="gap-1 border-red-500/50 text-red-500">
            <XCircle className="h-3 w-3" />
            Cancelled
          </Badge>
        );
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-10 w-10 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Card className="glass-strong border-accent/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">Orders Management</CardTitle>
              <CardDescription className="text-base mt-2">
                Manage orders with status tracking and lifecycle management
              </CardDescription>
            </div>
            <Button onClick={openCreateDialog} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Order
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Status Filter */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block">Filter by Status</Label>
            <div className="flex flex-wrap gap-2">
              <Button
                variant={statusFilter === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(null)}
                className="gap-2"
              >
                All Orders
                <Badge variant="secondary" className="ml-1">
                  {orders.length}
                </Badge>
              </Button>
              <Button
                variant={statusFilter === OrderStatus.Pending ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(OrderStatus.Pending)}
                className="gap-2"
              >
                <Clock className="h-3 w-3" />
                Pending
                <Badge variant="secondary" className="ml-1">
                  {orders.filter((o) => o.status === OrderStatus.Pending).length}
                </Badge>
              </Button>
              <Button
                variant={statusFilter === OrderStatus.Fulfilled ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(OrderStatus.Fulfilled)}
                className="gap-2"
              >
                <CheckCircle2 className="h-3 w-3" />
                Fulfilled
                <Badge variant="secondary" className="ml-1">
                  {orders.filter((o) => o.status === OrderStatus.Fulfilled).length}
                </Badge>
              </Button>
              <Button
                variant={statusFilter === OrderStatus.Cancelled ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(OrderStatus.Cancelled)}
                className="gap-2"
              >
                <XCircle className="h-3 w-3" />
                Cancelled
                <Badge variant="secondary" className="ml-1">
                  {orders.filter((o) => o.status === OrderStatus.Cancelled).length}
                </Badge>
              </Button>
            </div>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg">
                {statusFilter ? `No ${statusFilter.toLowerCase()} orders` : 'No orders yet'}
              </p>
              <p className="text-sm mt-2">
                {statusFilter ? 'Try a different filter' : 'Create your first order to get started'}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <Card key={order.id.toString()} className="glass border-accent/10">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusBadge(order.status)}
                          <span className="text-xs text-muted-foreground">Order #{order.id.toString()}</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Order Date</p>
                            <p className="font-semibold text-lg">
                              {new Date(Number(order.orderDate) / 1_000_000).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Fulfill Date</p>
                            <p className="font-semibold text-lg">
                              {new Date(Number(order.fulfillDate) / 1_000_000).toLocaleDateString()}
                            </p>
                          </div>
                          {order.customerName && order.customerName !== 'N/A' && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Customer Name</p>
                              <p className="font-medium">{order.customerName}</p>
                            </div>
                          )}
                          {(order.numberOfDvd > 0 || order.numberOfPrints > 0) && (
                            <div>
                              <p className="text-sm text-muted-foreground mb-1">Items</p>
                              <p className="font-medium">
                                {order.numberOfDvd > 0 && `${order.numberOfDvd.toString()} DVD${order.numberOfDvd > 1 ? 's' : ''}`}
                                {order.numberOfDvd > 0 && order.numberOfPrints > 0 && ', '}
                                {order.numberOfPrints > 0 && `${order.numberOfPrints.toString()} Print${order.numberOfPrints > 1 ? 's' : ''}`}
                              </p>
                            </div>
                          )}
                        </div>
                        {/* Quick Status Actions */}
                        {order.status === OrderStatus.Pending && (
                          <div className="flex gap-2 pt-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateOrderStatus(order.id, OrderStatus.Fulfilled)}
                              disabled={updateOrderStatusMutation.isPending}
                              className="gap-2 text-green-500 border-green-500/50 hover:bg-green-500/10"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              Mark as Fulfilled
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateOrderStatus(order.id, OrderStatus.Cancelled)}
                              disabled={updateOrderStatusMutation.isPending}
                              className="gap-2 text-red-500 border-red-500/50 hover:bg-red-500/10"
                            >
                              <XCircle className="h-3 w-3" />
                              Mark as Cancelled
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => openEditDialog(order)}
                          className="glass"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteOrder(order.id)}
                          disabled={deleteOrderMutation.isPending}
                          className="glass hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Order Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="glass-strong border-accent/20">
          <DialogHeader>
            <DialogTitle>Create New Order</DialogTitle>
            <DialogDescription>Add a new order with order date and fulfill date</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="create-order-date">Order Date *</Label>
              <Input
                id="create-order-date"
                type="date"
                value={formData.orderDate}
                onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                className="glass"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-fulfill-date">Fulfill Date *</Label>
              <Input
                id="create-fulfill-date"
                type="date"
                value={formData.fulfillDate}
                onChange={(e) => setFormData({ ...formData, fulfillDate: e.target.value })}
                className="glass"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="create-customer-name">Customer Name (Optional)</Label>
              <Input
                id="create-customer-name"
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Enter customer name"
                className="glass"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="create-dvd">Number of DVDs</Label>
                <Input
                  id="create-dvd"
                  type="number"
                  min="0"
                  value={formData.numberOfDvd}
                  onChange={(e) => setFormData({ ...formData, numberOfDvd: e.target.value })}
                  placeholder="0"
                  className="glass"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="create-prints">Number of Prints</Label>
                <Input
                  id="create-prints"
                  type="number"
                  min="0"
                  value={formData.numberOfPrints}
                  onChange={(e) => setFormData({ ...formData, numberOfPrints: e.target.value })}
                  placeholder="0"
                  className="glass"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="glass">
              Cancel
            </Button>
            <Button onClick={handleCreateOrder} disabled={createOrderMutation.isPending}>
              {createOrderMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass-strong border-accent/20">
          <DialogHeader>
            <DialogTitle>Edit Order</DialogTitle>
            <DialogDescription>Update order details</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-order-date">Order Date (Read-only)</Label>
              <Input
                id="edit-order-date"
                type="date"
                value={formData.orderDate}
                disabled
                className="glass opacity-60"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-fulfill-date">Fulfill Date</Label>
              <Input
                id="edit-fulfill-date"
                type="date"
                value={formData.fulfillDate}
                onChange={(e) => setFormData({ ...formData, fulfillDate: e.target.value })}
                className="glass"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-customer-name">Customer Name</Label>
              <Input
                id="edit-customer-name"
                type="text"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Enter customer name"
                className="glass"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-dvd">Number of DVDs</Label>
                <Input
                  id="edit-dvd"
                  type="number"
                  min="0"
                  value={formData.numberOfDvd}
                  onChange={(e) => setFormData({ ...formData, numberOfDvd: e.target.value })}
                  placeholder="0"
                  className="glass"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-prints">Number of Prints</Label>
                <Input
                  id="edit-prints"
                  type="number"
                  min="0"
                  value={formData.numberOfPrints}
                  onChange={(e) => setFormData({ ...formData, numberOfPrints: e.target.value })}
                  placeholder="0"
                  className="glass"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="glass">
              Cancel
            </Button>
            <Button onClick={handleUpdateOrder} disabled={updateOrderMutation.isPending}>
              {updateOrderMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Order
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
