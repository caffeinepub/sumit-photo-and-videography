# Specification

## Summary
**Goal:** Add administrator-only access to an Orders section and implement full order management with order status lifecycle and status-based filtering/actions.

**Planned changes:**
- Make the Orders section discoverable in the Admin Panel via an "Orders" tab that shows the existing Orders management UI for admins.
- Block non-admin users from accessing Orders management screens and show the existing non-admin helper experience on the Admin page.
- Add an order status field (at minimum: Pending, Fulfilled, Cancelled) to persisted Order data, with a default initial status for newly created orders.
- Add admin controls in the Orders UI to filter orders by status and quickly mark orders as Fulfilled or Cancelled.
- Add backend canister methods and React Query hooks to update order status and refetch/invalidate the orders list after mutations, with updated TypeScript types (no `any` casts).
- If needed due to state shape changes, add a conditional Motoko migration to initialize a default status for pre-existing orders on upgrade.

**User-visible outcome:** Admins can open the Admin Panel’s Orders tab to view orders, filter by status, and mark orders as Fulfilled or Cancelled; non-admins cannot access Orders management.
