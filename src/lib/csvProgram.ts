export const CSV_TEMPLATE_INSTRUCTIONS = [
  'Program CSV Upload Template Instructions',
  '',
  'OVERVIEW',
  'This CSV file allows you to bulk import complete program structures including:',
  '- Program basic information (title, description, category, etc.)',
  '- Milestones/Classes (with dates, times, and Zoom links)',
  '- Daily homework tasks',
  '- Journal prompts',
  '',
  'COLUMN DESCRIPTIONS',
  '',
  'Program Basic Information (Required - First Row Only)',
  '- Program Title: Name of the program (required)',
  '- Program Slug: URL-friendly identifier (auto-generated if blank)',
  '- Program Description: Brief description of the program content',
  '- Program Category: One of: wellness, yoga, breathwork, therapy',
  '- Program Difficulty: One of: beginner, intermediate, advanced, expert, master, guru',
  '- Program Required Role: One of: member, student, facilitator, instructor, guru',
  '- Cover Image URL: Full URL to program cover image (optional)',
  '- Publish Status: true or false',
  '',
  'Milestones Section (One row per milestone/class)',
  '- Class Number: Sequential number (1, 2, 3, etc.)',
  '- Theme Number: Theme number within the class',
  '- Theme Title: Name of the theme or focus area',
  '- Theme Description: Details about what will be covered',
  '- Class Date: Date in YYYY-MM-DD format',
  '- Class Time: Time in HH:MM 24-hour format',
  '- Class Link: Zoom or video meeting link (optional)',
  '',
  'Daily Activities Section (One row per activity)',
  '- Activity Week Number: Week number (1, 2, 3, etc.)',
  '- Activity Day: Day number (1=Monday, 2=Tuesday, ..., 7=Sunday)',
  '- Activity Title: Name of the daily activity/task',
  '- Activity Description: Details about what to do',
  '',
  'Journal Prompts Section (One row per prompt)',
  '- Prompt Class Number: Which class this prompt belongs to',
  '- Prompt Theme Number: Which theme within that class',
  '- Prompt Text: The reflection question or journaling prompt',
  '',
  'FORMAT RULES',
  '',
  'Critical Rules for Success:',
  '1. First row contains program information',
  '2. Sections must be in order: Program info, Milestones, Activities, Prompts',
  '3. Empty rows separate sections',
  '4. Use comma separation with quotes around text containing commas',
  '5. Date Format: YYYY-MM-DD (e.g., 2026-03-15)',
  '6. Time Format: HH:MM 24-hour (e.g., 14:30)',
  '7. No special characters in program slug',
  '8. Consistent sequential numbering',
  '',
  'UPLOAD PROCESS:',
  '1. Download the empty template using Download Template button',
  '2. Fill in your program information following these guidelines',
  '3. Save as .csv file',
  '4. Click Import CSV and select your file',
  '5. The system will validate all fields before importing',
  '6. Program will appear in your programs list after success',
  '',
  'TROUBLESHOOTING:',
  '',
  'Invalid date format: Ensure all dates are in YYYY-MM-DD format',
  'Invalid time format: Ensure all times are in HH:MM format',
  'Missing required field: Verify program info has all required fields',
  'Duplicate class numbers: Ensure each class number is unique',
  'Invalid category/difficulty: Check values match allowed options',
].join('\n');

export const EMPTY_CSV_TEMPLATE = `Program Title,Program Slug,Program Description,Program Category,Program Difficulty,Program Required Role,Cover Image URL,Publish Status
,,,wellness,beginner,student,,false

Class Number,Theme Number,Theme Title,Theme Description,Class Date,Class Time,Duration Minutes,Class Link

Activity Week Number,Activity Day,Activity Title,Activity Description

Prompt Class Number,Prompt Theme Number,Prompt Text`;

export interface ProgramCSVData {
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
    duration_minutes?: number;
    class_link?: string;
  }>;
  activities: Array<{
    week_number: number;
    day_of_week: number;
    task_title: string;
    task_description: string;
    activity_date?: string;
  }>;
  prompts: Array<{
    class_number: number;
    theme_number: number;
    prompt_text: string;
  }>;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
}

export function parseCSV(csvContent: string): ProgramCSVData {
  const lines = csvContent.split('\n').filter(line => line.trim());

  if (lines.length < 4) {
    throw new Error('CSV file is incomplete. Must contain program info, milestones, activities, and prompts sections.');
  }

  let lineIdx = 0;

  const programData = parseCSVLine(lines[lineIdx++]);
  const program = {
    title: programData[0]?.trim() || '',
    slug: (programData[1]?.trim() || '').toLowerCase().replace(/[^a-z0-9-]/g, ''),
    description: programData[2]?.trim() || '',
    category: programData[3]?.trim() || 'wellness',
    difficulty_level: programData[4]?.trim() || 'beginner',
    required_role: programData[5]?.trim() || 'student',
    cover_image_url: programData[6]?.trim() || '',
    is_published: (programData[7]?.trim() || 'false').toLowerCase() === 'true',
  };

  if (!program.title) throw new Error('Program title is required');
  if (!program.slug) {
    program.slug = program.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  const validCategories = ['wellness', 'yoga', 'breathwork', 'therapy'];
  if (!validCategories.includes(program.category)) {
    throw new Error(`Invalid category: ${program.category}. Must be one of: ${validCategories.join(', ')}`);
  }

  const validDifficulties = ['beginner', 'intermediate', 'advanced', 'expert', 'master', 'guru'];
  if (!validDifficulties.includes(program.difficulty_level)) {
    throw new Error(`Invalid difficulty: ${program.difficulty_level}. Must be one of: ${validDifficulties.join(', ')}`);
  }

  const validRoles = ['member', 'student', 'facilitator', 'instructor', 'guru'];
  if (!validRoles.includes(program.required_role)) {
    throw new Error(`Invalid role: ${program.required_role}. Must be one of: ${validRoles.join(', ')}`);
  }

  lineIdx++;
  const milestones: ProgramCSVData['milestones'] = [];
  while (lineIdx < lines.length && lines[lineIdx].trim()) {
    const data = parseCSVLine(lines[lineIdx++]);
    if (data.length < 7) continue;

    const classNum = parseInt(data[0]?.trim() || '0');
    const themeNum = parseInt(data[1]?.trim() || '0');
    const classDate = data[4]?.trim() || '';
    const duration = data[6] ? parseInt(data[6]?.trim()) : 60;

    if (!classNum || !themeNum) continue;
    if (classDate && !isValidDate(classDate)) {
      throw new Error(`Invalid date format: ${classDate}. Use YYYY-MM-DD`);
    }
    if (data[5] && !isValidTime(data[5])) {
      throw new Error(`Invalid time format: ${data[5]}. Use HH:MM (24-hour)`);
    }

    milestones.push({
      class_number: classNum,
      theme_number: themeNum,
      title: data[2]?.trim() || '',
      description: data[3]?.trim() || '',
      class_date: classDate,
      class_time: data[5]?.trim() || '',
      duration_minutes: isNaN(duration) ? 60 : duration,
      class_link: data[7]?.trim() || '',
    });
  }

  lineIdx++;
  const activities: ProgramCSVData['activities'] = [];
  while (lineIdx < lines.length && lines[lineIdx].trim()) {
    const data = parseCSVLine(lines[lineIdx++]);
    if (data.length < 4) continue;

    const weekNum = parseInt(data[0]?.trim() || '0');
    const dayNum = parseInt(data[1]?.trim() || '0');

    if (!weekNum || !dayNum || dayNum < 1 || dayNum > 7) continue;

    activities.push({
      week_number: weekNum,
      day_of_week: dayNum,
      task_title: data[2]?.trim() || '',
      task_description: data[3]?.trim() || '',
    });
  }

  lineIdx++;
  const prompts: ProgramCSVData['prompts'] = [];
  while (lineIdx < lines.length) {
    const data = parseCSVLine(lines[lineIdx++]);
    if (data.length < 3) continue;

    const classNum = parseInt(data[0]?.trim() || '0');
    const themeNum = parseInt(data[1]?.trim() || '0');

    if (!classNum || !themeNum) continue;

    prompts.push({
      class_number: classNum,
      theme_number: themeNum,
      prompt_text: data[2]?.trim() || '',
    });
  }

  const enrichedActivities = activities.map(activity => {
    const activityDate = calculateActivityDate(milestones, activity.week_number, activity.day_of_week);
    return {
      ...activity,
      activity_date: activityDate,
    };
  });

  return { program, milestones, activities: enrichedActivities, prompts };
}

function isValidDate(dateStr: string): boolean {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateStr)) return false;
  const date = new Date(dateStr + 'T00:00:00');
  return date instanceof Date && !isNaN(date.getTime());
}

function isValidTime(timeStr: string): boolean {
  const regex = /^\d{2}:\d{2}$/;
  if (!regex.test(timeStr)) return false;
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60;
}

function calculateActivityDate(
  milestones: ProgramCSVData['milestones'],
  weekNumber: number,
  dayOfWeek: number
): string | undefined {
  if (milestones.length === 0) return undefined;

  const firstMilestoneWithDate = milestones.find(m => m.class_date);
  if (!firstMilestoneWithDate) return undefined;

  const classDate = new Date(firstMilestoneWithDate.class_date + 'T00:00:00');
  if (isNaN(classDate.getTime())) return undefined;

  const classDateDayOfWeek = classDate.getUTCDay();
  const daysUntilActivityDay = (dayOfWeek === 7 ? 0 : dayOfWeek) - (classDateDayOfWeek === 0 ? 7 : classDateDayOfWeek);

  const activityDate = new Date(classDate);
  activityDate.setUTCDate(activityDate.getUTCDate() + (weekNumber - 1) * 7 + daysUntilActivityDay);

  return activityDate.toISOString().split('T')[0];
}

export function downloadTemplate(): void {
  const content = EMPTY_CSV_TEMPLATE;
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', 'program_template.csv');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
