<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class pags extends Model
{
    use HasFactory;

    protected $fillable = [
        'page_name',
        'hero_headline',
        'hero_subheadline',
        'hero_background_image',
        'cta_button_text',
        'cta_button_link'
    ];
}
