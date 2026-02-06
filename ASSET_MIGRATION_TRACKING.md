# Asset Migration Tracking

This document tracks the migration of images from `/public/assets/images/` to `/public/storage/images/` following the storage structure.

## Migration Summary

**Date**: 2026-02-06  
**Total Files Moved**: 9  
**Total Files Skipped**: 1 (placeholder)

## Moved Images

### Testimonials

| Original Path | New Path | Testimonial ID | Filename | Status |
|-------------|----------|---------------|----------|--------|
| `/assets/images/testimonials/testimonial-elaine.png` | `/storage/images/testimonials/1/avatar.png` | 1 | `avatar.png` | ✅ Moved |
| `/assets/images/testimonials/elaine-10.png` | `/storage/images/testimonials/1/avatar-10.png` | 1 | `avatar-10.png` | ✅ Moved |
| `/assets/images/testimonials/testimonial-javie.png` | `/storage/images/testimonials/2/avatar.png` | 2 | `avatar.png` | ✅ Moved |
| `/assets/images/testimonials/javie-10.png` | `/storage/images/testimonials/2/avatar-10.png` | 2 | `avatar-10.png` | ✅ Moved |
| `/assets/images/testimonials/testimonial-rica.png` | `/storage/images/testimonials/3/avatar.png` | 3 | `avatar.png` | ✅ Moved |
| `/assets/images/testimonials/rica-10.png` | `/storage/images/testimonials/3/avatar-10.png` | 3 | `avatar-10.png` | ✅ Moved |

### Blog Posts

| Original Path | New Path | Post ID | Filename | Status |
|-------------|----------|---------|----------|--------|
| `/assets/images/blog/blog-main.png` | `/storage/images/posts/1/featured.png` | 1 | `featured.png` | ✅ Moved |
| `/assets/images/blog/blog-image.png` | `/storage/images/posts/2/featured.png` | 2 | `featured.png` | ✅ Moved |
| `/assets/images/blog/blog-image2.png` | `/storage/images/posts/3/featured.png` | 3 | `featured.png` | ✅ Moved |

## Skipped Images

| File | Reason |
|------|--------|
| `testimonial-person.png` | Placeholder image - should remain in assets as fallback |

## Code References

### Asset Manifest (`public/assets/asset-manifest.json`)

The following entries in `asset-manifest.json` reference the moved images:

**Testimonials:**
- `TESTIMONIAL_ELAINE` → `/assets/images/testimonials/testimonial-elaine.png` (now at `/storage/images/testimonials/1/avatar.png`)
- `TESTIMONIAL_ELAINE_10` → `/assets/images/testimonials/elaine-10.png` (now at `/storage/images/testimonials/1/avatar-10.png`)
- `TESTIMONIAL_JAVIE` → `/assets/images/testimonials/testimonial-javie.png` (now at `/storage/images/testimonials/2/avatar.png`)
- `TESTIMONIAL_JAVIE_10` → `/assets/images/testimonials/javie-10.png` (now at `/storage/images/testimonials/2/avatar-10.png`)
- `TESTIMONIAL_RICA` → `/assets/images/testimonials/testimonial-rica.png` (now at `/storage/images/testimonials/3/avatar.png`)
- `TESTIMONIAL_RICA_10` → `/assets/images/testimonials/rica-10.png` (now at `/storage/images/testimonials/3/avatar-10.png`)

**Blog:**
- `BLOG_IMAGE_MAIN` → `/assets/images/blog/blog-main.png` (now at `/storage/images/posts/1/featured.png`)
- `BLOG_IMAGE_1` → `/assets/images/blog/blog-image.png` (now at `/storage/images/posts/2/featured.png`)
- `BLOG_IMAGE_2` → `/assets/images/blog/blog-image2.png` (now at `/storage/images/posts/3/featured.png`)

### Source Code Files

**Blog Images:**
- `src/components/common/BlogCard.tsx` - Uses `ASSETS.BLOG_IMAGE_*` constants
- `src/components/home/Blogs.tsx` - Uses `ASSETS.BLOG_IMAGE_MAIN` as fallback
- `src/app/blog/page.tsx` - Uses `ASSETS.BLOG_IMAGE_*` constants

**Testimonials:**
- Currently referenced in `asset-manifest.json` but may be used via API responses

## Usage Recommendations

### For Testimonials

Instead of using asset constants, use the storage paths:

```typescript
// Old way (via assets)
import { ASSETS } from '@/utils/assets'
const avatar = ASSETS.TESTIMONIAL_ELAINE

// New way (via storage)
import { StoragePaths, getImageUrl } from '@/utils/storage'
import { resolveTestimonialAvatar } from '@/utils/imageResolver'

// Option 1: Direct storage path
const avatar = StoragePaths.testimonialAvatar(1) // /storage/images/testimonials/1/avatar.png

// Option 2: Using resolver (handles fallbacks)
const avatar = resolveTestimonialAvatar(testimonial.avatar, testimonial.id)
```

### For Blog Posts

```typescript
// Old way (via assets)
import { ASSETS } from '@/utils/assets'
const image = ASSETS.BLOG_IMAGE_MAIN

// New way (via storage)
import { StoragePaths } from '@/utils/storage'
import { resolveImageUrl } from '@/utils/imageResolver'

// Option 1: Direct storage path
const image = StoragePaths.postFeatured(1) // /storage/images/posts/1/featured.png

// Option 2: Using resolver (handles API responses)
const image = resolveImageUrl(blog.image, { 
  placeholder: StoragePaths.postFeatured(blog.id) 
})
```

## Next Steps

1. ✅ **Migration Complete** - Images moved to storage structure
2. ⏳ **Update Asset Manifest** - Update or remove entries for moved images
3. ⏳ **Update Code References** - Replace asset constants with storage paths where appropriate
4. ⏳ **Test Application** - Verify images load correctly
5. ⏳ **Clean Up** - Remove original files from `/public/assets/images/` after verification

## Important Notes

- **Original files are still in `/public/assets/images/`** - They were copied, not moved
- **Asset manifest still references old paths** - Update these or keep for backward compatibility
- **Testimonial IDs**: 1=Elaine, 2=Javie, 3=Rica (based on common usage patterns)
- **Blog Post IDs**: 1=main, 2=image1, 3=image2 (these should match actual blog post IDs from your database)

## Verification

To verify the migration:

```bash
# Check storage directories
ls -la public/storage/images/testimonials/
ls -la public/storage/images/posts/

# Check original files still exist
ls -la public/assets/images/testimonials/
ls -la public/assets/images/blog/
```

## Rollback

If you need to rollback:
1. The original files are still in `/public/assets/images/`
2. Simply delete the files from `/public/storage/images/`
3. No code changes needed if asset manifest still points to old paths

