# Specification

## Summary
**Goal:** Restore the Studio Portal’s previously available Photos/Videos/Events (and related) sections so the app is no longer limited to the Orders-only admin experience, while keeping Orders working at `/admin`.

**Planned changes:**
- Re-add dedicated, working frontend routes and pages for Photos, Videos, and Events, and restore navigation access to them from the header (and/or menu) without requiring manual URL entry.
- Restore additional previously available related sections (as applicable): Special Moments, Favorites, Portfolio, Business Info, Media Groups, ensuring each page renders non-empty English UI scaffolding (title/description/primary actions).
- Update the Home page so it is not exclusively an “Order Management System” page and includes entry points to Photos/Videos/Events at minimum.
- Restore backend actor methods needed by the restored sections so the frontend can list/get data (and allow admin create/upload/update/delete where applicable) without missing-method runtime failures; enforce appropriate access control (public/authenticated/admin).
- Expand the admin UI beyond Orders by restoring admin navigation and functional sections for managing content (e.g., Photos, Videos, Events, Special Moments, Shortlists, Visitors, Footer/User stats as applicable), while keeping existing admin access checks and the Orders section functioning.

**User-visible outcome:** Users can navigate to Photos, Videos, Events (and related restored sections) from the app UI and see working, non-empty pages; admins can manage these areas from `/admin` in addition to continuing to manage Orders.
