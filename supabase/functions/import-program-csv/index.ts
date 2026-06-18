import { createClient } from 'npm:@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

interface ProgramData {
  program: {
    title: string;
    slug: string;
    description: string;
    category: string;
    difficulty_level: string;
    required_role: string;
    cover_image_url?: string;
    is_published: boolean;
  };
  milestones: Array<{
    class_number: number;
    theme_number: number;
    title: string;
    description: string;
    class_date: string;
    class_time: string;
    class_link?: string;
  }>;
  activities: Array<{
    week_number: number;
    day_of_week: number;
    task_title: string;
    task_description: string;
  }>;
  prompts: Array<{
    class_number: number;
    theme_number: number;
    prompt_text: string;
  }>;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase credentials');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (userError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const body = await req.json() as { programData: ProgramData };
    const { programData } = body;

    if (!programData?.program) {
      return new Response(JSON.stringify({ error: 'Invalid program data' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { program, milestones = [], activities = [], prompts = [] } = programData;

    const { data: existingProgram } = await supabase
      .from('programs')
      .select('id')
      .eq('slug', program.slug)
      .maybeSingle();

    if (existingProgram) {
      return new Response(JSON.stringify({ error: `Program with slug "${program.slug}" already exists` }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const { data: newProgram, error: programError } = await supabase
      .from('programs')
      .insert({
        title: program.title,
        slug: program.slug,
        description: program.description,
        category: program.category,
        difficulty_level: program.difficulty_level,
        required_role: program.required_role,
        cover_image_url: program.cover_image_url || null,
        is_published: program.is_published,
        instructor_id: user.id,
      })
      .select()
      .single();

    if (programError || !newProgram) {
      throw new Error(`Failed to create program: ${programError?.message}`);
    }

    const milestoneMap = new Map<string, string>();

    if (milestones.length > 0) {
      const milestonesToInsert = milestones.map((m, idx) => ({
        program_id: newProgram.id,
        class_number: m.class_number,
        theme_number: m.theme_number,
        title: m.title,
        description: m.description,
        class_date: m.class_date || null,
        class_time: m.class_time || null,
        class_link: m.class_link || null,
        sort_order: idx,
      }));

      const { data: insertedMilestones, error: milestonesError } = await supabase
        .from('program_milestones')
        .insert(milestonesToInsert)
        .select('id, class_number, theme_number');

      if (milestonesError) {
        throw new Error(`Failed to create milestones: ${milestonesError.message}`);
      }

      if (insertedMilestones) {
        insertedMilestones.forEach((m) => {
          milestoneMap.set(`${m.class_number}-${m.theme_number}`, m.id);
        });
      }
    }

    if (activities.length > 0) {
      const activitiesToInsert = activities.map((a, idx) => ({
        program_id: newProgram.id,
        week_number: a.week_number,
        day_of_week: a.day_of_week,
        task_title: a.task_title,
        task_description: a.task_description,
        sort_order: idx,
      }));

      const { error: activitiesError } = await supabase
        .from('daily_homework_tasks')
        .insert(activitiesToInsert);

      if (activitiesError) {
        throw new Error(`Failed to create activities: ${activitiesError.message}`);
      }
    }

    if (prompts.length > 0) {
      const promptsToInsert = prompts
        .map((p) => {
          const milestoneId = milestoneMap.get(`${p.class_number}-${p.theme_number}`);
          if (!milestoneId) return null;
          return {
            milestone_id: milestoneId,
            prompt_text: p.prompt_text,
            sort_order: 0,
          };
        })
        .filter(Boolean);

      if (promptsToInsert.length > 0) {
        const { error: promptsError } = await supabase
          .from('milestone_journal_prompts')
          .insert(promptsToInsert);

        if (promptsError) {
          throw new Error(`Failed to create prompts: ${promptsError.message}`);
        }
      }
    }

    return new Response(JSON.stringify({
      success: true,
      program: newProgram,
      summary: {
        programTitle: newProgram.title,
        milestonesCount: milestones.length,
        activitiesCount: activities.length,
        promptsCount: prompts.length,
      },
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
