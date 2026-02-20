<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PageBuilder extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'user_type',
        'page_type',
        'page_slug',
        'page_url',
        'page_data', // All page customization data stored as JSON
        'is_published',
        'published_at',
    ];

    protected $casts = [
        'page_data' => 'array', // Automatically cast to/from JSON
        'is_published' => 'boolean',
        'published_at' => 'datetime',
    ];

    /**
     * Get the user that owns the page builder.
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Generate a unique page slug.
     */
    public function generateSlug(): string
    {
        $baseSlug = strtolower($this->user_type . '-' . $this->page_type . '-' . $this->user_id);
        $slug = $baseSlug;
        $counter = 1;

        while (self::where('page_slug', $slug)->where('id', '!=', $this->id)->exists()) {
            $slug = $baseSlug . '-' . $counter;
            $counter++;
        }

        return $slug;
    }

    /**
     * Generate the page URL.
     */
    public function generateUrl(): string
    {
        // Use frontend URL for public pages (Next.js app)
        $frontendUrl = env('FRONTEND_URL', 'http://localhost:3000');
        $baseUrl = rtrim($frontendUrl, '/');
        return $baseUrl . '/page/' . $this->page_slug;
    }

    /**
     * Format the page builder for API response.
     * Returns page_data merged with metadata for backward compatibility.
     */
    public function formatForResponse(): array
    {
        $pageData = $this->page_data ?? [];
        
        $response = array_merge([
            'id' => $this->id,
            'user_id' => $this->user_id,
            'user_type' => $this->user_type,
            'page_type' => $this->page_type,
            'page_slug' => $this->page_slug,
            'page_url' => $this->page_url,
            'is_published' => $this->is_published,
            'published_at' => $this->published_at?->toDateTimeString(),
            'created_at' => $this->created_at?->toDateTimeString(),
            'updated_at' => $this->updated_at?->toDateTimeString(),
        ], $pageData);
        
        // Include user data if relationship is loaded
        if ($this->relationLoaded('user') && $this->user) {
            $response['user'] = [
                'id' => $this->user->id,
                'name' => $this->user->name,
                'first_name' => $this->user->first_name ?? null,
                'last_name' => $this->user->last_name ?? null,
                'email' => $this->user->email,
            ];
        }
        
        return $response;
    }
}
