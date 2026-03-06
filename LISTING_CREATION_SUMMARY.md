# Listing Creation Summary

## Overview
The Rental.ph platform supports two methods for creating property listings:
1. **Manual Listing** - Traditional form-based approach
2. **AI Listing Assistant** - Conversational AI-guided approach

---

## 1. Manual Listing Creation

### Flow
- **Entry Point**: `/agent/create-listing/manual` or `/broker/create-listing/basic-info`
- **Form Structure**: Single-page form with 7 sections displayed sequentially
- **Progress Tracking**: Visual progress indicator showing completion percentage

### Sections
1. **Category** - Select property type (Apartment/Condo, House, Townhouse, Studio, Bedspace, Commercial, Office, Warehouse)
2. **Details** - Title, description, bedrooms, bathrooms, garage, floor area, lot area
   - Includes AI description generation button (optional)
3. **Location** - Country, state/province, city, street address with map integration
   - Auto-geocoding from street address
   - Interactive map for location selection
4. **Property Images** - Upload multiple images (minimum 5 recommended)
   - Drag-and-drop or file picker
   - Thumbnail previews
   - Optional video URL
5. **Pricing** - Price amount and type (Monthly, Weekly, Daily, Yearly)
6. **Attributes** - Amenities selection (checkboxes)
7. **Review & Publish** - Summary view with edit links, save draft, and publish button

### Key Features
- **Data Persistence**: Uses React Context (`CreateListingContext`) to maintain form state
- **Image Processing**: Automatic compression (max 1920x1920px, 2MB) before upload
- **Upload Progress**: Real-time progress bar during submission
- **Validation**: Requires category, title, price, and minimum 5 images to publish
- **AI Description**: Optional AI-generated description using property details

### Detailed Process Flow

#### Initialization
1. User navigates to `/agent/create-listing/manual`
2. `CreateListingPage` component renders `CreateListingChoice`
3. User selects "Manual Listing" option
4. `ManualListingForm` component loads
5. `CreateListingContext` initializes with default empty values
6. Form state synced to context on mount

#### Data Entry Process
1. **Category Selection**
   - User selects from dropdown (8 property types)
   - State updates: `setCategory(value)`
   - Context sync: `updateData({ category })`

2. **Property Details Entry**
   - User fills title, description, bedrooms, bathrooms, garage, floor area, lot area
   - Each field updates local state immediately
   - Optional: Click "AI Generate" button for description
     - API call: `POST /api/generate-property-description`
     - Returns AI-generated description
     - Updates description field

3. **Location Selection**
   - User selects country (default: Philippines)
   - User selects state/province from dropdown
   - City dropdown populates based on selected state
   - User enters street address
   - **Auto-geocoding Process** (when street address > 10 chars):
     - API call: `GET https://nominatim.openstreetmap.org/search`
     - Extracts latitude, longitude, state, city from response
     - Updates location fields automatically
   - User can also use interactive map (`LocationMap` component)
     - Click on map sets coordinates
     - Reverse geocoding populates address fields

4. **Image Upload**
   - User drags/drops or selects files via file picker
   - Files filtered to image types only
   - **Thumbnail Generation Process**:
     - Each image processed: `createThumbnail(file, 200)`
     - Thumbnails stored in component state
   - Images stored in state array
   - User can remove images (revokes blob URLs)

5. **Pricing Entry**
   - User enters price amount
   - User selects price type (Monthly/Weekly/Daily/Yearly)
   - Both values stored in state

6. **Amenities Selection**
   - User checks/unchecks amenity checkboxes
   - Amenities array updated: `setAmenities(prev => [...prev, amenity])`

#### Submission Process
1. **Pre-submission Validation**
   - Check: `category`, `title`, `price` are filled
   - Check: At least 5 images uploaded
   - Disable publish button if validation fails

2. **Image Compression**
   - Set `isCompressing = true`
   - Compress first image: `compressImage(images[0], { maxWidth: 1920, maxHeight: 1920, quality: 0.85, maxSizeMB: 2 })`
   - If compression fails, use original image
   - Set `isCompressing = false`

3. **FormData Construction**
   - Create new `FormData` object
   - Append all property fields:
     - `title`, `description`, `type`, `location`, `price`, `price_type`
     - `bedrooms`, `bathrooms`, `garage`, `area`, `lot_area`, `floor_area_unit`
     - `amenities` (JSON stringified)
     - Location data: `latitude`, `longitude`, `country`, `state_province`, `city`, `street_address`
     - `video_url` (if provided)
     - `image` (compressed first image)

4. **Upload with Progress**
   - Get auth token from localStorage
   - Call `uploadWithProgress()` utility:
     - Uses XMLHttpRequest for progress tracking
     - Uploads to: `${API_BASE_URL}/properties`
     - Progress callback updates `uploadProgress` state
     - Returns response object

5. **Response Handling**
   - Parse JSON response
   - If success:
     - Reset context data: `resetData()`
     - Set upload progress to 100%
     - Show success alert
     - Redirect to `/agent/listings`
   - If error:
     - Display error message
     - Reset upload progress to 0

6. **Cleanup**
   - Revoke all blob URLs for thumbnails
   - Clear form state

---

## 2. AI Listing Assistant

### Flow
- **Entry Point**: `/agent/listing-assistant` or `/broker/listing-assistant`
- **Interface**: Chat-based conversational UI with step-by-step guidance
- **Conversation Management**: Each session creates a unique conversation ID for state persistence

### Step-by-Step Process

#### Required Fields (Guided Flow)
1. **Property Name** - User provides listing title
2. **Property Type** - Button selection (house, condo, apartment, townhouse, studio, bedspace, warehouse, office, lot, commercial)
3. **Location** - Text input or map selection with "Use current position" option
4. **Price** - Numeric input (supports shorthand: "7.5M", "25k")
5. **Price Type** - Button selection (Monthly, Weekly, Daily, Yearly)
6. **Bedrooms** - Button selection (Studio, 1, 2, 3, 4, 5+)
7. **Bathrooms** - Button selection (1, 2, 3, 4+)
8. **Area (sqm)** - Optional numeric input (can skip)

#### Optional Fields (After Required Fields)
- User can choose to add more details or skip
- Optional fields include: address, lot area, parking slots, amenities, furnishing status, HOA fee, property age, floor level, title type, listing status
- Multi-select amenities with custom input option
- Guided through each selected optional field

#### Images & Description
- **Images**: Upload step with file picker (max 30 images, 10MB each)
- **Description**: 
  - Optional text input for agent context
  - AI-generated descriptions with 5 template styles:
    - Narrative (flowing paragraphs)
    - Bulleted (feature-focused list)
    - Short (punchy 2-3 sentences)
    - Luxury (sophisticated high-end)
    - Storytelling (emotional narrative)
  - Can switch templates to preview different styles

#### Review & Submit
- Final review of all collected data
- Submit button creates actual property listing
- Success popup with options to create another or view listings

### Key Features
- **AI-Powered Extraction**: Uses AI (Gemini/Groq/OpenAI) to extract property data from natural language
- **Context Awareness**: AI understands conversation context and doesn't re-ask filled fields
- **Auto-Save**: Automatically saves progress after each step (debounced)
- **Button-Driven Flow**: Quick selection buttons for common choices (property type, bedrooms, etc.)
- **Progress Tracking**: Visual progress bar showing completion percentage
- **Data Validation**: Real-time validation with warnings for unusual values
- **Conversation History**: Maintains full message history for context
- **Resume Capability**: Can resume previous conversations using conversation ID

### Backend Architecture
- **Service Layer**: `ListingAssistantService` handles AI communication and data extraction
- **Controller**: `ListingAssistantController` manages API endpoints
- **Model**: `ListingAssistantConversation` stores conversation state in database
- **AI Integration**: Supports multiple providers (Gemini, Groq, OpenAI) via unified interface

### API Endpoints
- `POST /listing/assistant/new` - Start new conversation
- `POST /listing/assistant` - Process user message
- `POST /listing/assistant/{id}/set-field` - Set field via button
- `POST /listing/assistant/{id}/upload-images` - Upload images
- `POST /listing/assistant/{id}/generate-description` - Generate AI description
- `POST /listing/assistant/{id}/submit` - Submit listing
- `GET /listing/assistant/{id}` - Get conversation state
- `POST /listing/assistant/{id}/auto-save` - Save draft progress

---

## Comparison

| Feature | Manual Listing | AI Listing Assistant |
|---------|---------------|---------------------|
| **User Experience** | Form-based, all fields visible | Conversational, step-by-step |
| **Speed** | Faster for experienced users | Guided for new users |
| **Flexibility** | Full control over all fields | Guided flow with optional fields |
| **AI Features** | Optional description generation | Full AI extraction & generation |
| **Learning Curve** | Requires knowledge of all fields | Beginner-friendly, guided |
| **Data Entry** | Manual typing/selection | Natural language + buttons |
| **Progress Saving** | Context-based (session) | Database-backed (persistent) |
| **Image Upload** | Single batch upload | Step-by-step upload |
| **Description** | Manual or AI-generated | Multiple AI template styles |

---

## Technical Stack

### Frontend
- **Framework**: Next.js with React
- **State Management**: React Context API (Manual), Component State + API (AI Assistant)
- **UI Components**: Custom components with Tailwind CSS
- **Maps**: Leaflet.js for location selection
- **Image Processing**: Client-side compression utilities

### Backend
- **Framework**: Laravel (PHP)
- **AI Integration**: OpenAI-compatible client (supports Gemini, Groq, OpenAI)
- **Storage**: Laravel Storage for images
- **Database**: MySQL/PostgreSQL for conversation persistence
- **API**: RESTful endpoints with OpenAPI documentation

---

## Status
Both listing creation methods are **fully functional** and integrated into the platform. Users can choose their preferred method based on their needs and experience level.

