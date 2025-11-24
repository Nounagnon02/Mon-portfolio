<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'image',
        'technologies',
        'category',
        'live_url',
        'github_url',
        'order'
    ];

    protected $casts = [
        'technologies' => 'array'
    ];
}
