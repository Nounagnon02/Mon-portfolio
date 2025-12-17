<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Skill;

class SkillSeeder extends Seeder
{
    public function run()
    {
        $skills = [
            ['name' => 'React', 'category' => 'Frontend', 'proficiency' => 'advanced'],
            ['name' => 'Next.js', 'category' => 'Frontend', 'proficiency' => 'advanced'],
            ['name' => 'JavaScript', 'category' => 'Frontend', 'proficiency' => 'advanced'],
            ['name' => 'TypeScript', 'category' => 'Frontend', 'proficiency' => 'intermediate'],
            ['name' => 'CSS', 'category' => 'Frontend', 'proficiency' => 'advanced'],
            ['name' => 'HTML', 'category' => 'Frontend', 'proficiency' => 'advanced'],
            ['name' => 'Blade', 'category' => 'Frontend', 'proficiency' => 'intermediate'],
            
            ['name' => 'Laravel', 'category' => 'Backend', 'proficiency' => 'advanced'],
            ['name' => 'PHP', 'category' => 'Backend', 'proficiency' => 'advanced'],
            ['name' => 'Python', 'category' => 'Backend', 'proficiency' => 'intermediate'],
            ['name' => 'Flask', 'category' => 'Backend', 'proficiency' => 'intermediate'],
            ['name' => 'Node.js', 'category' => 'Backend', 'proficiency' => 'intermediate'],
            
            ['name' => 'React Native', 'category' => 'Mobile', 'proficiency' => 'intermediate'],
            ['name' => 'Expo', 'category' => 'Mobile', 'proficiency' => 'intermediate'],
            
            ['name' => 'MySQL', 'category' => 'Database', 'proficiency' => 'advanced'],
            ['name' => 'PostgreSQL', 'category' => 'Database', 'proficiency' => 'intermediate'],
            ['name' => 'Redis', 'category' => 'Database', 'proficiency' => 'intermediate'],
            
            ['name' => 'Docker', 'category' => 'DevOps', 'proficiency' => 'intermediate'],
            ['name' => 'Shell', 'category' => 'DevOps', 'proficiency' => 'intermediate'],
            
            ['name' => 'Mojaloop', 'category' => 'Tools', 'proficiency' => 'intermediate'],
            ['name' => 'FedaPay', 'category' => 'Tools', 'proficiency' => 'intermediate'],
            ['name' => 'Twilio', 'category' => 'Tools', 'proficiency' => 'intermediate'],
            ['name' => 'gTTS', 'category' => 'Tools', 'proficiency' => 'beginner'],
            ['name' => 'Prisma', 'category' => 'Tools', 'proficiency' => 'intermediate'],
            ['name' => 'Gemini', 'category' => 'Tools', 'proficiency' => 'beginner'],
            ['name' => 'WebAuthn', 'category' => 'Tools', 'proficiency' => 'beginner'],
        ];

        foreach ($skills as $skill) {
            Skill::create($skill);
        }
    }
}
