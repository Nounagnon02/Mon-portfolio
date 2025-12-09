<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Page;
use App\Models\Project;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Create pages
        Page::create([
            'page_name' => 'home',
            'hero_headline' => "Hi, I'm Kangbode Prince. A Full-Stack Developer.",
            'hero_subheadline' => "I'm a Full-Stack Web Developer, Mobile App Developer, and UI/UX Designer passionate about building modern, scalable, and user-centered digital solutions.
I craft intuitive interfaces, develop high-performance applications, and design seamless user experiences that bring ideas to life. With a strong commitment to quality and innovation, I turn complex problems into elegant and efficient solutions.",
            'hero_background_image' => '/images/Prince.jpeg',
            'cta_button_text' => 'View My Work',
            'cta_button_link' => '/projects'
        ]);

        Page::create([
            'page_name' => 'about',
            'hero_headline' => 'About Me',
            'hero_subheadline' => 'Passionate developer with expertise in modern web technologies'
        ]);

        Page::create([
            'page_name' => 'contact',
            'hero_headline' => 'Get in Touch',
            'hero_subheadline' => "I'm always open to discussing new projects"
        ]);

        // // Create sample projects
        // $projects = [
        //     [
        //         'title' => 'E-commerce Platform',
        //         'description' => 'Une plateforme e-commerce complète avec panier, paiement et gestion des commandes.',
        //         'image' => 'https://via.placeholder.com/400x200',
        //         'technologies' => ['React', 'Node.js', 'MongoDB', 'Stripe'],
        //         'category' => 'fullstack',
        //         'live_url' => '#',
        //         'github_url' => '#',
        //         'order' => 1
        //     ],
        //     [
        //         'title' => 'Task Management App',
        //         'description' => 'Application de gestion de tâches avec collaboration en temps réel.',
        //         'image' => 'https://via.placeholder.com/400x200',
        //         'technologies' => ['Vue.js', 'Python', 'PostgreSQL', 'Socket.io'],
        //         'category' => 'fullstack',
        //         'live_url' => '#',
        //         'github_url' => '#',
        //         'order' => 2
        //     ],
        //     [
        //         'title' => 'Portfolio Website',
        //         'description' => 'Site portfolio personnel avec dashboard administrateur.',
        //         'image' => 'https://via.placeholder.com/400x200',
        //         'technologies' => ['React', 'Laravel', 'MySQL', 'Tailwind'],
        //         'category' => 'frontend',
        //         'live_url' => '#',
        //         'github_url' => '#',
        //         'order' => 3
        //     ]
        // ];

        // foreach ($projects as $project) {
        //     Project::create($project);
        // }
    }
}
