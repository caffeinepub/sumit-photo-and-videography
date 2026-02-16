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
          <Badge className="badge-pending gap-1.5 px-3 py-1.5 text-sm font-semibold">
            <Clock className="h-4 w-4" />
            Pending
          </Badge>
        );
      case OrderStatus.Fulfilled:
        return (
          <Badge className="badge-fulfilled gap-1.5 px-3 py-1.5 text-sm font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            Fulfilled
          </Badge>
        );
      case OrderStatus.Cancelled:
        return (
          <Badge className="badge-cancelled gap-1.5 px-3 py-1.5 text-sm font-semibold">
            <XCircle className="h-4 w-4" />
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
      <Card className="glass-strong border-accent/30 shadow-lg">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-3xl gradient-heading">Orders Management</CardTitle>
              <CardDescription className="text-base mt-2">
                Manage orders with status tracking and lifecycle management
              </CardDescription>
            </div>
            <Button onClick={openCreateDialog} className="gap-2 bg-gradient-to-r from-accent to-primary hover:shadow-glow-md font-semibold">
              <Plus className="h-4 w-4" />
              Create Order
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Status Filter */}
          <div className="mb-6">
            <Label className="text-sm font-semibold mb-3 block">Filter by Status</Label>
            <div className="flex flex-wrap gap-3">
              <Button
                variant={statusFilter === null ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(null)}
                className={`gap-2 font-semibold ${statusFilter === null ? 'bg-gradient-to-r from-accent to-primary' : 'hover:border-accent/50'}`}
              >
                All Orders
                <Badge variant="secondary" className="ml-1 bg-accent/20">
                  {orders.length}
                </Badge>
              </Button>
              <Button
                variant={statusFilter === OrderStatus.Pending ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(OrderStatus.Pending)}
                className={`gap-2 font-semibold ${statusFilter === OrderStatus.Pending ? 'bg-gradient-to-r from-accent to-primary' : 'hover:border-accent/50'}`}
              >
                <Clock className="h-3.5 w-3.5" />
                Pending
                <Badge variant="secondary" className="ml-1 bg-amber-500/20">
                  {orders.filter((o) => o.status === OrderStatus.Pending).length}
                </Badge>
              </Button>
              <Button
                variant={statusFilter === OrderStatus.Fulfilled ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(OrderStatus.Fulfilled)}
                className={`gap-2 font-semibold ${statusFilter === OrderStatus.Fulfilled ? 'bg-gradient-to-r from-accent to-primary' : 'hover:border-accent/50'}`}
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                Fulfilled
                <Badge variant="secondary" className="ml-1 bg-emerald-500/20">
                  {orders.filter((o) => o.status === OrderStatus.Fulfilled).length}
                </Badge>
              </Button>
              <Button
                variant={statusFilter === OrderStatus.Cancelled ? 'default' : 'outline'}
                size="sm"
                onClick={() => setStatusFilter(OrderStatus.Cancelled)}
                className={`gap-2 font-semibold ${statusFilter === OrderStatus.Cancelled ? 'bg-gradient-to-r from-accent to-primary' : 'hover:border-accent/50'}`}
              >
                <XCircle className="h-3.5 w-3.5" />
                Cancelled
                <Badge variant="secondary" className="ml-1 bg-rose-500/20">
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
                <Card key={order.id.toString()} className="glass border-accent/20 hover:border-accent/40 transition-all">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          {getStatusBadge(order.status)}
                          <span className="text-xs text-muted-foreground font-medium">Order #{order.id.toString()}</span>
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
                              onClick={() => handleUpdateOrderStatus(order.id, OrderStatus.Fulfilled)}
                              disabled={updateOrderStatusMutation.isPending}
                              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              Mark Fulfilled
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUpdateOrderStatus(order.id, OrderStatus.Cancelled)}
                              disabled={updateOrderStatusMutation.isPending}
                              className="gap-1.5 border-rose-500/50 text-rose-600 hover:bg-rose-500/10 font-semibold"
                            >
                              <XCircle className="h-3.5 w-3.5" />
                              Cancel
                            </Button>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openEditDialog(order)}
                          className="hover:bg-accent/10 hover:border-accent/50"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteOrder(order.id)}
                          disabled={deleteOrderMutation.isPending}
                          className="hover:bg-destructive/10 hover:border-destructive/50 hover:text-destructive"
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
        <DialogContent className="glass-strong border-accent/30">
          <DialogHeader>
            <DialogTitle className="text-2xl gradient-heading">Create New Order</DialogTitle>
            <DialogDescription className="text-base">
              Fill in the order details below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="orderDate" className="font-semibold">Order Date *</Label>
              <Input
                id="orderDate"
                type="date"
                value={formData.orderDate}
                onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
                className="control-surface"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fulfillDate" className="font-semibold">Fulfill Date *</Label>
              <Input
                id="fulfillDate"
                type="date"
                value={formData.fulfillDate}
                onChange={(e) => setFormData({ ...formData, fulfillDate: e.target.value })}
                className="control-surface"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerName" className="font-semibold">Customer Name</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Enter customer name"
                className="control-surface"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="numberOfDvd" className="font-semibold">Number of DVDs</Label>
                <Input
                  id="numberOfDvd"
                  type="number"
                  min="0"
                  value={formData.numberOfDvd}
                  onChange={(e) => setFormData({ ...formData, numberOfDvd: e.target.value })}
                  placeholder="0"
                  className="control-surface"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numberOfPrints" className="font-semibold">Number of Prints</Label>
                <Input
                  id="numberOfPrints"
                  type="number"
                  min="0"
                  value={formData.numberOfPrints}
                  onChange={(e) => setFormData({ ...formData, numberOfPrints: e.target.value })}
                  placeholder="0"
                  className="control-surface"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)} className="hover:border-accent/50">
              Cancel
            </Button>
            <Button
              onClick={handleCreateOrder}
              disabled={createOrderMutation.isPending}
              className="bg-gradient-to-r from-accent to-primary hover:shadow-glow-md font-semibold"
            >
              {createOrderMutation.isPending ? 'Creating...' : 'Create Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Order Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="glass-strong border-accent/30">
          <DialogHeader>
            <DialogTitle className="text-2xl gradient-heading">Edit Order</DialogTitle>
            <DialogDescription className="text-base">
              Update the order details below
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-fulfillDate" className="font-semibold">Fulfill Date</Label>
              <Input
                id="edit-fulfillDate"
                type="date"
                value={formData.fulfillDate}
                onChange={(e) => setFormData({ ...formData, fulfillDate: e.target.value })}
                className="control-surface"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-customerName" className="font-semibold">Customer Name</Label>
              <Input
                id="edit-customerName"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="Enter customer name"
                className="control-surface"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-numberOfDvd" className="font-semibold">Number of DVDs</Label>
                <Input
                  id="edit-numberOfDvd"
                  type="number"
                  min="0"
                  value={formData.numberOfDvd}
                  onChange={(e) => setFormData({ ...formData, numberOfDvd: e.target.value })}
                  className="control-surface"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-numberOfPrints" className="font-semibold">Number of Prints</Label>
                <Input
                  id="edit-numberOfPrints"
                  type="number"
                  min="0"
                  value={formData.numberOfPrints}
                  onChange={(e) => setFormData({ ...formData, numberOfPrints: e.target.value })}
                  className="control-surface"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} className="hover:border-accent/50">
              Cancel
            </Button>
            <Button
              onClick={handleUpdateOrder}
              disabled={updateOrderMutation.isPending}
              className="bg-gradient-to-r from-accent to-primary hover:shadow-glow-md font-semibold"
            >
              {updateOrderMutation.isPending ? 'Updating...' : 'Update Order'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
