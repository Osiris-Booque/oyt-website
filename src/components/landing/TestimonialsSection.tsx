import { Star, Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Maria Gonzalez',
    role: 'Yoga & Therapy Client',
    image: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    quote: 'After years of chronic back pain and anxiety, the combination of yoga and therapy here changed everything. I finally feel like myself again.',
    rating: 5,
  },
  {
    name: 'James Mitchell',
    role: 'Breathwork Participant',
    image: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    quote: 'The breathwork sessions gave me tools I use every single day. My sleep improved within the first week, and the anxiety I carried for years has genuinely lifted.',
    rating: 5,
  },
  {
    name: 'Priya Sharma',
    role: 'Training Program Graduate',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    quote: 'The practitioner training exceeded every expectation. The mentorship was world-class, and I launched my own wellness practice within three months of graduating.',
    rating: 5,
  },
];

export default function Testimonials() {
  return (
    <section className="section bg-white">
      <div className="container-wide">
        <div className="text-center mb-10 sm:mb-16 lg:mb-20">
          <p className="text-sage-600 font-medium tracking-widest uppercase text-sm mb-4">Testimonials</p>
          <h2 className="font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-primary mb-4 sm:mb-6">
            Stories from our community
          </h2>
          <p className="text-base sm:text-lg text-secondary max-w-2xl mx-auto">
            Real experiences from clients and graduates who have walked the path of holistic wellness.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-body rounded-2xl p-6 sm:p-8 relative hover:shadow-lg transition-shadow duration-300"
            >
              <Quote className="w-8 sm:w-10 h-8 sm:h-10 text-sage-200 mb-4 sm:mb-6" />

              <div className="flex gap-1 mb-4 sm:mb-6">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                ))}
              </div>

              <p className="text-primary leading-relaxed mb-6 sm:mb-8 text-base sm:text-lg">
                "{testimonial.quote}"
              </p>

              <div className="flex items-center gap-3 sm:gap-4 pt-4 sm:pt-6 border-t border-stone-200">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-10 sm:w-12 h-10 sm:h-12 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-primary text-sm sm:text-base">{testimonial.name}</div>
                  <div className="text-secondary text-xs sm:text-sm">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
