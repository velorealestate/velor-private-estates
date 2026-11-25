export const images = {
  hero: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/inspo-04.jfif-9MLr5iu8FrwKR3tx3sbdJ30doJkqR7.jpeg',
  tropicalEstate: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/inspo-1.2.jfif-6zEewxPnxAzZADCGp8UuzvaJTn5ngX.jpeg',
  penthouse: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/inspo-07.jfif-B18eCzK2ooWXsDEvR9wQ0OOvvJhtVI.jpeg',
  mountainResidence: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/inspo-03.jfif-4YLIRYXtJsPTfGtIQytm3pPRv35Tzk.jpeg',
  stair: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/inspo-1.4.jfif-YdUgHJpS9FWH54RuzELl9dCmM9dttQ.jpeg',
  tropicalCourtyard: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/inspo-1.1.jfif-0EzuFuXdyUS6Z8m9qQTF7OcpqGETET.jpeg',
  entrance: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/inspo-09.jfif-eT5ywRTtmYSDY4z2LZJYiOHP4U0EmH.jpeg',
  coastline: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/inspo-1.0.jfif-Fkp7TettaHZ8EMYW6kAUcW7ILWS7q0.jpeg',
  city: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/WhatsApp%20Image%202026-11-18%20at%2013.47.06-tojP5DMzIqHf0lmfGqawNz5zNhpdjX.jpeg',
  tower: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/inspo-06.jfif-G3OfBJCwGVcfXV8Dhq4E6M26srSAtV.jpeg',
  material: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/inspo-1.3.jfif-f7zBXj0kuxZrfGtmFSopEe8JPRwqqZ.jpeg',
  blueHour: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/inspo-02.jfif-nKHXNyhdReQWmpBBx27cASAnnkkO31.jpeg',
  courtyard: '/images/velor-private-courtyard.png',
}

export type GalleryImage = {
  src: string
  alt: string
  caption: string
  material: string
}

export type Residence = {
  slug: string
  number: string
  name: string
  descriptor: string
  location: string
  image: string
  alt: string
  summary: string
  description: string
  specifications: { label: string; value: string }[]
  materials: string[]
  gallery: GalleryImage[]
  related: string[]
}

export const residences: Residence[] = [
  {
    slug: 'the-estate',
    number: '001',
    name: 'The Estate',
    descriptor: 'Tropical / Private estate',
    location: 'A landscape-led residence / illustrative study',
    image: images.tropicalEstate,
    alt: 'Aerial view across a contemporary stone estate, reflecting pools and tropical canopy.',
    summary: 'An exceptional private residence with a quiet architectural presence, shaped around water, stone and the surrounding canopy.',
    description: 'The Estate is imagined as a sequence of calm, open rooms. Pale stone holds the light; timber brings a measured warmth; water gathers the garden into the architecture. The result is less an object in the landscape than a place in conversation with it.',
    specifications: [
      { label: 'Collection', value: '001 / The Estate' },
      { label: 'Setting', value: 'Tropical landscape' },
      { label: 'Architectural language', value: 'Contemporary, low-rise' },
      { label: 'Collection status', value: 'Illustrative concept' },
    ],
    materials: ['Pale natural stone', 'Bronze-toned joinery', 'Reflecting water', 'Canopy planting'],
    gallery: [
      { src: images.tropicalEstate, alt: 'The Estate viewed from above, surrounded by tropical foliage.', caption: 'The residence, held within the landscape', material: 'Landscape / stone / water' },
      { src: images.tropicalCourtyard, alt: 'A pale stone courtyard opening toward palms and a reflecting pool.', caption: 'A courtyard open to the canopy', material: 'Water / glass / planting' },
      { src: images.entrance, alt: 'A sculptural stone entrance with a deep shadow line and timber door.', caption: 'A considered threshold', material: 'Stone / shadow / timber' },
      { src: images.material, alt: 'Sculptural contemporary architecture set against garden foliage.', caption: 'Form in the garden', material: 'Limestone / foliage' },
    ],
    related: ['the-residence', 'the-sanctuary'],
  },
  {
    slug: 'the-residence',
    number: '002',
    name: 'The Residence',
    descriptor: 'Urban / Panoramic living',
    location: 'A city address / illustrative study',
    image: images.penthouse,
    alt: 'A serene contemporary residence with sculptural furnishings and a wide city view.',
    summary: 'A considered urban home where calm interiors, generous glazing and the distant horizon bring the city into focus.',
    description: 'The Residence is an exercise in proportion. A quiet palette lets the view lead; crafted surfaces introduce depth without distraction. Across the day, the changing city becomes part of the interior—an evolving artwork, framed but never contained.',
    specifications: [
      { label: 'Collection', value: '002 / The Residence' },
      { label: 'Setting', value: 'Urban / elevated' },
      { label: 'Architectural language', value: 'Contemporary, considered' },
      { label: 'Collection status', value: 'Illustrative concept' },
    ],
    materials: ['Honed limestone', 'Smoked oak', 'Architectural glazing', 'Softly brushed bronze'],
    gallery: [
      { src: images.penthouse, alt: 'A light-filled contemporary living room framed by a city panorama.', caption: 'A room shaped by the view', material: 'Light / glass / proportion' },
      { src: images.tower, alt: 'A sculptural residential tower at blue hour, its interior softly illuminated.', caption: 'An urban silhouette at dusk', material: 'Glass / bronze / sky' },
      { src: images.city, alt: 'A broad view across Nairobi toward the green horizon beyond the city.', caption: 'The city in relation to its landscape', material: 'Horizon / canopy / city' },
      { src: images.stair, alt: 'A floating staircase and refined stone interior in soft daylight.', caption: 'A measured transition between rooms', material: 'Stone / timber / light' },
    ],
    related: ['the-estate', 'the-sanctuary'],
  },
  {
    slug: 'the-sanctuary',
    number: '003',
    name: 'The Sanctuary',
    descriptor: 'Alpine / Private retreat',
    location: 'A mountain landscape / illustrative study',
    image: images.mountainResidence,
    alt: 'A contemporary glass and stone residence nestled below a dramatic mountain range at dusk.',
    summary: 'A secluded retreat drawn into the mountain edge, its long views and sheltered rooms finding a deliberate balance.',
    description: 'The Sanctuary is conceived as a quiet counterpoint to its setting. Deep reveals frame the distant ridgeline; stone walls anchor the home to the slope; carefully placed glass gathers changing weather and light. Privacy is expressed through orientation, not enclosure.',
    specifications: [
      { label: 'Collection', value: '003 / The Sanctuary' },
      { label: 'Setting', value: 'Mountain / secluded' },
      { label: 'Architectural language', value: 'Contemporary, landscape-led' },
      { label: 'Collection status', value: 'Illustrative concept' },
    ],
    materials: ['Local stone', 'Dark bronze screens', 'Low-reflection glass', 'Native planting'],
    gallery: [
      { src: images.mountainResidence, alt: 'The Sanctuary set against a dramatic mountain skyline at twilight.', caption: 'A retreat at the edge of the ridgeline', material: 'Stone / glass / mountain' },
      { src: images.blueHour, alt: 'A glass-walled residence at twilight beside a reflecting pool.', caption: 'The last light held in water', material: 'Water / shadow / glass' },
      { src: images.coastline, alt: 'A contemporary residence opening to a distant horizon and water.', caption: 'An outlook beyond the room', material: 'Horizon / stone / air' },
      { src: images.entrance, alt: 'A deep-set entrance framed by a sculptural stone overhang.', caption: 'Arrival through a protected threshold', material: 'Stone / recess / shade' },
    ],
    related: ['the-estate', 'the-residence'],
  },
]

export type Destination = {
  slug: string
  number: string
  name: string
  location: string
  image: string
  alt: string
  introduction: string
  highlights: string[]
  mapTitle: string
  mapEmbed: string
  mapLink: string
  residences: string[]
}

export const destinations: Destination[] = [
  {
    slug: 'nairobi',
    number: '01',
    name: 'Nairobi',
    location: 'Kenya / City and landscape',
    image: images.city,
    alt: 'An elevated view across Nairobi, with green neighborhoods and the Ngong Hills on the horizon.',
    introduction: 'A city of layered horizons, generous green neighborhoods and an uncommon closeness to the landscape beyond its edge. Nairobi rewards a slower reading: a garden wall, a distant ridge, a quieter street just beyond the familiar.',
    highlights: ['A green metropolitan character', 'A horizon shaped by the Ngong Hills', 'Contemporary architecture in conversation with landscape'],
    mapTitle: 'Interactive map of Nairobi and its wider urban context',
    mapEmbed: 'https://www.openstreetmap.org/export/embed.html?bbox=36.70%2C-1.40%2C36.96%2C-1.16&layer=mapnik',
    mapLink: 'https://www.openstreetmap.org/?#map=12/-1.2864/36.8172',
    residences: ['the-residence', 'the-estate'],
  },
  {
    slug: 'the-coast',
    number: '02',
    name: 'The Coast',
    location: 'Indian Ocean / Coastal study',
    image: images.coastline,
    alt: 'A contemporary coastal home with a broad terrace facing the open water.',
    introduction: 'Along the coast, architecture makes room for salt air, filtered light and a horizon that shifts with the hour. The most compelling places balance openness with shade, and long views with a sense of retreat.',
    highlights: ['Long horizons and coastal light', 'Shaded outdoor rooms', 'Natural stone, timber and water'],
    mapTitle: 'Interactive regional map of Mombasa and the Indian Ocean coast',
    mapEmbed: 'https://www.openstreetmap.org/export/embed.html?bbox=39.55%2C-4.15%2C39.80%2C-3.92&layer=mapnik',
    mapLink: 'https://www.openstreetmap.org/?#map=11/-4.0435/39.6682',
    residences: ['the-estate', 'the-sanctuary'],
  },
  {
    slug: 'the-highlands',
    number: '03',
    name: 'The Highlands',
    location: 'Alpine landscapes / Regional study',
    image: images.mountainResidence,
    alt: 'A secluded modern residence beneath a mountain range in the last light of day.',
    introduction: 'In the highlands, atmosphere is part of the architecture. Deep reveals, tactile stone and carefully framed outlooks make a home of changing cloud, distant ridgelines and the quiet between them.',
    highlights: ['Sheltered, contemplative settings', 'Mountain views and changing weather', 'Architecture embedded in the terrain'],
    mapTitle: 'Interactive regional map of the Alpine landscape near Zermatt',
    mapEmbed: 'https://www.openstreetmap.org/export/embed.html?bbox=7.55%2C45.90%2C7.90%2C46.10&layer=mapnik',
    mapLink: 'https://www.openstreetmap.org/?#map=11/46.0207/7.7491',
    residences: ['the-sanctuary', 'the-estate'],
  },
]

export type Story = {
  slug: string
  number: string
  category: string
  title: string
  image: string
  alt: string
  readTime: string
  standfirst: string
  paragraphs: string[]
  pullQuote: string
  annotation: string
  related: string[]
}

export const stories: Story[] = [
  {
    slug: 'material-becomes-memory',
    number: '01',
    category: 'Architecture / Material',
    title: 'When material becomes memory',
    image: images.stair,
    alt: 'Daylight crossing a pale stone wall beside a floating architectural staircase.',
    readTime: '4 minute read',
    standfirst: 'The surfaces we live with do more than finish a room. They hold the changing light, the trace of a hand and the quiet passage of time.',
    paragraphs: [
      'A material is first encountered through the eye, then understood through touch. Honed stone softens a hard edge. Timber introduces a warmth that changes through the day. Bronze gathers the marks of use rather than resisting them.',
      'In a considered residence, these choices are never applied as decoration. They help shape the atmosphere of a room: the way a threshold is crossed, how light settles on a wall, where a hand naturally comes to rest.',
      'The most enduring interiors are not defined by a single finish. They are composed through contrast and restraint, with enough texture to invite attention and enough quiet to let a life unfold around them.',
    ],
    pullQuote: 'Material is not a surface to look at. It is part of the way a place is remembered.',
    annotation: 'A study in light, stone and the detail of a threshold.',
    related: ['a-room-shaped-by-the-view', 'the-quiet-intelligence-of-a-garden'],
  },
  {
    slug: 'a-room-shaped-by-the-view',
    number: '02',
    category: 'The considered life',
    title: 'A room shaped by the view',
    image: images.penthouse,
    alt: 'Sculptural ivory furnishings set against a broad city panorama.',
    readTime: '3 minute read',
    standfirst: 'A horizon can become more than a backdrop. When a room is composed around it, the view gives the interior its rhythm.',
    paragraphs: [
      'The instinct to fill a room can be strong. Yet a generous view often asks for the opposite: fewer interruptions, a careful seat, and a line of sight that remains open from the moment one enters.',
      'Proportion does the quiet work. Furniture is set low enough for the skyline to remain present. Materials stay close to the tones of the landscape. Reflections are managed so that glass feels like a frame, not a barrier.',
      'As the city changes from morning to evening, the room changes with it. Light moves across the floor; distant windows begin to glow. The architecture gives this daily movement a place to belong.',
    ],
    pullQuote: 'The view is not an amenity. It is another room, held at a distance.',
    annotation: 'A composition of horizon, proportion and stillness.',
    related: ['material-becomes-memory', 'the-quiet-intelligence-of-a-garden'],
  },
  {
    slug: 'the-quiet-intelligence-of-a-garden',
    number: '03',
    category: 'Landscape / Living',
    title: 'The quiet intelligence of a garden',
    image: images.tropicalEstate,
    alt: 'A private residence and reflecting pools nested inside a dense tropical garden.',
    readTime: '5 minute read',
    standfirst: 'The best landscapes do not compete with architecture. They make its edges more generous and its rooms feel connected to the living world.',
    paragraphs: [
      'A garden begins with attention: to the existing ground, the direction of light, the movement of water and the character of the plants already there. A strong design listens before it draws.',
      'Walls can create privacy without cutting a place off from its setting. A courtyard gathers scent and shade; a reflecting pool draws the sky down to eye level; a tree becomes a marker of time rather than a piece of scenery.',
      'When the landscape is treated as part of the architecture, the boundary between inside and out becomes a sequence of invitations. Doors open. Materials continue. The garden enters the rhythm of the home.',
    ],
    pullQuote: 'A garden makes architecture more generous by giving it something living to answer to.',
    annotation: 'The landscape is not an amenity. It is part of the plan.',
    related: ['material-becomes-memory', 'a-room-shaped-by-the-view'],
  },
]
