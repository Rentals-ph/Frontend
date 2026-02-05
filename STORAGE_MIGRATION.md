# Storage Structure Migration Guide

This document outlines the migration from the old image storage structure to the new professional storage structure.

## New Storage Structure

```
public/storage/images/
├── users/{id}/avatar.jpg
├── properties/{id}/main.jpg
├── properties/{id}/gallery-1.jpg
├── agents/{id}/avatar.jpg
├── posts/{id}/featured.jpg
└── testimonials/{id}/avatar.jpg
```

## Implementation Status

### ✅ Completed

1. **Directory Structure**
   - Created storage directories for all entity types
   - Added `.gitkeep` files to preserve structure in git

2. **Storage Utilities** (`src/utils/storage.ts`)
   - Path generation functions
   - Storage path parsing
   - Helper functions for common paths

3. **Image Upload Utilities** (`src/utils/imageUpload.ts`)
   - Upload functions with storage path integration
   - Compression integration
   - Progress tracking support

4. **Image Resolver** (`src/utils/imageResolver.ts`)
   - Handles legacy paths, new storage paths, and external URLs
   - Automatic fallback to placeholders
   - Entity-specific resolvers

5. **Updated Components**
   - `ModernPropertyCard` - Uses `resolvePropertyImage()`
   - `AgentListings` page - Uses `resolvePropertyImage()`
   - `AgentProfile` page - Uses `resolveAgentAvatar()` and `resolvePropertyImage()`
   - Property creation flow - Uses new upload utilities

### 🔄 In Progress

1. **Component Updates**
   - Update remaining components to use image resolvers
   - Update agent edit/profile pages
   - Update property detail pages

2. **API Integration**
   - Backend should accept storage paths
   - Backend should store images at specified paths
   - API responses should return storage paths

### 📋 To Do

1. **Backend API Updates**
   - Update image upload endpoints to accept `path`, `entity_type`, `entity_id`
   - Store images at the specified storage paths
   - Return storage paths in API responses

2. **Migration Script**
   - Script to migrate existing images to new structure
   - Update database records with new paths

3. **Documentation**
   - API documentation for image uploads
   - Backend implementation guide

## Usage Examples

### Uploading Property Images

```typescript
import { uploadPropertyMainImage, uploadPropertyGallery } from '@/utils/imageUpload'

// Upload main image
const result = await uploadPropertyMainImage(
  imageFile,
  propertyId,
  '/api/properties/upload',
  token,
  (progress) => console.log(`Upload: ${progress.percent}%`)
)

// Upload gallery images
const galleryResults = await uploadPropertyGallery(
  imageFiles,
  propertyId,
  '/api/properties/gallery',
  token
)
```

### Displaying Images

```typescript
import { resolvePropertyImage, resolveAgentAvatar } from '@/utils/imageResolver'

// In components
<img src={resolvePropertyImage(property.image, property.id)} />
<img src={resolveAgentAvatar(agent.avatar, agent.id)} />
```

## Backend Requirements

The backend API should:

1. **Accept Storage Paths**
   ```json
   {
     "file": "<File>",
     "path": "/storage/images/properties/101/main.jpg",
     "entity_type": "properties",
     "entity_id": "101"
   }
   ```

2. **Store at Specified Path**
   - Save file to `public/storage/images/{entity_type}/{entity_id}/{filename}`
   - Return the storage path in response

3. **Return Storage Paths**
   ```json
   {
     "success": true,
     "path": "/storage/images/properties/101/main.jpg",
     "url": "/storage/images/properties/101/main.jpg"
   }
   ```

## Migration Steps

1. **Frontend (Current)**
   - ✅ Storage utilities created
   - ✅ Upload helpers created
   - ✅ Image resolvers created
   - 🔄 Components being updated

2. **Backend (Required)**
   - Update upload endpoints to accept storage paths
   - Store files at specified paths
   - Return storage paths in responses

3. **Data Migration (Future)**
   - Migrate existing images to new structure
   - Update database records
   - Clean up old image locations

## Benefits

1. **Scalability**: Each entity has its own directory
2. **Organization**: Clear separation by entity type
3. **Cleanup**: Easy to delete all images for an entity
4. **Performance**: Better for CDN and file system
5. **Professional**: Industry-standard structure

## Notes

- Static assets in `public/assets/` remain unchanged
- The new structure is for user-uploaded content only
- Image resolvers handle both old and new paths for backward compatibility
- Placeholder fallbacks ensure images always display

