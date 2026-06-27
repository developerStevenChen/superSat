/**
 * BASSC speed skating club - data structures
 * In production, all data comes from the backend API; these are English defaults.
 */

// Homepage hero carousel
export const homePagePic = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80',
    title: 'Journey of Disciples',
    description:
      'Youth speed skating training program in Santa Clara and San Mateo. Focused on developing the next generation of speed skating athletes in Silicon Valley.',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1920&q=80',
    title: 'Journey of Disciples',
    description:
      'Youth speed skating training program in Santa Clara and San Mateo. Focused on developing the next generation of speed skating athletes in Silicon Valley.',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=1920&q=80',
    title: 'Journey of Disciples',
    description:
      'Focused on developing the next generation of speed skating athletes in Silicon Valley.',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=1920&q=80',
    title: 'Journey of Disciples',
    description:
      'Youth speed skating training program in Santa Clara and San Mateo. Focused on developing the next generation of speed skating athletes in Silicon Valley.',
  },
];

// Boards: four key highlights on the homepage
export const boards = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80',
    title: 'Journey of Disciples',
    description:
      'Youth speed skating training program in Santa Clara and San Mateo. Focused on developing the next generation of speed skating athletes in Silicon Valley.',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=400&q=80',
    title: 'Programs',
    description:
      'Youth speed skating training program in Santa Clara and San Mateo. Focused on developing the next generation of speed skating athletes in Silicon Valley.',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=400&q=80',
    title: 'Coaching',
    description:
      'Focused on developing the next generation of speed skating athletes in Silicon Valley.',
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=400&q=80',
    title: 'Competition',
    description:
      'Youth speed skating training in Santa Clara and San Mateo. Focused on developing the next generation of speed skating athletes in Silicon Valley.',
  },
];

// Introduction carousel (About the Club)
export const introductions = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    title: 'Journey of Disciples',
    text:
      'Bay Area EVD Speed Skating Club. Youth speed skating training program in Santa Clara and San Mateo. Focused on developing the next generation of speed skating athletes in Silicon Valley. Our athletes train with purpose, discipline, and passion—developing not only world-class skating skills, but also strength, resilience, and a lifelong love for the sport.',
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=800&q=80',
    title: 'How we train',
    text:
      'Training blends on-ice technique, starts and corners, race strategy, and off-ice strength and mobility. Groups are organized by age and skill. Focused on developing the next generation of speed skating athletes in Silicon Valley.',
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=800&q=80',
    title: 'Why families choose us',
    text:
      'Youth speed skating training program in Santa Clara and San Mateo. Focused on developing the next generation of speed skating athletes in Silicon Valley. Dedicated coaches, clear progression paths, race support, and a community that celebrates effort as much as medals.',
  },
];

// News list (default when API empty)
export const newsList = [
  {
    id: 1,
    primPic: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
      'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1200&q=80',
      'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=1200&q=80',
    ],
    title: 'Spring time trial highlights',
    intro:
      'Our skaters opened the season with a full‑club time trial, testing starts, corners, and race focus after the winter training block.',
    content:
      'Our spring time trial brought together youth skaters from across the club for a full weekend of racing. Athletes skated multiple distances, worked on pacing and passing, and learned how to manage nerves on the start line. Coaches used the results to fine‑tune training plans leading into summer competitions, with an emphasis on strong technique and confidence in race situations.',
  },
  {
    id: 2,
    primPic: 'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1200&q=80',
      'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=1200&q=80',
    ],
    title: 'Summer speed skating camp',
    intro:
      'Registration is open for our summer speed skating camp for youth skaters in the Bay Area.',
    content:
      'The summer camp is designed for skaters who want a focused block of training while school is out. Groups are organized by age and level, from new skaters learning efficient pushes and basic cornering to experienced racers working on race tactics and dryland strength. Each week blends off‑ice training, on‑ice drills, and games so athletes stay engaged and keep building their love for the sport.',
  },
  {
    id: 3,
    primPic: 'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1517963879433-6ad2b056d712?w=1200&q=80',
      'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
    ],
    title: 'Athletes selected for next‑level training',
    intro:
      'Several club skaters have been invited to train with higher‑level programs after strong results in regional races.',
    content:
      'After multiple seasons of consistent work, several Bay Area EVD athletes were invited to join advanced training groups and development teams. Their progress shows what is possible when athletes commit to regular practice and thoughtful coaching. We are proud of their achievements and excited to support the next steps in their speed skating journey.',
  },
  {
    id: 4,
    primPic: 'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=600&q=80',
    images: [
      'https://images.unsplash.com/photo-1541625602330-2277a4c46182?w=1200&q=80',
    ],
    title: 'Weekend intro sessions for new skaters',
    intro:
      'Curious about speed skating? Our weekend intro sessions let kids try the sport in a safe, welcoming environment.',
    content:
      'Intro sessions are designed for brand‑new skaters. Coaches cover helmet and gear checks, safe falling, basic balance, and first glides on the ice. All equipment can be provided, and families get a chance to ask questions about next steps in our programs. Spots are limited so each skater gets attention from coaches.',
  },
];

// Nav (placeholder links; labels in English)
export const navItems = [
  { id: 'class', label: 'Program', path: '/program' },
  { id: 'class_schedule', label: 'Activity Schedule', path: '/class-schedule' },
  { id: 'event', label: 'Events', path: '/event' },
  { id: 'athlete', label: 'Shares', path: '/athlete' },
  { id: 'coach', label: 'Coach', path: '/coach' },
  { id: 'news', label: 'News', path: '/news' },
  { id: 'contact', label: 'Contact', path: '/contact' },
];

/** Default homepage data when API returns empty or fails */
export const defaultHomepage = {
  homePagePic,
  boards,
  introductions,
  pathway: null,
  classes: [],
  newsList,
  navItems,
};
