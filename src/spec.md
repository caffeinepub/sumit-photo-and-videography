# Specification

## Summary
**Goal:** Implement complete photo/video upload functionality with event and order management system, connecting all frontend forms to backend storage.

**Planned changes:**
- Add backend handlers for photo upload (with name, description, category, and blob storage)
- Add backend handlers for video upload (with name, description, and blob storage)
- Add backend handlers for event creation (with name, description, date, optional password, and optional image)
- Add backend handlers for order creation (with customer details, line items, delivery address, and payment info)
- Connect PhotoUploadSection to backend with multiple file selection and upload progress
- Connect VideoUploadSection to backend with multiple file selection and upload progress
- Connect EventManagementSection create form to backend with optional image upload
- Connect OrdersSection create form to backend with line items and payment validation
- Update PhotosViewer to fetch and display photos from backend storage
- Update VideosPage to fetch and display videos with HTML5 player from backend storage

**User-visible outcome:** Users can upload multiple photos and videos with descriptions, create events with optional images, create orders with multiple line items and payment details, and view all uploaded media in respective galleries.
