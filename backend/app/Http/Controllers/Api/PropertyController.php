<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Property;
use Illuminate\Http\Request;
use OpenApi\Attributes as OA;

class PropertyController extends Controller
{
    #[OA\Get(
        path: "/properties/featured",
        summary: "Get featured properties",
        tags: ["Properties"],
        responses: [
            new OA\Response(
                response: 200,
                description: "List of featured properties",
                content: new OA\JsonContent(
                    type: "array",
                    items: new OA\Items(type: "object")
                )
            ),
        ]
    )]
    public function featured()
    {
        $properties = Property::where('is_featured', true)
            ->with('rentManager')
            ->latest()
            ->take(10)
            ->get();

        return response()->json($properties);
    }

    #[OA\Get(
        path: "/properties",
        summary: "Get list of properties",
        tags: ["Properties"],
        parameters: [
            new OA\Parameter(
                name: "type",
                in: "query",
                required: false,
                description: "Filter by property type",
                schema: new OA\Schema(type: "string")
            ),
            new OA\Parameter(
                name: "location",
                in: "query",
                required: false,
                description: "Filter by location",
                schema: new OA\Schema(type: "string")
            ),
            new OA\Parameter(
                name: "search",
                in: "query",
                required: false,
                description: "Search in title and description",
                schema: new OA\Schema(type: "string")
            ),
            new OA\Parameter(
                name: "page",
                in: "query",
                required: false,
                description: "Page number for pagination",
                schema: new OA\Schema(type: "integer", default: 1)
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Paginated list of properties",
                content: new OA\JsonContent(
                    type: "object",
                    properties: [
                        new OA\Property(property: "data", type: "array", items: new OA\Items(type: "object")),
                        new OA\Property(property: "current_page", type: "integer"),
                        new OA\Property(property: "per_page", type: "integer"),
                        new OA\Property(property: "total", type: "integer"),
                    ]
                )
            ),
        ]
    )]
    public function index(Request $request)
    {
        $query = Property::with('rentManager');

        if ($request->has('type')) {
            $query->where('type', $request->type);
        }

        if ($request->has('location')) {
            $query->where('location', 'like', '%' . $request->location . '%');
        }

        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('title', 'like', '%' . $request->search . '%')
                  ->orWhere('description', 'like', '%' . $request->search . '%');
            });
        }

        $properties = $query->latest()->paginate(12);

        return response()->json($properties);
    }

    #[OA\Get(
        path: "/properties/{id}",
        summary: "Get property by ID",
        tags: ["Properties"],
        parameters: [
            new OA\Parameter(
                name: "id",
                in: "path",
                required: true,
                description: "Property ID",
                schema: new OA\Schema(type: "integer")
            ),
        ],
        responses: [
            new OA\Response(
                response: 200,
                description: "Property details",
                content: new OA\JsonContent(type: "object")
            ),
            new OA\Response(
                response: 404,
                description: "Property not found",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "No query results for model [App\\Models\\Property] {id}"),
                    ]
                )
            ),
        ]
    )]
    public function show($id)
    {
        $property = Property::with('rentManager')->findOrFail($id);
        return response()->json($property);
    }

    #[OA\Post(
        path: "/properties",
        summary: "Create a new property",
        tags: ["Properties"],
        security: [["sanctum" => []]],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(
                    required: ["title", "description", "type", "location", "price", "bedrooms", "bathrooms"],
                    properties: [
                        new OA\Property(property: "title", type: "string"),
                        new OA\Property(property: "description", type: "string"),
                        new OA\Property(property: "type", type: "string"),
                        new OA\Property(property: "location", type: "string"),
                        new OA\Property(property: "price", type: "number"),
                        new OA\Property(property: "price_type", type: "string"),
                        new OA\Property(property: "bedrooms", type: "integer"),
                        new OA\Property(property: "bathrooms", type: "integer"),
                        new OA\Property(property: "garage", type: "integer", nullable: true),
                        new OA\Property(property: "area", type: "integer", nullable: true),
                        new OA\Property(property: "lot_area", type: "integer", nullable: true),
                        new OA\Property(property: "floor_area_unit", type: "string", nullable: true),
                        new OA\Property(property: "amenities", type: "string", nullable: true),
                        new OA\Property(property: "furnishing", type: "string", nullable: true),
                        new OA\Property(property: "image", type: "string", format: "binary", nullable: true),
                        new OA\Property(property: "video_url", type: "string", nullable: true),
                        new OA\Property(property: "latitude", type: "string", nullable: true),
                        new OA\Property(property: "longitude", type: "string", nullable: true),
                        new OA\Property(property: "zoom_level", type: "string", nullable: true),
                        new OA\Property(property: "country", type: "string", nullable: true),
                        new OA\Property(property: "state_province", type: "string", nullable: true),
                        new OA\Property(property: "city", type: "string", nullable: true),
                        new OA\Property(property: "street_address", type: "string", nullable: true),
                        new OA\Property(property: "owner_firstname", type: "string", nullable: true),
                        new OA\Property(property: "owner_lastname", type: "string", nullable: true),
                        new OA\Property(property: "owner_phone", type: "string", nullable: true),
                        new OA\Property(property: "owner_email", type: "string", nullable: true),
                        new OA\Property(property: "owner_country", type: "string", nullable: true),
                        new OA\Property(property: "owner_state", type: "string", nullable: true),
                        new OA\Property(property: "owner_city", type: "string", nullable: true),
                        new OA\Property(property: "owner_street_address", type: "string", nullable: true),
                        new OA\Property(property: "rapa_document", type: "string", format: "binary", nullable: true),
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Property created successfully",
                content: new OA\JsonContent(type: "object")
            ),
            new OA\Response(
                response: 401,
                description: "Unauthenticated",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "message", type: "string", example: "Unauthenticated."),
                    ]
                )
            ),
        ]
    )]
    public function store(Request $request)
    {
        $user = $request->user();
        
        if (!$user || !$user->isAgent()) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Agent authentication required.',
            ], 401);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'type' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'price_type' => 'nullable|string|in:Monthly,Weekly,Daily,Yearly',
            'bedrooms' => 'required|integer|min:0',
            'bathrooms' => 'required|integer|min:0',
            'garage' => 'nullable|integer|min:0',
            'area' => 'nullable|integer|min:0',
            'lot_area' => 'nullable|integer|min:0',
            'floor_area_unit' => 'nullable|string|in:Square Meters,Square Feet',
            'amenities' => 'nullable|string',
            'furnishing' => 'nullable|string|in:Fully Furnished,Semi Furnished,Unfurnished',
            'image' => 'nullable|image|mimes:jpeg,jpg,png|max:10240',
            'video_url' => 'nullable|url|max:500',
            'latitude' => 'nullable|string|max:50',
            'longitude' => 'nullable|string|max:50',
            'zoom_level' => 'nullable|string|max:10',
            'country' => 'nullable|string|max:100',
            'state_province' => 'nullable|string|max:100',
            'city' => 'nullable|string|max:100',
            'street_address' => 'nullable|string',
            'owner_firstname' => 'nullable|string|max:100',
            'owner_lastname' => 'nullable|string|max:100',
            'owner_phone' => 'nullable|string|max:50',
            'owner_email' => 'nullable|email|max:255',
            'owner_country' => 'nullable|string|max:100',
            'owner_state' => 'nullable|string|max:100',
            'owner_city' => 'nullable|string|max:100',
            'owner_street_address' => 'nullable|string',
            'rapa_document' => 'nullable|file|mimes:pdf,doc,docx|max:10240',
        ]);

        // Handle image upload
        $imagePath = null;
        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $imagePath = $file->storeAs('properties/images', $fileName, 'public');
        }

        // Handle RAPA document upload
        $rapaPath = null;
        if ($request->hasFile('rapa_document')) {
            $file = $request->file('rapa_document');
            $fileName = time() . '_' . $file->getClientOriginalName();
            $rapaPath = $file->storeAs('properties/rapa', $fileName, 'public');
        }

        // Parse amenities if it's a JSON string
        $amenities = null;
        if (isset($validated['amenities']) && is_string($validated['amenities'])) {
            $amenities = json_decode($validated['amenities'], true);
        }

        $property = Property::create([
            'title' => $validated['title'],
            'description' => $validated['description'],
            'type' => $validated['type'],
            'location' => $validated['location'],
            'price' => $validated['price'],
            'price_type' => $validated['price_type'] ?? 'Monthly',
            'bedrooms' => $validated['bedrooms'],
            'bathrooms' => $validated['bathrooms'],
            'garage' => $validated['garage'] ?? 0,
            'area' => $validated['area'] ?? null,
            'lot_area' => $validated['lot_area'] ?? null,
            'floor_area_unit' => $validated['floor_area_unit'] ?? 'Square Meters',
            'amenities' => $amenities,
            'furnishing' => $validated['furnishing'] ?? null,
            'image' => $imagePath,
            'video_url' => $validated['video_url'] ?? null,
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'zoom_level' => $validated['zoom_level'] ?? null,
            'country' => $validated['country'] ?? 'Philippines',
            'state_province' => $validated['state_province'] ?? null,
            'city' => $validated['city'] ?? null,
            'street_address' => $validated['street_address'] ?? null,
            'owner_firstname' => $validated['owner_firstname'] ?? null,
            'owner_lastname' => $validated['owner_lastname'] ?? null,
            'owner_phone' => $validated['owner_phone'] ?? null,
            'owner_email' => $validated['owner_email'] ?? null,
            'owner_country' => $validated['owner_country'] ?? null,
            'owner_state' => $validated['owner_state'] ?? null,
            'owner_city' => $validated['owner_city'] ?? null,
            'owner_street_address' => $validated['owner_street_address'] ?? null,
            'rapa_document_path' => $rapaPath,
            'agent_id' => $user->id,
            'published_at' => now(),
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Property created successfully',
            'data' => $property->load('agent'),
        ], 201);
    }
}

