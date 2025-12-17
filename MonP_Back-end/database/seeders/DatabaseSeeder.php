<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Page;
use App\Models\Project;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        $this->call(SkillSeeder::class);

        // Create pages
        Page::create([
            'page_name' => 'home',
            'hero_headline' => "Hi, I'm Kangbode Prince. Full-Stack Developer.",
            'hero_subheadline' => "I'm a Full-Stack Web and Mobile Developer with a strong focus on building reliable, secure, and scalable applications.
        I work with technologies like Laravel, React, Java, and modern frontend tools to design clean interfaces and develop robust backend systems.
        Driven by continuous learning and real-world problem solving, I transform ideas into practical digital solutions that deliver value and performance.",
            'hero_background_image' => '/images/Prince.jpeg',
            'cta_button_text' => 'Explore My Projects',
            'cta_button_link' => '/projects'
        ]);

        Page::create([
            'page_name' => 'about',
            'hero_headline' => 'About Me',
            'hero_subheadline' => "I'm a passionate Full-Stack Developer with experience in web and software development.
        I enjoy designing efficient systems, writing clean and maintainable code, and continuously improving my technical and problem-solving skills through real projects."
        ]);


        Page::create([
            'page_name' => 'contact',
            'hero_headline' => 'Get in Touch',
            'hero_subheadline' => "I'm always open to discussing new projects"
        ]);

        // Create sample projects
        $projects = [

            [
                'title' => 'Gbédagbé - Plateforme de Paiement de Pensions',
                'description' => 'Système de paiement de pensions avec authentification biométrique et intégration Mojaloop pour le hackathon DevLab 2025.',
                'image' => 'https://via.placeholder.com/400x200',
                'technologies' => ['Next.js', 'Mojaloop', 'Docker', 'Redis', 'Prisma', 'Gemini', 'WebAuthn'],
                'category' => 'fullstack',
                'live_url' => '#',
                'github_url' => 'https://github.com/Nounagnon02/Hackaton_DevLab_ASIN',
                'order' => 1
            ],

            [
                'title' => 'École - Système de Gestion Scolaire Complet',
                'description' => 'Solution complète pour la gestion d\'établissements scolaires, avec backend (Laravel), frontend (React) et application mobile (React Native).',
                'image' => 'https://via.placeholder.com/400x200',
                'technologies' => ['Laravel', 'React', 'React Native', 'MySQL', 'PostgreSQL'],
                'category' => 'fullstack',
                'live_url' => 'https://ecole-one.vercel.app/',
                'github_url' => 'https://github.com/Nounagnon02/Ecole',
                'order' => 2
            ],

            [
                'title' => 'Système de Réservation d\'Hôtel avec Paiement FedaPay',
                'description' => 'Système complet de réservation d\'hôtel avec paiement en ligne intégré via FedaPay, incluant une application mobile.',
                'image' => 'https://via.placeholder.com/400x200',
                'technologies' => ['Laravel', 'React', 'React Native', 'Expo', 'FedaPay', 'MySQL'],
                'category' => 'fullstack',
                'live_url' => '#',
                'github_url' => 'https://github.com/Nounagnon02/Projet_de_reservation_en_ligne',
                'order' => 3
            ],

            [
                'title' => 'GLOTTO-BOT - Assistant Pédagogique WhatsApp',
                'description' => 'Chatbot WhatsApp pour l\'enseignement des sciences en langues locales béninoises (Fon, Yoruba, Bariba).',
                'image' => 'https://via.placeholder.com/400x200',
                'technologies' => ['Python', 'Flask', 'Twilio', 'gTTS'],
                'category' => 'backend',
                'live_url' => '#',
                'github_url' => 'https://github.com/Nounagnon02/glotto-bot',
                'order' => 4
            ],

            [
                'title' => 'Mon Portfolio',
                'description' => 'Portfolio personnel pour présenter mes projets.',
                'image' => 'https://via.placeholder.com/400x200',
                'technologies' => ['PHP', 'JavaScript', 'CSS', 'Blade', 'HTML', 'Docker', 'Shell'],
                'category' => 'fullstack',
                'live_url' => 'https://mon-portfolio-kp-tech.vercel.app/',
                'github_url' => 'https://github.com/Nounagnon02/Mon-portfolio',
                'order' => 5
            ],

            [
                'title' => 'Projet de vérification de présence',
                'description' => 'Une application pour vérifier la présence, construite avec le framework Laravel.',
                'image' => 'https://via.placeholder.com/400x200',
                'technologies' => ['Laravel', 'Blade', 'PHP'],
                'category' => 'backend',
                'live_url' => '#',
                'github_url' => 'https://github.com/Nounagnon02/projet_verification_de_presence',
                'order' => 6
            ],

            [
                'title' => 'Projet Blog',
                'description' => 'Un blog simple avec un backend en PHP et un frontend en JavaScript.',
                'image' => 'https://via.placeholder.com/400x200',
                'technologies' => ['PHP', 'JavaScript', 'CSS', 'Blade', 'HTML', 'Docker', 'Shell'],
                'category' => 'fullstack',
                'live_url' => 'https://projetblog-sage.vercel.app/',
                'github_url' => 'https://github.com/Nounagnon02/Projet_blog',
                'order' => 7
            ],

            [
                'title' => 'Projet CMS',
                'description' => 'Un système de gestion de contenu (CMS) de base.',
                'image' => 'https://via.placeholder.com/400x200',
                'technologies' => ['PHP', 'Blade', 'JavaScript'],
                'category' => 'backend',
                'live_url' => '#',
                'github_url' => 'https://github.com/Nounagnon02/Projet_cms',
                'order' => 8
            ],

            [
                'title' => 'Projet Ecommerce',
                'description' => 'Une application de commerce en ligne développée en TypeScript.',
                'image' => 'https://via.placeholder.com/400x200',
                'technologies' => ['TypeScript', 'JavaScript', 'CSS', 'HTML'],
                'category' => 'frontend',
                'live_url' => 'http://replit.com/@princekangbode/EcommerceMarketplace',
                'github_url' => 'https://github.com/Nounagnon02/Projet_Ecommerce',
                'order' => 9
            ],

            [
                'title' => 'Gestion des écoles',
                'description' => 'Une application de gestion d\'écoles construite avec Laravel et React.',
                'image' => 'https://via.placeholder.com/400x200',
                'technologies' => ['Laravel', 'Blade', 'PHP', 'JavaScript', 'CSS', 'HTML'],
                'category' => 'fullstack',
                'live_url' => '#',
                'github_url' => 'https://github.com/Nounagnon02/Gestion-des-ecole',
                'order' => 10
            ],

            [
                'title' => 'Gestion des examens',
                'description' => 'Une application de gestion d\'examens construite avec le framework Laravel.',
                'image' => 'https://via.placeholder.com/400x200',
                'technologies' => ['Laravel', 'Blade', 'PHP'],
                'category' => 'backend',
                'live_url' => '#',
                'github_url' => 'https://github.com/Nounagnon02/gestionexament1',
                'order' => 11
            ],

            [
                'title' => 'Projet AATW',
                'description' => 'Un site web avec inscription, connexion, et la possibilité de voir et d\'imprimer des listes d\'utilisateurs, de compétences et de joueurs d\'échecs.',
                'image' => 'https://via.placeholder.com/400x200',
                'technologies' => ['PHP', 'HTML', 'CSS'],
                'category' => 'backend',
                'live_url' => '#',
                'github_url' => 'https://github.com/Nounagnon02/projetAATW',
                'order' => 12
            ],

            [
                'title' => 'Projet de gestion de stock',
                'description' => 'Application web pour la gestion des stocks.',
                'image' => 'https://via.placeholder.com/400x200',
                'technologies' => ['PHP', 'Blade', 'TypeScript', 'CSS', 'JavaScript'],
                'category' => 'fullstack',
                'live_url' => '#',
                'github_url' => 'https://github.com/Nounagnon02/Projet_Gestion_Stock',
                'order' => 13
            ]

        ];


        foreach ($projects as $project) {
            Project::create($project);
        }
    }
}
