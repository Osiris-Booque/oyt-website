export const EXAMPLE_CSV_CONTENT = `Spring Renewal Program,spring-renewal,"A comprehensive 4-week program combining yoga, breathwork, and mindfulness for spring renewal",wellness,intermediate,student,https://example.com/spring-image.jpg,true

1,1,"Awakening","Begin your spring journey with grounding practices","2026-03-15","10:00","https://zoom.us/j/123456789"
1,2,"Foundation","Build strength through foundational yoga postures","2026-03-15","11:00",
2,1,"Flow","Experience dynamic movement and breath connection","2026-03-22","10:00","https://zoom.us/j/987654321"
2,2,"Release","Let go of winter stagnation through gentle stretching","2026-03-22","11:00",
3,1,"Balance","Find equilibrium in body and mind","2026-03-29","10:00","https://zoom.us/j/456789123"
3,2,"Breathe","Deepen your pranayama practice","2026-03-29","11:00",
4,1,"Integration","Integrate all teachings into daily life","2026-04-05","10:00","https://zoom.us/j/789123456"
4,2,"Celebration","Celebrate your transformation and growth","2026-04-05","11:00",

1,1,"Morning Sun Salutation","Practice 5 rounds of surya namaskar in the morning light"
1,2,"Afternoon Meditation","Sit quietly for 10 minutes in meditation"
1,3,"Evening Reflection","Journal about what awakened in you today"
2,1,"Strength Building","Hold plank pose for 30 seconds, 3 times"
2,2,"Afternoon Flow","Move through 5 sun salutations with awareness"
2,3,"Gratitude Practice","Write 3 things you're grateful for"
3,1,"Balance Practice","Work on single-leg standing poses for stability"
3,2,"Breathing Exercises","Practice alternate nostril breathing for 5 minutes"
3,3,"Body Scan","Do a full body awareness scan before bed"
4,1,"Integration Practice","Combine all practices into one session"
4,2,"Share Your Journey","Write about your transformation"
4,3,"Plan Forward","Design your continued practice"

1,1,"What does renewal mean to you?"
1,1,"How do you want to feel in spring?"
1,2,"What are you ready to let go of?"
2,1,"How does your body feel today?"
2,1,"What do you need to feel strong?"
2,2,"What emotion comes up in release?"
3,1,"Where do you seek balance in life?"
3,1,"How does breathing affect your state?"
3,2,"What patterns are you noticing?"
4,1,"How have you transformed?"
4,1,"What will you continue practicing?"
4,2,"How will you share this with others?"`;

export function getExampleCSVBlob(): Blob {
  return new Blob([EXAMPLE_CSV_CONTENT], { type: 'text/csv;charset=utf-8;' });
}
