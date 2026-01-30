# Next.js Migration Guide

This document outlines the conversion from Vite + React Router to Next.js.

## Completed ✅

1. **Configuration Files**
   - Updated `package.json` with Next.js dependencies
   - Created `next.config.js`
   - Updated `tsconfig.json` for Next.js
   - Updated `tailwind.config.js` for Next.js

2. **App Structure**
   - Created `src/app/layout.tsx` (root layout)
   - Created `src/app/page.tsx` (home page)
   - Created `src/app/about/page.tsx`
   - Created `src/app/properties/page.tsx`
   - Created `src/app/property/[id]/page.tsx`

3. **Component Updates**
   - Updated `Navbar.tsx` to use Next.js navigation
   - Updated `Footer.tsx` to use Next.js Link
   - Updated `VerticalPropertyCard.tsx` to use Next.js router
   - Updated `HorizontalPropertyCard.tsx` to use Next.js router
   - Updated `Hero.tsx` to use Next.js router
   - Updated `BlogCard.tsx` to use Next.js Link
   - Updated `Blogs.tsx` to use Next.js Link
   - Updated `FeaturedProperties.tsx` to use Next.js Link

4. **API Client**
   - Updated `api/client.ts` to use `process.env.NEXT_PUBLIC_API_BASE_URL` instead of `import.meta.env.VITE_API_BASE_URL`

## Remaining Tasks

### Pages to Convert

**Note:** Old page files have been moved to `src/pages-old/` to avoid conflicts with Next.js App Router.

1. **Blog Pages**
   - [ ] `src/app/blog/page.tsx` (convert from `src/pages-old/BlogPage.tsx`)
   - [ ] `src/app/blog/[id]/page.tsx` (convert from `src/pages-old/BlogDetailsPage.tsx`)

2. **Contact & Other Pages**
   - [ ] `src/app/contact/page.tsx` (convert from `src/pages-old/ContactUsPage.tsx`)
   - [ ] `src/app/news/page.tsx` (convert from `src/pages-old/NewsPage.tsx`)
   - [ ] `src/app/rent-managers/page.tsx` (convert from `src/pages-old/RentManagersPage.tsx`)
   - [ ] `src/app/rent-managers/[id]/page.tsx` (convert from `src/pages-old/RentManagerDetailsPage.tsx`)

3. **Admin Pages**
   - [ ] `src/app/admin/page.tsx` (convert from `src/pages-old/admin/AdminDashboard.tsx`)
   - [ ] `src/app/admin/agents/page.tsx` (convert from `src/pages-old/admin/AgentsPage.tsx`)
   - [ ] `src/app/admin/properties/page.tsx` (convert from `src/pages-old/admin/PropertiesPage.tsx`)
   - [ ] `src/app/admin/revenue/page.tsx` (convert from `src/pages-old/admin/RevenuePage.tsx`)
   - [ ] `src/app/admin/users/page.tsx` (convert from `src/pages-old/admin/UserManagementPage.tsx`)

4. **Agent Pages**
   - [ ] `src/app/agent/page.tsx` (convert from `src/pages-old/agent/AgentDashboard.tsx`)
   - [ ] `src/app/agent/account/page.tsx` (convert from `src/pages-old/agent/AgentAccount.tsx`)
   - [ ] `src/app/agent/profile/page.tsx` (convert from `src/pages-old/agent/AgentMyProfile.tsx`)
   - [ ] `src/app/agent/edit-profile/page.tsx` (convert from `src/pages-old/agent/AgentEditProfile.tsx`)
   - [ ] `src/app/agent/inbox/page.tsx` (convert from `src/pages-old/agent/AgentInbox.tsx`)
   - [ ] `src/app/agent/downloadables/page.tsx` (convert from `src/pages-old/agent/AgentDownloadables.tsx`)
   - [ ] `src/app/agent/digital-card/page.tsx` (convert from `src/pages-old/agent/AgentDigitalCard.tsx`)
   - [ ] `src/app/agent/change-password/page.tsx` (convert from `src/pages-old/agent/AgentChangePassword.tsx`)
   - [ ] `src/app/agent/listings/page.tsx` (convert from `src/pages-old/agent/AgentMyListings.tsx`)
   - [ ] `src/app/agent/tracker/page.tsx` (convert from `src/pages-old/agent/AgentRentalTracker.tsx`)
   - [ ] `src/app/agent/rent-estimate/page.tsx` (convert from `src/pages-old/agent/AgentRentEstimate.tsx`)
   - [ ] `src/app/agent/blogs/page.tsx` (convert from `src/pages-old/agent/AgentShareBlogs.tsx`)
   - [ ] `src/app/agent/create-listing/page.tsx` (convert from `src/pages-old/agent/AgentCreateListingCategory.tsx`)
   - [ ] `src/app/agent/create-listing/details/page.tsx` (convert from `src/pages-old/agent/AgentCreateListingDetails.tsx`)
   - [ ] `src/app/agent/create-listing/location/page.tsx` (convert from `src/pages-old/agent/AgentCreateListingLocation.tsx`)
   - [ ] `src/app/agent/create-listing/property-images/page.tsx` (convert from `src/pages-old/agent/AgentCreateListingPropertyImages.tsx`)
   - [ ] `src/app/agent/create-listing/pricing/page.tsx` (convert from `src/pages-old/agent/AgentCreateListingPricing.tsx`)
   - [ ] `src/app/agent/create-listing/attributes/page.tsx` (convert from `src/pages-old/agent/AgentCreateListingAttributes.tsx`)
   - [ ] `src/app/agent/create-listing/owner-info/page.tsx` (convert from `src/pages-old/agent/AgentCreateListingOwnerInfo.tsx`)
   - [ ] `src/app/agent/create-listing/publish/page.tsx` (convert from `src/pages-old/agent/AgentCreateListingPublish.tsx`)

### Components to Update

1. **Agent Components**
   - [ ] `AgentSidebar.tsx` - Update to use Next.js navigation
   - [ ] `AppSidebar.tsx` - Update to use Next.js navigation
   - [ ] `DashboardHeader.tsx` - Update to use Next.js router

2. **Other Components**
   - Check all components in `src/components` for React Router usage

### Key Conversion Patterns

#### 1. React Router → Next.js Navigation

**Before:**
```tsx
import { Link, useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom'

const navigate = useNavigate()
const { id } = useParams()
const location = useLocation()
const [searchParams] = useSearchParams()

<Link to="/path">Link</Link>
navigate('/path')
```

**After:**
```tsx
'use client'  // Add this for client components

import Link from 'next/link'
import { useRouter, useParams, usePathname, useSearchParams } from 'next/navigation'

const router = useRouter()
const params = useParams()
const pathname = usePathname()
const searchParams = useSearchParams()

<Link href="/path">Link</Link>
router.push('/path')
```

#### 2. Dynamic Routes

**Before:**
```
/property/:id → PropertyDetailsPage
```

**After:**
```
/property/[id]/page.tsx → PropertyDetailsPage
```

#### 3. Environment Variables

**Before:**
```tsx
const API_URL = import.meta.env.VITE_API_BASE_URL
```

**After:**
```tsx
const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL
```

#### 4. Client Components

All components that use hooks (useState, useEffect, useRouter, etc.) need `'use client'` directive at the top.

#### 5. CSS Imports

CSS imports should work the same way, but make sure they're imported in the component files, not in the layout (unless they're global).

### Environment Variables

Create a `.env.local` file:
```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
```

### Running the Application

1. Install dependencies:
```bash
npm install
```

2. Run development server:
```bash
npm run dev
```

3. Build for production:
```bash
npm run build
npm start
```

### Files to Remove (After Migration Complete)

- `vite.config.ts`
- `index.html`
- `src/main.tsx`
- `src/App.tsx`
- `src/react-router-dom.d.ts`
- `src/vite-env.d.ts`
- `tsconfig.node.json` (if not needed)

### Notes

- Next.js uses file-based routing in the `app` directory
- All pages should be in `src/app/` directory
- Dynamic routes use `[param]` folder names
- Client components need `'use client'` directive
- Server components are the default (no directive needed)
- Use `next/image` for optimized images (optional but recommended)

