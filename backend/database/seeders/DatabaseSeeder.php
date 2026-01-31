<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\Property;
use App\Models\RentManager;
use App\Models\Testimonial;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $rentManager = RentManager::create([
            'name' => 'RentalPh Official Rent Manager',
            'email' => 'official@rentals.ph',
            'is_official' => true,
        ]);

        Property::create([
            'title' => 'Azure Residences - 2BR Corner Suite',
            'description' => 'Beautiful corner suite with modern amenities',
            'type' => 'Commercial Spaces',
            'location' => 'Manila',
            'price' => 1200,
            'bedrooms' => 4,
            'bathrooms' => 2,
            'area' => 120,
            'image' => 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
            'is_featured' => true,
            'rent_manager_id' => $rentManager->id,
            'published_at' => now(),
        ]);

        Testimonial::create([
            'name' => 'Elaine Mae Ofiaza',
            'role' => 'Lessee', 
            'content' => 'Rentals.ph made finding my perfect home so easy! The platform is user-friendly and the properties are all verified. Highly recommended!',
            'avatar' => 'https://i.pravatar.cc/150?img=1',
        ]);

        Testimonial::create([
            'name' => 'Rica Grate',
            'role' => 'Rent Manager',
            'content' => 'As a rent manager, Rentals.ph has been instrumental in helping me connect with quality tenants. The platform is professional and efficient.',
            'avatar' => 'https://i.pravatar.cc/150?img=2',
        ]);

        Blog::create([
            'title' => 'Understanding Your Rental Contract: A Complete Guide',
            'content' => 'Full content here...',
            'excerpt' => 'Learn everything you need to know about rental contracts in the Philippines...',
            'category' => 'Legal',
            'read_time' => 7,
            'author' => 'Maria Santos',
            'image' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800',
            'published_at' => now()->subDays(10),
        ]);
    }
}

