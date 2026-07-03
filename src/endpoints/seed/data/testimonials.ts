// Testimonial seed data transcribed from the design reference home page.
// Placeholder content — fully editable in the admin.

export type TestimonialSeed = {
  quote: string
  authorRole: string
  rating: number
  order: number
  featured: boolean
}

export const TESTIMONIALS: TestimonialSeed[] = [
  {
    quote:
      'VERIFY consistently delivers high-quality reports within tight timeframes. Their coordination of specialists is seamless, and the communication throughout the process is excellent.',
    authorRole: 'Senior Associate, Legal Firm — Brisbane',
    rating: 5,
    order: 1,
    featured: true,
  },
  {
    quote:
      'The team at VERIFY is professional, responsive, and thorough. I have complete confidence in the quality of the expert reports they coordinate — they make a complex process straightforward.',
    authorRole: 'Claims Manager, Insurance Provider',
    rating: 5,
    order: 2,
    featured: true,
  },
  {
    quote:
      'Working with VERIFY has been a pleasure. Their understanding of the medico-legal landscape, and their genuine care for both clients and claimants, truly sets them apart in the industry.',
    authorRole: 'Solicitor, Personal Injury Practice',
    rating: 5,
    order: 3,
    featured: true,
  },
]
