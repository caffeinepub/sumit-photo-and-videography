# Specification

## Summary
**Goal:** Add dedicated, shareable individual photo pages with swipeable previous/next navigation while preserving existing like/download behaviors.

**Planned changes:**
- Add a new TanStack Router route for individual photo viewing by ID (e.g., `/photos/$photoId`) that loads and displays the correct photo when opened directly.
- Update the `/photos` gallery behavior so clicking a photo navigates to its individual photo page instead of primarily using a modal for full-size viewing.
- Build an on-page slider/carousel on the individual photo page with Previous/Next controls, touch swipe gestures, and Left/Right keyboard navigation; update the URL as the user moves between photos.
- Add an English “Photo not found” error state for invalid IDs with a link/button back to `/photos`.
- Preserve existing photo actions (Like and Download) on the individual photo page, including the same login-required toast messaging and correct like count/state updates.

**User-visible outcome:** Visitors can open any photo on its own URL, swipe/click/keyboard-navigate to adjacent photos with the URL updating, and still like or download photos with the same behavior as in the gallery.
