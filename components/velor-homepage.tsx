'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight, Menu, Pause, Play, X } from 'lucide-react'
import { destinations, images, residences, stories } from '@/components/velor-content'
import { VelorExperienceLayer, type VelorExperience } from '@/components/velor-experience'

const navigation = [
  { label: 'The collection', href: '#collection' },
  { label: 'Santorini Residences', href: '#santorini' },
  { label: 'Available residences', href: '/listings' },
  { label: 'Destinations', href: '#destinations' },
  { label: 'The perspective', href: '#perspective' },
  { label: 'Our philosophy', href: '#philosophy' },
]

const primaryNavigation = [
  { label: 'The collection', href: '#collection' },
  { label: 'Santorini', href: '#santorini' },
  { label: 'Destinations', href: '#destinations' },
  { label: 'Perspective', href: '#perspective' },
]

const heroSlides = [
  {
    id: 'aerial',
    title: 'Elevated gardens',
    src: images.santoriniAerial,
    alt: 'Aerial view of Santorini Residences, with sculptural rooftop gardens and illuminated pools above a leafy city.',
  },
  {
    id: 'facade',
    title: 'The city silhouette',
    src: images.santoriniFacade,
    alt: 'Santorini Residences at blue hour, its curved glass facade outlined in warm light.',
  },
  {
    id: 'garden',
    title: 'A garden retreat',
    src: images.santoriniGarden,
    alt: 'A landscaped Santorini courtyard with mature trees, pale stone paths and a sculptural fountain.',
  },
  {
    id: 'rooftop',
    title: 'The rooftop landscape',
    src: images.santoriniRooftop,
    alt: 'Overhead view of the Santorini rooftop, with curved terraces, planted seating and pools.',
  },
]

function BrandWordmark({ light = true }: { light?: boolean }) {
  return (
    <span className={`brand-lockup${light ? ' brand-lockup-light' : ''}`}>
      <span className="brand-name">
        <span className="sr-only">Velor</span>
        <span className="brand-name-letters" aria-hidden="true">
          <span>V</span><span>e</span><span>l</span><span>o</span><span>r</span>
        </span>
      </span>
      <span className="brand-descriptor">PRIVATE ESTATES</span>
    </span>
  )
}

function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={`eyebrow ${className}`}>{children}</span>
}

function ArrowLink({ children, href, className = '' }: { children: React.ReactNode; href: string; className?: string }) {
  return (
    <a className={`arrow-link ${className}`} href={href}>
      <span>{children}</span>
      <ArrowRight aria-hidden="true" size={15} strokeWidth={1.2} />
    </a>
  )
}

function ExperienceLink({ children, onClick, className = '' }: { children: React.ReactNode; onClick: () => void; className?: string }) {
  return (
    <button className={`arrow-link experience-link ${className}`} type="button" onClick={onClick}>
      <span>{children}</span>
      <ArrowRight aria-hidden="true" size={15} strokeWidth={1.2} />
    </button>
  )
}

function SiteHeader({ onOpenExperience }: { onOpenExperience: (next: VelorExperience) => void }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const toggleRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 36)
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        return
      }
      if (event.key !== 'Tab' || !menuRef.current) return

      const focusable = menuRef.current.querySelectorAll<HTMLElement>('a[href], button:not([disabled])')
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', handleKeyDown)
      toggleRef.current?.focus()
    }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className={`site-header${scrolled ? ' site-header-scrolled' : ''}`}>
        <a className="brand-home" href="#top" aria-label="Velor Private Estates home">
          <BrandWordmark />
        </a>
        <nav className="desktop-nav" aria-label="Main navigation">
          {primaryNavigation.map((item) => (
            <a href={item.href} key={item.href}>{item.label}</a>
          ))}
        </nav>
        <button
          className="header-enquiry"
          type="button"
          onClick={() => onOpenExperience({ kind: 'enquiry', enquiryType: 'consultation' })}
        >
          <span>Private office</span>
          <ArrowUpRight aria-hidden="true" size={14} strokeWidth={1.1} />
        </button>
        <button
          ref={toggleRef}
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={menuOpen}
          aria-controls="velor-menu"
          onClick={() => setMenuOpen((open) => !open)}
        >
          {menuOpen ? <X aria-hidden="true" size={21} strokeWidth={1.1} /> : <Menu aria-hidden="true" size={22} strokeWidth={1.1} />}
        </button>
      </header>
      {menuOpen && (
        <div className="menu-overlay" id="velor-menu" ref={menuRef} role="dialog" aria-modal="true" aria-label="Velor navigation">
          <div className="menu-overlay-top">
            <BrandWordmark />
            <button ref={closeRef} className="menu-toggle menu-close" type="button" onClick={closeMenu} aria-label="Close navigation menu">
              <X aria-hidden="true" size={23} strokeWidth={1.1} />
            </button>
          </div>
          <div className="menu-overlay-grid">
            <nav className="menu-overlay-links" aria-label="Full-screen navigation">
              {navigation.map((item, index) => (
                <a href={item.href} key={item.href} onClick={closeMenu}>
                  <span className="menu-number">0{index + 1}</span>
                  <span>{item.label}</span>
                  <ArrowUpRight aria-hidden="true" size={23} strokeWidth={1} />
                </a>
              ))}
              <button
                className="menu-enquiry-link"
                type="button"
                onClick={() => {
                  closeMenu()
                  onOpenExperience({ kind: 'enquiry', enquiryType: 'consultation' })
                }}
              >
                <span className="menu-number">07</span>
                <span>Private enquiries</span>
                <ArrowUpRight aria-hidden="true" size={23} strokeWidth={1} />
              </button>
              <a href="/sign-in" onClick={closeMenu}>
                <span className="menu-number">08</span>
                <span>Client portal</span>
                <ArrowUpRight aria-hidden="true" size={23} strokeWidth={1} />
              </a>
            </nav>
            <figure className="menu-feature image-frame">
              <img src={images.hero} alt="A contemporary residence at blue hour, opening onto a reflecting pool." loading="lazy" />
              <figcaption>
                <Eyebrow className="eyebrow-bronze">The living gallery</Eyebrow>
                <span>Architecture, considered<br />beyond the address.</span>
              </figcaption>
            </figure>
          </div>
          <p className="menu-signoff">Beyond the address.</p>
        </div>
      )}
    </>
  )
}

function Hero() {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setIsPlaying(true)
  }, [])

  useEffect(() => {
    if (!isPlaying) return

    const interval = window.setInterval(() => {
      if (!document.hidden) {
        setActiveSlide((current) => (current + 1) % heroSlides.length)
      }
    }, 7000)

    return () => window.clearInterval(interval)
  }, [isPlaying])

  function moveSlide(direction: -1 | 1) {
    setActiveSlide((current) => (current + direction + heroSlides.length) % heroSlides.length)
  }

  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      {heroSlides.map((slide, index) => (
        <img
          key={slide.id}
          className={`hero-image hero-image--${slide.id}${index === activeSlide ? ' hero-image-active' : ''}`}
          src={slide.src}
          alt={slide.alt}
          aria-hidden={index !== activeSlide}
          fetchPriority={index === activeSlide ? 'high' : 'auto'}
          loading={index === activeSlide ? 'eager' : 'lazy'}
          draggable="false"
        />
      ))}
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-content page-gutter">
        <Eyebrow className="hero-eyebrow">A different perspective on private property</Eyebrow>
        <h1 id="hero-title">Beyond the<br /><em>address.</em></h1>
        <p className="hero-description">An exceptional collection of residences, selected for their architecture, character and extraordinary sense of place.</p>
        <ArrowLink href="#collection" className="hero-cta">Discover the collection</ArrowLink>
      </div>
      <div className="hero-footer page-gutter">
        <span className="hero-location">Selected residences&nbsp; / &nbsp;Worldwide</span>
        <div className="hero-controls" role="group" aria-label="Hero slideshow controls">
          <button className="hero-control-button" type="button" onClick={() => moveSlide(-1)} aria-label="Show previous hero image">
            <ChevronLeft aria-hidden="true" size={16} strokeWidth={1.1} />
          </button>
          <span className="hero-index" aria-live={isPlaying ? 'off' : 'polite'} aria-atomic="true">
            {String(activeSlide + 1).padStart(2, '0')} <i>/</i> {String(heroSlides.length).padStart(2, '0')}
          </span>
          <div className="hero-pagination" role="group" aria-label="Choose a hero image">
            {heroSlides.map((slide, index) => (
              <button
                className="hero-pagination-item"
                key={slide.id}
                type="button"
                aria-label={`Show image ${index + 1}: ${slide.title}`}
                aria-pressed={index === activeSlide}
                onClick={() => setActiveSlide(index)}
              >
                <span className="hero-pagination-line" aria-hidden="true" />
              </button>
            ))}
          </div>
          <button className="hero-control-button" type="button" onClick={() => moveSlide(1)} aria-label="Show next hero image">
            <ChevronRight aria-hidden="true" size={16} strokeWidth={1.1} />
          </button>
          <button
            className="hero-control-button hero-play-toggle"
            type="button"
            onClick={() => setIsPlaying((playing) => !playing)}
            aria-label={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
            aria-pressed={isPlaying}
          >
            {isPlaying ? <Pause aria-hidden="true" size={13} strokeWidth={1.2} /> : <Play aria-hidden="true" size={13} strokeWidth={1.2} />}
          </button>
        </div>
        <a href="#philosophy" className="scroll-cue" aria-label="Scroll to our philosophy">
          <span>Scroll to discover</span><span className="scroll-cue-line" aria-hidden="true" /><ArrowDown aria-hidden="true" size={13} strokeWidth={1} />
        </a>
      </div>
    </section>
  )
}

function Philosophy() {
  return (
    <section className="philosophy section-ivory" id="philosophy" tabIndex={-1} aria-labelledby="philosophy-title">
      <div className="philosophy-grid page-gutter">
        <div className="philosophy-aside">
          <Eyebrow>Our point of view</Eyebrow>
          <span className="section-number">01</span>
          <span className="aside-rule" aria-hidden="true" />
          <p>Beyond the address.<br />Beyond the expected.</p>
        </div>
        <div className="philosophy-main">
          <h2 id="philosophy-title">There is a difference between finding a property and discovering a place that feels entirely your own.</h2>
          <div className="philosophy-copy">
            <p>At VELOR, we believe exceptional property is defined by more than its address. It is found in architecture, proportion, craftsmanship, location and the feeling a place creates.</p>
            <p>Our approach is guided by a considered appreciation of extraordinary residences and the people who bring them to life.</p>
          </div>
          <figure className="philosophy-image image-frame">
            <img loading="lazy" src={images.stair} alt="A sunlit travertine interior with a floating staircase, glass balustrade and sculptural olive trees." />
            <figcaption><span>Architecture, in balance</span><span>Light / stone / space</span></figcaption>
          </figure>
        </div>
      </div>
      <div className="philosophy-signature page-gutter">
        <span className="fine-rule" aria-hidden="true" />
        <span className="display-text">A considered way of seeing.</span>
        <Eyebrow>VELOR / 01</Eyebrow>
      </div>
    </section>
  )
}

function PropertyFeature({
  residence,
  className,
  onOpenExperience,
}: {
  residence: (typeof residences)[number]
  className: string
  onOpenExperience: (next: VelorExperience) => void
}) {
  return (
    <article className={`property-feature ${className}`} data-reveal>
      <button
        className="property-image image-frame"
        type="button"
        onClick={() => onOpenExperience({ kind: 'residence', slug: residence.slug })}
        aria-label={`Discover ${residence.name}`}
      >
        <img loading="lazy" src={residence.image} alt={residence.alt} />
        <span className="image-index">{residence.number} &nbsp; / &nbsp; VELOR COLLECTION</span>
        <span className="image-discover" aria-hidden="true"><ArrowUpRight size={20} strokeWidth={1} /></span>
      </button>
      <div className="property-caption">
        <div>
          <Eyebrow>{residence.descriptor}</Eyebrow>
          <h3>{residence.name}</h3>
        </div>
        <p>{residence.summary}</p>
      </div>
      <button
        className="property-gallery-link"
        type="button"
        onClick={() => onOpenExperience({ kind: 'gallery', title: residence.name, images: residence.gallery })}
      >
        Explore gallery <ArrowUpRight aria-hidden="true" size={15} strokeWidth={1.1} />
      </button>
    </article>
  )
}

function Collection({ onOpenExperience }: { onOpenExperience: (next: VelorExperience) => void }) {
  const featureClasses = ['property-estate', 'property-residence', 'property-sanctuary']

  return (
    <section className="collection section-obsidian" id="collection" aria-labelledby="collection-title">
      <div className="collection-heading page-gutter" data-reveal>
        <div><Eyebrow className="eyebrow-bronze">A curated collection / 001—003</Eyebrow><span className="section-number section-number-dark">02</span></div>
        <div className="collection-title-block">
          <h2 id="collection-title">Exceptional residences.<br /><em>Individually considered.</em></h2>
          <p>A considered collection of distinctive residences, selected for their architecture, character and exceptional sense of place.</p>
        </div>
      </div>
      <div className="collection-grid page-gutter">
        {residences.map((residence, index) => (
          <PropertyFeature
            key={residence.slug}
            residence={residence}
            className={featureClasses[index]}
            onOpenExperience={onOpenExperience}
          />
        ))}
      </div>
      <div className="collection-foot page-gutter">
        <span>Illustrative collection / 001—003</span>
        <ExperienceLink onClick={() => onOpenExperience({ kind: 'residence', slug: residences[0].slug })}>Explore the collection</ExperienceLink>
      </div>
    </section>
  )
}

function SantoriniFeature({ onOpenExperience }: { onOpenExperience: (next: VelorExperience) => void }) {
  return (
    <section className="santorini-feature section-ivory" id="santorini" aria-labelledby="santorini-title">
      <div className="santorini-heading page-gutter" data-reveal>
        <Eyebrow>Architectural portrait / Santorini Residences</Eyebrow>
        <div className="santorini-intro">
          <h2 id="santorini-title">Santorini<br /><em>Residences.</em></h2>
          <div className="santorini-copy">
            <p>A sculptural tower of glass and white curves, with planted terraces, gardens and pools. Explore the architectural vision through its city silhouette and considered outdoor spaces.</p>
            <button className="santorini-link" type="button" onClick={() => onOpenExperience({ kind: 'enquiry', enquiryType: 'property' })}>
              Enquire about Santorini <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.1} />
            </button>
          </div>
        </div>
      </div>
      <div className="santorini-gallery page-gutter" aria-label="Santorini Residences architectural imagery" data-reveal>
        <figure className="santorini-image santorini-image-aerial image-frame">
          <img loading="lazy" src={images.santoriniAerial} alt="Aerial rendering of Santorini Residences, with sculptural rooftop gardens and illuminated pools above a leafy city." />
          <figcaption><span>01 / Elevated gardens</span><span>Architecture / landscape</span></figcaption>
        </figure>
        <figure className="santorini-image santorini-image-facade image-frame">
          <img loading="lazy" src={images.santoriniFacade} alt="Santorini Residences viewed from the street at blue hour, its curved glass facade outlined with warm light." />
          <figcaption><span>02 / The city silhouette</span><span>Glass / light</span></figcaption>
        </figure>
        <figure className="santorini-image santorini-image-garden image-frame">
          <img loading="lazy" src={images.santoriniGarden} alt="A landscaped Santorini Residences courtyard with trees, stone paths and a sculptural fountain." />
          <figcaption><span>03 / A garden retreat</span><span>Water / planting</span></figcaption>
        </figure>
        <figure className="santorini-image santorini-image-rooftop image-frame">
          <img loading="lazy" src={images.santoriniRooftop} alt="Overhead rendering of the Santorini rooftop, with curved terraces, garden seating and pools." />
          <figcaption><span>04 / The rooftop landscape</span><span>Terrace / water / canopy</span></figcaption>
        </figure>
      </div>
    </section>
  )
}

function ArtOfPlace({ onOpenExperience }: { onOpenExperience: (next: VelorExperience) => void }) {
  const openGallery = (initialIndex: number) => onOpenExperience({
    kind: 'gallery',
    title: 'The art of place',
    images: residences[0].gallery,
    initialIndex,
  })

  return (
    <section className="art-of-place section-ivory" id="art-of-place" aria-labelledby="art-title">
      <div className="art-head page-gutter" data-reveal>
        <div className="art-index"><Eyebrow>Material / atmosphere / craft</Eyebrow><span className="section-number">03</span></div>
        <div className="art-headline"><h2 id="art-title">The art<br />of <em>place.</em></h2><p>Architecture is more than the arrangement of space. It is the relationship between light, material, landscape and the experience of living.</p></div>
      </div>
      <div className="art-gallery page-gutter" data-reveal>
        <figure className="art-image art-image-large image-frame">
          <img loading="lazy" src={images.tropicalCourtyard} alt="A contemporary tropical residence of pale stone and glass framed by palms, with a still reflecting pool." />
          <figcaption><span>01 / The conversation with landscape</span><span>Water / glass / canopy</span></figcaption>
          <button className="art-image-open" type="button" onClick={() => openGallery(1)} aria-label="Open the architectural gallery">
            <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.1} />
          </button>
        </figure>
        <figure className="art-image art-image-small image-frame">
          <img loading="lazy" src={images.entrance} alt="A curved limestone entrance with a deep cantilever, dark vertical screen and warm timber door at dusk." />
          <figcaption><span>02 / Threshold</span><span>Stone / shadow</span></figcaption>
          <button className="art-image-open" type="button" onClick={() => openGallery(2)} aria-label="Open the architectural gallery">
            <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.1} />
          </button>
        </figure>
        <div className="art-note" data-reveal><span className="art-note-mark" aria-hidden="true" /><Eyebrow>Details worth a closer look</Eyebrow><p>Travertine, bespoke joinery, quiet bronze and the precision of a considered threshold.</p><span className="art-note-index">A study in materiality &nbsp; / &nbsp; 03</span></div>
        <figure className="art-image art-image-detail image-frame">
          <img loading="lazy" src={images.material} alt="Sculptural contemporary architecture shaped by a lush garden, seen in soft evening light." />
          <figcaption><span>03 / Form held in landscape</span><span>Stone / foliage</span></figcaption>
          <button className="art-image-open" type="button" onClick={() => openGallery(3)} aria-label="Open the architectural gallery">
            <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.1} />
          </button>
        </figure>
      </div>
    </section>
  )
}

function Destinations({ onOpenExperience }: { onOpenExperience: (next: VelorExperience) => void }) {
  const [nairobi, ...otherDestinations] = destinations

  return (
    <section className="destinations section-obsidian" id="destinations" aria-labelledby="destinations-title">
      <div className="destination-heading page-gutter" data-reveal>
        <div><Eyebrow className="eyebrow-bronze">An atlas of exceptional living</Eyebrow><span className="section-number section-number-dark">04</span></div>
        <div><h2 id="destinations-title">Places that inspire<br />a different <em>way of living.</em></h2><p>Distinctive residences are inseparable from the character of the places around them.</p></div>
      </div>
      <div className="destination-feature page-gutter" data-reveal>
        <figure className="destination-main image-frame">
          <img loading="lazy" src={nairobi.image} alt={nairobi.alt} />
          <figcaption><span>{nairobi.name} / In relation</span><span>City / landscape / connection</span></figcaption>
          <button className="art-image-open" type="button" onClick={() => onOpenExperience({ kind: 'destination', slug: nairobi.slug })} aria-label="Explore Nairobi">
            <ArrowUpRight aria-hidden="true" size={17} strokeWidth={1.1} />
          </button>
        </figure>
        <div className="destination-caption">
          <Eyebrow className="eyebrow-bronze">{nairobi.number} / {nairobi.location}</Eyebrow>
          <h3>Rooted in place.<br /><em>Open to the world.</em></h3>
          <p>{nairobi.introduction}</p>
          <ExperienceLink onClick={() => onOpenExperience({ kind: 'destination', slug: nairobi.slug })}>Discover Nairobi</ExperienceLink>
        </div>
      </div>
      <div className="destination-secondary page-gutter" data-reveal>
        {otherDestinations.map((destination) => (
          <button
            key={destination.slug}
            type="button"
            className="destination-teaser"
            onClick={() => onOpenExperience({ kind: 'destination', slug: destination.slug })}
          >
            <img loading="lazy" src={destination.image} alt={destination.alt} />
            <span className="teaser-number">{destination.number} / {destination.name}</span>
            <span className="teaser-title">{destination.slug === 'the-coast' ? <>Where the horizon<br />sets the pace.</> : <>A quieter kind<br />of arrival.</>}</span>
            <ArrowUpRight aria-hidden="true" size={20} strokeWidth={1} />
          </button>
        ))}
      </div>
    </section>
  )
}

function Perspective({ onOpenExperience }: { onOpenExperience: (next: VelorExperience) => void }) {
  const openStory = (slug: string) => onOpenExperience({ kind: 'story', slug })

  return (
    <section className="perspective section-ivory" id="perspective" aria-labelledby="perspective-title">
      <div className="perspective-heading page-gutter" data-reveal>
        <div><Eyebrow>Notes on exceptional living</Eyebrow><span className="section-number">05</span></div>
        <div className="perspective-title-row"><h2 id="perspective-title">The Velor<br /><em>perspective.</em></h2><div><p>A point of view beyond property. On architecture, art, material and the places that stay with us.</p><ExperienceLink onClick={() => openStory(stories[0].slug)}>View all perspectives</ExperienceLink></div></div>
      </div>
      <div className="story-grid page-gutter" data-reveal>
        {stories.map((story) => (
          <article className="story-card" key={story.slug}>
            <button className="story-image image-frame" type="button" onClick={() => openStory(story.slug)} aria-label={`Read: ${story.title}`}>
              <img loading="lazy" src={story.image} alt={story.alt} />
              <span className="story-arrow" aria-hidden="true"><ArrowUpRight size={18} strokeWidth={1} /></span>
            </button>
            <div className="story-meta"><Eyebrow>{story.category}</Eyebrow><span>{story.number} / 03</span></div>
            <h3><button className="story-title-button" type="button" onClick={() => openStory(story.slug)}>{story.title}</button></h3>
            <button className="story-read" type="button" onClick={() => openStory(story.slug)}>A closer look <ArrowRight aria-hidden="true" size={13} strokeWidth={1.2} /></button>
          </article>
        ))}
      </div>
    </section>
  )
}

const invitationSlides = [
  {
    title: 'A quieter arrival',
    images: [
      { src: images.courtyard, alt: 'A secluded limestone residence courtyard at blue hour, with a still reflecting pool and warm light behind glass.', caption: 'A private arrival', detail: 'Stone / water / light' },
      { src: images.santoriniGarden, alt: 'A landscaped residence courtyard with mature trees, pale stone paths and a sculptural fountain.', caption: 'A garden retreat', detail: 'Canopy / stone / water' },
    ],
  },
  {
    title: 'Architecture in context',
    images: [
      { src: images.santoriniFacade, alt: 'A contemporary residential facade at blue hour, its curved glass outlined in warm light.', caption: 'The city silhouette', detail: 'Glass / evening light' },
      { src: images.santoriniRooftop, alt: 'An overhead view of curved terraces, garden seating and pools.', caption: 'The rooftop landscape', detail: 'Terrace / water / canopy' },
    ],
  },
]

function PrivateInvitation({ onOpenExperience }: { onOpenExperience: (next: VelorExperience) => void }) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)

  useEffect(() => {
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) setIsPlaying(true)
  }, [])

  useEffect(() => {
    if (!isPlaying) return

    const interval = window.setInterval(() => {
      if (!document.hidden) setActiveSlide((current) => (current + 1) % invitationSlides.length)
    }, 7200)

    return () => window.clearInterval(interval)
  }, [isPlaying])

  function moveSlide(direction: -1 | 1) {
    setActiveSlide((current) => (current + direction + invitationSlides.length) % invitationSlides.length)
  }

  const activeImages = invitationSlides[activeSlide]

  return (
    <section className="private-invitation" id="private-invitation" aria-labelledby="invitation-title">
      <div className="invitation-content">
        <Eyebrow className="eyebrow-bronze">A private invitation</Eyebrow>
        <h2 id="invitation-title">Some discoveries begin<br />with a <em>conversation.</em></h2>
        <p>Whether you are searching for an exceptional residence or exploring a property opportunity, our team welcomes a more personal conversation.</p>
        <button className="invitation-link" type="button" onClick={() => onOpenExperience({ kind: 'enquiry', enquiryType: 'consultation' })}>Private enquiries <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1} /></button>
      </div>
      <div className="invitation-gallery" role="region" aria-roledescription="carousel" aria-label="Private invitation image gallery">
        <div className="invitation-gallery-grid" key={activeSlide}>
          {activeImages.images.map((image, index) => (
            <figure className="invitation-frame image-frame" key={image.src}>
              <img loading="lazy" src={image.src} alt={image.alt} />
              <figcaption><span>0{index + 1} / {image.caption}</span><span>{image.detail}</span></figcaption>
            </figure>
          ))}
        </div>
        <div className="invitation-controls" role="group" aria-label="Invitation slideshow controls">
          <button className="invitation-control" type="button" onClick={() => moveSlide(-1)} aria-label="Show previous invitation images">
            <ChevronLeft aria-hidden="true" size={15} strokeWidth={1.1} />
          </button>
          <span className="invitation-count" aria-live={isPlaying ? 'off' : 'polite'} aria-atomic="true">
            {String(activeSlide + 1).padStart(2, '0')} <i>/</i> {String(invitationSlides.length).padStart(2, '0')}
          </span>
          <div className="invitation-pagination" role="group" aria-label="Choose an image pair">
            {invitationSlides.map((slide, index) => (
              <button
                className="invitation-pagination-item"
                key={slide.title}
                type="button"
                aria-label={`Show image pair ${index + 1}: ${slide.title}`}
                aria-pressed={index === activeSlide}
                onClick={() => setActiveSlide(index)}
              >
                <span aria-hidden="true" />
              </button>
            ))}
          </div>
          <button className="invitation-control" type="button" onClick={() => moveSlide(1)} aria-label="Show next invitation images">
            <ChevronRight aria-hidden="true" size={15} strokeWidth={1.1} />
          </button>
          <button
            className="invitation-control invitation-play-toggle"
            type="button"
            onClick={() => setIsPlaying((playing) => !playing)}
            aria-label={isPlaying ? 'Pause invitation slideshow' : 'Play invitation slideshow'}
            aria-pressed={isPlaying}
          >
            {isPlaying ? <Pause aria-hidden="true" size={12} strokeWidth={1.2} /> : <Play aria-hidden="true" size={12} strokeWidth={1.2} />}
          </button>
        </div>
      </div>
      <span className="invitation-index">VELOR / PRIVATE OFFICE</span>
    </section>
  )
}

function SiteFooter({ onOpenExperience }: { onOpenExperience: (next: VelorExperience) => void }) {
  const socialLinks = [
    { label: 'Instagram', handle: '@velorestates', href: 'https://www.instagram.com/velorestates/' },
    { label: 'TikTok', handle: '@velorprivatestates', href: 'https://www.tiktok.com/@velorprivatestates' },
    { label: 'Pinterest', handle: 'velorestates', href: 'https://www.pinterest.com/velorestates/' },
    { label: 'Snapchat', handle: 'Veloreststes', href: 'https://www.snapchat.com/add/Veloreststes' },
    { label: 'Facebook Page', handle: 'Velor Private Estates', href: 'https://www.facebook.com/VelorPrivateEstates/' },
  ]

  return (
    <footer className="site-footer section-obsidian" id="contact">
      <div className="footer-main page-gutter">
        <div className="footer-brand"><a href="#top" aria-label="Velor Private Estates home"><BrandWordmark /></a><p>Beyond the address.</p></div>
        <div className="footer-column"><Eyebrow>Discover</Eyebrow><a href="#collection">The collection</a><a href="#santorini">Santorini Residences</a><a href="#destinations">Destinations</a><a href="#perspective">The perspective</a><a href="#philosophy">Our philosophy</a></div>
        <div className="footer-column"><Eyebrow>Private office</Eyebrow><button type="button" onClick={() => onOpenExperience({ kind: 'enquiry', enquiryType: 'consultation' })}>Private enquiries</button><a href="/listings">Available residences</a><a href="/sign-in">Client portal</a><span>By introduction / by appointment</span></div>
        <div className="footer-column footer-contact"><Eyebrow>Contact</Eyebrow><a href="tel:+254727750097">+254 727 750 097</a><a href="tel:0798008800">0798 008 800</a><a href="mailto:private@estate.lucene.co">private@estate.lucene.co</a><a href="mailto:odinga.billy@lucene.co">odinga.billy@lucene.co</a><address><a href="https://maps.google.com/?q=Jamhuri+Showgrounds%2C+ASK" target="_blank" rel="noreferrer">Jamhuri Showgrounds, ASK</a></address></div>
        <div className="footer-column footer-socials"><Eyebrow>Follow VELOR</Eyebrow>{socialLinks.map((social) => <a className="footer-social-link" href={social.href} key={social.label} target="_blank" rel="noreferrer"><span>{social.label}</span><span>{social.handle}</span></a>)}</div>
      </div>
      <div className="footer-bottom page-gutter"><span>© 2026 VELOR PRIVATE ESTATES</span><span>International private property</span><a href="#top">Back to top ↑</a></div>
    </footer>
  )
}

function ArrivalSequence() {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(false)
      return
    }

    const timeout = window.setTimeout(() => setVisible(false), 1800)
    return () => window.clearTimeout(timeout)
  }, [])

  if (!visible) return null

  return (
    <div className="arrival-sequence" role="region" aria-label="Velor Private Estates opening sequence">
      <span className="arrival-sequence-wordmark">
        <span className="sr-only">Velor</span>
        <span className="arrival-sequence-letters" aria-hidden="true">
          <span>V</span><span>e</span><span>l</span><span>o</span><span>r</span>
        </span>
      </span>
      <span className="arrival-sequence-descriptor">PRIVATE ESTATES</span>
      <span className="arrival-sequence-rule" />
      <button className="arrival-sequence-skip" type="button" onClick={() => setVisible(false)}>
        Skip intro
      </button>
    </div>
  )
}

function useScrollReveals() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (!elements.length) return

    document.documentElement.classList.add('velor-motion-ready')

    if (!('IntersectionObserver' in window)) {
      elements.forEach((element) => element.classList.add('is-visible'))
      return () => document.documentElement.classList.remove('velor-motion-ready')
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('is-visible')
        observer.unobserve(entry.target)
      })
    }, { threshold: 0.12, rootMargin: '0px 0px -32px 0px' })

    elements.forEach((element) => observer.observe(element))
    return () => {
      observer.disconnect()
      document.documentElement.classList.remove('velor-motion-ready')
    }
  }, [])
}

export function VelorHomepage() {
  const [experience, setExperience] = useState<VelorExperience | null>(null)
  useScrollReveals()

  const openExperience = (next: VelorExperience) => setExperience(next)

  return (
    <main className="velor-site">
      <a className="skip-link" href="#philosophy">Skip to content</a>
      <ArrivalSequence />
      <SiteHeader onOpenExperience={openExperience} />
      <Hero />
      <Philosophy />
      <Collection onOpenExperience={openExperience} />
      <SantoriniFeature onOpenExperience={openExperience} />
      <ArtOfPlace onOpenExperience={openExperience} />
      <Destinations onOpenExperience={openExperience} />
      <Perspective onOpenExperience={openExperience} />
      <PrivateInvitation onOpenExperience={openExperience} />
      <SiteFooter onOpenExperience={openExperience} />
      {experience && (
        <VelorExperienceLayer
          experience={experience}
          onClose={() => setExperience(null)}
          onNavigate={(next) => setExperience(next)}
        />
      )}
    </main>
  )
}
