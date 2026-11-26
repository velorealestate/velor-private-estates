'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react'
import { destinations, images, residences, stories } from '@/components/velor-content'
import { VelorExperienceLayer, type VelorExperience } from '@/components/velor-experience'

const navigation = [
  { label: 'The collection', href: '#collection' },
  { label: 'Available residences', href: '/listings' },
  { label: 'Destinations', href: '#destinations' },
  { label: 'The perspective', href: '#perspective' },
  { label: 'Our philosophy', href: '#philosophy' },
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
          {navigation.map((item) => (
            <a href={item.href} key={item.href}>{item.label}</a>
          ))}
        </nav>
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
                <span className="menu-number">06</span>
                <span>Private enquiries</span>
                <ArrowUpRight aria-hidden="true" size={23} strokeWidth={1} />
              </button>
              <a href="/sign-in" onClick={closeMenu}>
                <span className="menu-number">07</span>
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
  return (
    <section className="hero" id="top" aria-labelledby="hero-title">
      <img className="hero-image" src={images.hero} alt="A modern glass residence at blue hour, its warm interior reflected in an infinity pool beside a wooded shoreline." fetchPriority="high" />
      <div className="hero-scrim" aria-hidden="true" />
      <div className="hero-content page-gutter">
        <Eyebrow className="hero-eyebrow">A different perspective on private property</Eyebrow>
        <h1 id="hero-title">Beyond the<br /><em>address.</em></h1>
        <p className="hero-description">An exceptional collection of residences, selected for their architecture, character and extraordinary sense of place.</p>
        <ArrowLink href="#collection" className="hero-cta">Discover the collection</ArrowLink>
      </div>
      <div className="hero-footer page-gutter">
        <span className="hero-location">Selected residences&nbsp; / &nbsp;Worldwide</span>
        <a href="#philosophy" className="scroll-cue" aria-label="Scroll to our philosophy">
          <span>Scroll to discover</span><span className="scroll-cue-line" aria-hidden="true" /><ArrowDown aria-hidden="true" size={13} strokeWidth={1} />
        </a>
        <span className="hero-index">01 — 08 &nbsp; / &nbsp; The living gallery</span>
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
        <span>Illustrative collection / not available listings</span>
        <ExperienceLink onClick={() => onOpenExperience({ kind: 'residence', slug: residences[0].slug })}>Explore the collection</ExperienceLink>
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

function PrivateInvitation({ onOpenExperience }: { onOpenExperience: (next: VelorExperience) => void }) {
  return (
    <section className="private-invitation" id="private-invitation" aria-labelledby="invitation-title">
      <img className="invitation-image" loading="lazy" src="/images/velor-private-courtyard.png" alt="A secluded limestone residence courtyard at blue hour, with a still reflecting pool and warm light behind glass." />
      <div className="invitation-overlay" aria-hidden="true" />
      <div className="invitation-content page-gutter">
        <Eyebrow className="eyebrow-bronze">A private invitation</Eyebrow>
        <h2 id="invitation-title">Some discoveries begin<br />with a <em>conversation.</em></h2>
        <p>Whether you are searching for an exceptional residence or exploring a property opportunity, our team welcomes a more personal conversation.</p>
        <button className="invitation-link" type="button" onClick={() => onOpenExperience({ kind: 'enquiry', enquiryType: 'consultation' })}>Private enquiries <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1} /></button>
      </div>
      <span className="invitation-index">VELOR / PRIVATE OFFICE</span>
    </section>
  )
}

function SiteFooter({ onOpenExperience }: { onOpenExperience: (next: VelorExperience) => void }) {
  return (
    <footer className="site-footer section-obsidian" id="contact">
      <div className="footer-main page-gutter">
        <div className="footer-brand"><a href="#top" aria-label="Velor Private Estates home"><BrandWordmark /></a><p>Beyond the address.</p></div>
        <div className="footer-column"><Eyebrow>Discover</Eyebrow><a href="#collection">The collection</a><a href="#destinations">Destinations</a><a href="#perspective">The perspective</a><a href="#philosophy">Our philosophy</a></div>
        <div className="footer-column"><Eyebrow>Private office</Eyebrow><button type="button" onClick={() => onOpenExperience({ kind: 'enquiry', enquiryType: 'consultation' })}>Private enquiries</button><a href="/listings">Available residences</a><a href="/sign-in">Client portal</a><span>By introduction / by appointment</span></div>
        <div className="footer-signature"><span className="signature-line" aria-hidden="true" /><span className="display-text">The living gallery.</span></div>
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
