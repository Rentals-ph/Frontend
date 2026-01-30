<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Property extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'type',
        'location',
        'price',
        'price_type',
        'bedrooms',
        'bathrooms',
        'garage',
        'area',
        'lot_area',
        'floor_area_unit',
        'amenities',
        'furnishing',
        'image',
        'video_url',
        'latitude',
        'longitude',
        'zoom_level',
        'country',
        'state_province',
        'city',
        'street_address',
        'owner_firstname',
        'owner_lastname',
        'owner_phone',
        'owner_email',
        'owner_country',
        'owner_state',
        'owner_city',
        'owner_street_address',
        'rapa_document_path',
        'is_featured',
        'agent_id',
        'rent_manager_id',
        'published_at',
    ];

    protected $casts = [
        'is_featured' => 'boolean',
        'price' => 'decimal:2',
        'published_at' => 'datetime',
        'amenities' => 'array',
    ];

    public function rentManager()
    {
        return $this->belongsTo(RentManager::class);
    }

    public function agent()
    {
        return $this->belongsTo(User::class, 'agent_id');
    }
}

