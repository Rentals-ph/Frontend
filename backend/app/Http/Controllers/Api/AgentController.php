<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Agent;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use OpenApi\Attributes as OA;

#[OA\Info(
    version: "1.0.0",
    title: "Rentals.ph API",
    description: "API documentation for Rentals.ph backend"
)]
#[OA\Server(
    url: "/api",
    description: "API Server"
)]
#[OA\SecurityScheme(
    securityScheme: "sanctum",
    type: "http",
    scheme: "bearer",
    bearerFormat: "JWT"
)]
class AgentController extends Controller
{
    /**
     * Register a new agent.
     */
    #[OA\Post(
        path: "/agents/register",
        summary: "Register a new agent",
        tags: ["Agents"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: "multipart/form-data",
                schema: new OA\Schema(
                    required: ["firstName", "lastName", "email", "password", "prcLicenseNumber", "licenseType", "expirationDate", "licenseDocument", "agreeToTerms"],
                    properties: [
                        new OA\Property(property: "firstName", type: "string", maxLength: 255, description: "Agent's first name"),
                        new OA\Property(property: "lastName", type: "string", maxLength: 255, description: "Agent's last name"),
                        new OA\Property(property: "email", type: "string", format: "email", maxLength: 255, description: "Agent's email address"),
                        new OA\Property(property: "password", type: "string", minLength: 8, description: "Agent's password"),
                        new OA\Property(property: "phone", type: "string", maxLength: 20, nullable: true, description: "Agent's phone number"),
                        new OA\Property(property: "dateOfBirth", type: "string", format: "date", nullable: true, description: "Agent's date of birth"),
                        new OA\Property(property: "agencyName", type: "string", maxLength: 255, nullable: true, description: "Agency name"),
                        new OA\Property(property: "officeAddress", type: "string", maxLength: 500, nullable: true, description: "Office address"),
                        new OA\Property(property: "city", type: "string", maxLength: 255, nullable: true, description: "City"),
                        new OA\Property(property: "state", type: "string", maxLength: 255, nullable: true, description: "State"),
                        new OA\Property(property: "zipCode", type: "string", maxLength: 20, nullable: true, description: "Zip code"),
                        new OA\Property(property: "prcLicenseNumber", type: "string", maxLength: 255, description: "PRC license number"),
                        new OA\Property(property: "licenseType", type: "string", enum: ["broker", "salesperson"], description: "License type"),
                        new OA\Property(property: "expirationDate", type: "string", format: "date", description: "License expiration date"),
                        new OA\Property(property: "yearsOfExperience", type: "string", maxLength: 50, nullable: true, description: "Years of experience"),
                        new OA\Property(property: "licenseDocument", type: "string", format: "binary", description: "License document (PDF, JPG, JPEG, PNG, max 10MB)"),
                        new OA\Property(property: "agreeToTerms", type: "boolean", description: "Agreement to terms and conditions"),
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(
                response: 201,
                description: "Agent registered successfully",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: true),
                        new OA\Property(property: "message", type: "string", example: "Agent registration successful! Your application is pending approval."),
                        new OA\Property(
                            property: "data",
                            type: "object",
                            properties: [
                                new OA\Property(property: "id", type: "integer", example: 1),
                                new OA\Property(property: "name", type: "string", example: "John Doe"),
                                new OA\Property(property: "email", type: "string", example: "john@example.com"),
                                new OA\Property(property: "status", type: "string", example: "pending"),
                            ]
                        ),
                    ]
                )
            ),
            new OA\Response(
                response: 422,
                description: "Validation error",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: false),
                        new OA\Property(property: "message", type: "string", example: "Validation failed"),
                        new OA\Property(property: "errors", type: "object"),
                    ]
                )
            ),
            new OA\Response(
                response: 500,
                description: "Server error",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: false),
                        new OA\Property(property: "message", type: "string", example: "Registration failed. Please try again."),
                        new OA\Property(property: "error", type: "string"),
                    ]
                )
            ),
        ]
    )]
    public function register(Request $request): JsonResponse
    {
        try {
            // Validate the request data
            $validator = Validator::make($request->all(), [
                // Personal Information
                'firstName' => 'required|string|max:255',
                'lastName' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:agents,email',
                'password' => 'required|string|min:8',
                'phone' => 'nullable|string|max:20',
                'dateOfBirth' => 'nullable|date',
                
                // Agency Information
                'agencyName' => 'nullable|string|max:255',
                'officeAddress' => 'nullable|string|max:500',
                'city' => 'nullable|string|max:255',
                'state' => 'nullable|string|max:255',
                'zipCode' => 'nullable|string|max:20',
                
                // PRC Certification
                'prcLicenseNumber' => 'required|string|max:255|unique:agents,prc_license_number',
                'licenseType' => 'required|in:broker,salesperson',
                'expirationDate' => 'required|date|after:today',
                'yearsOfExperience' => 'nullable|string|max:50',
                'licenseDocument' => 'required|file|mimes:pdf,jpg,jpeg,png|max:10240', // 10MB max
                'agreeToTerms' => 'required|accepted',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Handle file upload
            $licenseDocumentPath = null;
            if ($request->hasFile('licenseDocument')) {
                $file = $request->file('licenseDocument');
                $fileName = time() . '_' . $file->getClientOriginalName();
                
                // Ensure the directory exists
                $directory = 'agents/licenses';
                if (!Storage::disk('public')->exists($directory)) {
                    Storage::disk('public')->makeDirectory($directory);
                }
                
                // Store in public/agents/licenses directory
                $licenseDocumentPath = $file->storeAs($directory, $fileName, 'public');
            }

            // Create the agent
            // Note: Password is automatically hashed by the 'hashed' cast in the Agent model
            $agent = Agent::create([
                'first_name' => $request->firstName,
                'last_name' => $request->lastName,
                'email' => $request->email,
                'password' => $request->password, // Will be automatically hashed by the model cast
                'phone' => $request->phone,
                'date_of_birth' => $request->dateOfBirth,
                'agency_name' => $request->agencyName,
                'office_address' => $request->officeAddress,
                'city' => $request->city,
                'state' => $request->state,
                'zip_code' => $request->zipCode,
                'prc_license_number' => $request->prcLicenseNumber,
                'license_type' => $request->licenseType,
                'expiration_date' => $request->expirationDate,
                'years_of_experience' => $request->yearsOfExperience,
                'license_document_path' => $licenseDocumentPath,
                'status' => 'pending', // New agents start with pending status
                'verified' => false, // New agents are not verified by default
            ]);

            // Return success response
            return response()->json([
                'success' => true,
                'message' => 'Agent registration successful! Your application is pending approval.',
                'data' => [
                    'id' => $agent->id,
                    'name' => $agent->full_name,
                    'email' => $agent->email,
                    'status' => $agent->status,
                ],
            ], 201);

        } catch (\Illuminate\Database\QueryException $e) {
            // Handle database errors specifically
            \Log::error('Agent registration database error: ' . $e->getMessage(), [
                'sql' => $e->getSql(),
                'bindings' => $e->getBindings(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            
            $errorMessage = 'Database error occurred.';
            if (config('app.debug')) {
                $errorMessage = $e->getMessage();
                // Check for common database errors
                if (str_contains($e->getMessage(), "Base table or view not found")) {
                    $errorMessage = 'Database table not found. Please run: php artisan migrate';
                } elseif (str_contains($e->getMessage(), "Unknown column")) {
                    $errorMessage = 'Database column mismatch. Please check your migration.';
                } elseif (str_contains($e->getMessage(), "Connection refused") || str_contains($e->getMessage(), "Access denied")) {
                    $errorMessage = 'Database connection failed. Please check your database credentials in .env';
                }
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Registration failed. Please try again.',
                'error' => $errorMessage,
                'debug_info' => config('app.debug') ? [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'sql' => $e->getSql(),
                ] : null,
            ], 500);
            
        } catch (\Exception $e) {
            // Log the full error for debugging
            \Log::error('Agent registration error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);
            
            $errorMessage = 'An internal server error occurred.';
            if (config('app.debug')) {
                $errorMessage = $e->getMessage();
            }
            
            return response()->json([
                'success' => false,
                'message' => 'Registration failed. Please try again.',
                'error' => $errorMessage,
                'debug_info' => config('app.debug') ? [
                    'file' => $e->getFile(),
                    'line' => $e->getLine(),
                    'type' => get_class($e),
                ] : null,
            ], 500);
        }
    }

    /**
     * Login agent and return access token.
     */
    #[OA\Post(
        path: "/agents/login",
        summary: "Login agent",
        tags: ["Agents"],
        requestBody: new OA\RequestBody(
            required: true,
            content: new OA\MediaType(
                mediaType: "application/json",
                schema: new OA\Schema(
                    required: ["email", "password"],
                    properties: [
                        new OA\Property(property: "email", type: "string", format: "email", description: "Agent's email address"),
                        new OA\Property(property: "password", type: "string", description: "Agent's password"),
                    ]
                )
            )
        ),
        responses: [
            new OA\Response(
                response: 200,
                description: "Login successful",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: true),
                        new OA\Property(property: "message", type: "string", example: "Login successful"),
                        new OA\Property(
                            property: "data",
                            type: "object",
                            properties: [
                                new OA\Property(property: "token", type: "string", example: "1|xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"),
                                new OA\Property(property: "token_type", type: "string", example: "Bearer"),
                                new OA\Property(
                                    property: "agent",
                                    type: "object",
                                    properties: [
                                        new OA\Property(property: "id", type: "integer", example: 1),
                                        new OA\Property(property: "first_name", type: "string", example: "John"),
                                        new OA\Property(property: "last_name", type: "string", example: "Doe"),
                                        new OA\Property(property: "email", type: "string", example: "john@example.com"),
                                        new OA\Property(property: "phone", type: "string", nullable: true, example: "+1234567890"),
                                        new OA\Property(property: "agency_name", type: "string", nullable: true, example: "ABC Realty"),
                                        new OA\Property(property: "prc_license_number", type: "string", example: "PRC-12345"),
                                        new OA\Property(property: "license_type", type: "string", example: "broker"),
                                        new OA\Property(property: "status", type: "string", example: "approved"),
                                        new OA\Property(property: "verified", type: "boolean", example: true),
                                    ]
                                ),
                            ]
                        ),
                    ]
                )
            ),
            new OA\Response(
                response: 401,
                description: "Invalid credentials, account not approved, or not verified",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: false),
                        new OA\Property(property: "message", type: "string", example: "Invalid credentials or account not approved"),
                    ]
                )
            ),
            new OA\Response(
                response: 422,
                description: "Validation error",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: false),
                        new OA\Property(property: "message", type: "string", example: "Validation failed"),
                        new OA\Property(property: "errors", type: "object"),
                    ]
                )
            ),
        ]
    )]
    public function login(Request $request): JsonResponse
    {
        try {
            // Validate the request data
            $validator = Validator::make($request->all(), [
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation failed',
                    'errors' => $validator->errors(),
                ], 422);
            }

            // Find the agent by email
            $agent = Agent::where('email', $request->email)->first();

            // Check if agent exists
            if (!$agent) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid email or password',
                ], 401);
            }

            // Check if password is correct
            // Handle both hashed and plain text passwords (for migration purposes)
            $passwordValid = false;
            if (Hash::check($request->password, $agent->password)) {
                $passwordValid = true;
            } elseif ($agent->password === $request->password) {
                // If password is stored as plain text, hash it now
                $agent->password = $request->password; // Will be auto-hashed by model cast
                $agent->save();
                $passwordValid = true;
            }

            if (!$passwordValid) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid email or password',
                ], 401);
            }

            // Allow login for all agents (including processing/pending)
            // Processing agents can access dashboard but listings won't be visible to users

            // Revoke all existing tokens (optional - for security)
            // $agent->tokens()->delete();

            // Create a new token
            $token = $agent->createToken('auth-token')->plainTextToken;

            // Return success response with token and user status
            return response()->json([
                'success' => true,
                'message' => 'Login successful',
                'data' => [
                    'token' => $token,
                    'token_type' => 'Bearer',
                    'user' => [
                        'id' => $agent->id,
                        'name' => $agent->first_name . ' ' . $agent->last_name,
                        'email' => $agent->email,
                        'status' => $agent->status ?? 'pending',
                    ],
                    'agent' => [
                        'id' => $agent->id,
                        'first_name' => $agent->first_name,
                        'last_name' => $agent->last_name,
                        'email' => $agent->email,
                        'phone' => $agent->phone,
                        'agency_name' => $agent->agency_name,
                        'prc_license_number' => $agent->prc_license_number,
                        'license_type' => $agent->license_type,
                        'status' => $agent->status ?? 'pending',
                        'verified' => $agent->verified ?? false,
                    ],
                ],
            ], 200);

        } catch (\Exception $e) {
            // Log the error
            \Log::error('Agent login error: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
            ]);

            $errorMessage = 'An internal server error occurred.';
            if (config('app.debug')) {
                $errorMessage = $e->getMessage();
            }

            return response()->json([
                'success' => false,
                'message' => 'Login failed. Please try again.',
                'error' => $errorMessage,
            ], 500);
        }
    }

    /**
     * Get agent details (for authenticated agents).
     */
    #[OA\Get(
        path: "/agents/me",
        summary: "Get authenticated agent details",
        tags: ["Agents"],
        security: [["sanctum" => []]],
        responses: [
            new OA\Response(
                response: 200,
                description: "Agent details retrieved successfully",
                content: new OA\JsonContent(
                    properties: [
                        new OA\Property(property: "success", type: "boolean", example: true),
                        new OA\Property(
                            property: "data",
                            type: "object",
                            properties: [
                                new OA\Property(property: "id", type: "integer", example: 1),
                                new OA\Property(property: "first_name", type: "string", example: "John"),
                                new OA\Property(property: "last_name", type: "string", example: "Doe"),
                                new OA\Property(property: "email", type: "string", example: "john@example.com"),
                                new OA\Property(property: "phone", type: "string", nullable: true, example: "+1234567890"),
                                new OA\Property(property: "agency_name", type: "string", nullable: true, example: "ABC Realty"),
                                new OA\Property(property: "prc_license_number", type: "string", example: "PRC-12345"),
                                new OA\Property(property: "license_type", type: "string", example: "broker"),
                                new OA\Property(property: "status", type: "string", example: "approved"),
                                new OA\Property(property: "verified", type: "boolean", example: true),
                            ]
                        ),
                    ]
                )
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
    public function show(Request $request): JsonResponse
    {
        $agent = $request->user();
        
        return response()->json([
            'success' => true,
            'data' => [
                'id' => $agent->id,
                'first_name' => $agent->first_name,
                'last_name' => $agent->last_name,
                'email' => $agent->email,
                'phone' => $agent->phone,
                'agency_name' => $agent->agency_name,
                'prc_license_number' => $agent->prc_license_number,
                'license_type' => $agent->license_type,
                'status' => $agent->status,
                'verified' => $agent->verified,
            ],
        ]);
    }
}

