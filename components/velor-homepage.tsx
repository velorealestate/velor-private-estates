'use client'

import { useEffect, useRef, useState } from 'react'
import { ArrowDown, ArrowRight, ArrowUpRight, Menu, X } from 'lucide-react'

const images = {
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
}

const navigation = [
  { label: 'The collection', href: '#collection' },
  { label: 'Destinations', href: '#destinations' },
  { label: 'The perspective', href: '#perspective' },
  { label: 'Our philosophy', href: '#philosophy' },
]

function BrandWordmark({ light = true }: { light?: boolean }) {
  return (
    <span className={`brand-lockup${light ? ' brand-lockup-light' : ''}`}>
      <span className="brand-name">VELOR</span>
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

function SiteHeader() {
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
        <a className="brand-home" href="#top" aria-label="VELOR Private Estates home">
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
        <div className="menu-overlay" id="velor-menu" ref={menuRef} role="dialog" aria-modal="true" aria-label="VELOR navigation">
          <div className="menu-overlay-top">
            <BrandWordmark />
            <button ref={closeRef} className="menu-toggle menu-close" type="button" onClick={closeMenu} aria-label="Close navigation menu">
              <X aria-hidden="true" size={23} strokeWidth={1.1} />
            </button>
          </div>
          <nav className="menu-overlay-links" aria-label="Full-screen navigation">
            {navigation.map((item, index) => (
              <a href={item.href} key={item.href} onClick={closeMenu}>
                <span className="menu-number">0{index + 1}</span>
                <span>{item.label}</span>
                <ArrowUpRight aria-hidden="true" size={23} strokeWidth={1} />
              </a>
            ))}
            <a href="#private-invitation" onClick={closeMenu}>
              <span className="menu-number">05</span>
              <span>Private enquiries</span>
              <ArrowUpRight aria-hidden="true" size={23} strokeWidth={1} />
            </a>
          </nav>
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
      <SiteHeader />
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
    <section className="philosophy section-ivory" id="philosophy" aria-labelledby="philosophy-title">
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
  number,
  name,
  descriptor,
  image,
  alt,
  className,
  detail,
}: {
  number: string
  name: string
  descriptor: string
  image: string
  alt: string
  className: string
  detail: string
}) {
  return (
    <article className={`property-feature ${className}`}>
      <a className="property-image image-frame" href="#private-invitation" aria-label={`Enquire about ${name}`}>
        <img loading="lazy" src={image} alt={alt} />
        <span className="image-index">{number} &nbsp; / &nbsp; VELOR COLLECTION</span>
        <span className="image-discover" aria-hidden="true"><ArrowUpRight size={20} strokeWidth={1} /></span>
      </a>
      <div className="property-caption">
        <div>
          <Eyebrow>{descriptor}</Eyebrow>
          <h3>{name}</h3>
        </div>
        <p>{detail}</p>
      </div>
    </article>
  )
}

function Collection() {
  return (
    <section className="collection section-obsidian" id="collection" aria-labelledby="collection-title">
      <div className="collection-heading page-gutter">
        <div><Eyebrow className="eyebrow-bronze">A curated collection / 001—003</Eyebrow><span className="section-number section-number-dark">02</span></div>
        <div className="collection-title-block">
          <h2 id="collection-title">Exceptional residences.<br /><em>Individually considered.</em></h2>
          <p>A considered collection of distinctive residences, selected for their architecture, character and exceptional sense of place.</p>
        </div>
      </div>
      <div className="collection-grid page-gutter">
        <PropertyFeature
          number="001"
          name="The Estate"
          descriptor="Tropical / Private estate"
          image={images.tropicalEstate}
          alt="Aerial view of a sprawling contemporary stone estate, gardens and swimming pools within a lush tropical canopy."
          className="property-estate"
          detail="An exceptional private residence with extraordinary architectural presence."
        />
        <PropertyFeature
          number="002"
          name="The Residence"
          descriptor="Urban / Panoramic living"
          image={images.penthouse}
          alt="A serene ivory penthouse living room with sculptural seating and floor-to-ceiling views across the city."
          className="property-residence"
          detail="A sophisticated urban home shaped by light, proportion and a remarkable view."
        />
        <PropertyFeature
          number="003"
          name="The Sanctuary"
          descriptor="Alpine / Private retreat"
          image={images.mountainResidence}
          alt="A contemporary glass and stone residence nestled beneath a dramatic mountain range at dusk."
          className="property-sanctuary"
          detail="A secluded contemporary retreat in dialogue with its natural landscape."
        />
      </div>
      <div className="collection-foot page-gutter"><span>Illustrative collection / not available listings</span><ArrowLink href="#private-invitation">Explore the collection</ArrowLink></div>
    </section>
  )
}

function ArtOfPlace() {
  return (
    <section className="art-of-place section-ivory" id="art-of-place" aria-labelledby="art-title">
      <div className="art-head page-gutter">
        <div className="art-index"><Eyebrow>Material / atmosphere / craft</Eyebrow><span className="section-number">03</span></div>
        <div className="art-headline"><h2 id="art-title">The art<br />of <em>place.</em></h2><p>Architecture is more than the arrangement of space. It is the relationship between light, material, landscape and the experience of living.</p></div>
      </div>
      <div className="art-gallery page-gutter">
        <figure className="art-image art-image-large image-frame">
          <img loading="lazy" src={images.tropicalCourtyard} alt="A contemporary tropical residence of pale stone and glass framed by palms, with a still reflecting pool." />
          <figcaption><span>01 / The conversation with landscape</span><span>Water / glass / canopy</span></figcaption>
        </figure>
        <figure className="art-image art-image-small image-frame">
          <img loading="lazy" src={images.entrance} alt="A curved limestone entrance with a deep cantilever, dark vertical screen and warm timber door at dusk." />
          <figcaption><span>02 / Threshold</span><span>Stone / shadow</span></figcaption>
        </figure>
        <div className="art-note"><span className="art-note-mark" aria-hidden="true" /><Eyebrow>Details worth a closer look</Eyebrow><p>Travertine, bespoke joinery, quiet bronze and the precision of a considered threshold.</p><span className="art-note-index">A study in materiality &nbsp; / &nbsp; 03</span></div>
        <figure className="art-image art-image-detail image-frame">
          <img loading="lazy" src={images.material} alt="Sculptural white modern architecture with curved forms and a lush garden, seen in soft evening light." />
          <figcaption><span>03 / Form held in landscape</span><span>Stone / foliage</span></figcaption>
        </figure>
      </div>
    </section>
  )
}

function Destinations() {
  return (
    <section className="destinations section-obsidian" id="destinations" aria-labelledby="destinations-title">
      <div className="destination-heading page-gutter">
        <div><Eyebrow className="eyebrow-bronze">An atlas of exceptional living</Eyebrow><span className="section-number section-number-dark">04</span></div>
        <div><h2 id="destinations-title">Places that inspire<br />a different <em>way of living.</em></h2><p>Distinctive residences are inseparable from the character of the places around them.</p></div>
      </div>
      <div className="destination-feature page-gutter">
        <figure className="destination-main image-frame">
          <img loading="lazy" src={images.city} alt="Panoramic Nairobi skyline with the Ngong Hills, Sarit Centre, Westgate Mall and Nairobi Expressway marked in the distance." />
          <figcaption><span>Nairobi / In relation</span><span>City / landscape / connection</span></figcaption>
        </figure>
        <div className="destination-caption">
          <Eyebrow className="eyebrow-bronze">01 / Nairobi, Kenya</Eyebrow>
          <h3>Rooted in place.<br /><em>Open to the world.</em></h3>
          <p>A city of layered horizons, green neighbourhoods and a rare closeness to the landscape beyond its edge.</p>
          <ArrowLink href="#private-invitation">Discover Nairobi</ArrowLink>
        </div>
      </div>
      <div className="destination-secondary page-gutter">
        <a href="#private-invitation" className="destination-teaser">
          <img loading="lazy" src={images.coastline} alt="A modern coastal home overlooking the sea, with a broad terrace and water at the edge of the frame." />
          <span className="teaser-number">02 / THE COAST</span><span className="teaser-title">Where the horizon<br />sets the pace.</span><ArrowUpRight aria-hidden="true" size={20} strokeWidth={1} />
        </a>
        <a href="#private-invitation" className="destination-teaser">
          <img loading="lazy" src={images.blueHour} alt="A glass-walled desert residence at twilight beside a reflecting pool and cactus landscape." />
          <span className="teaser-number">03 / THE RETREAT</span><span className="teaser-title">A quieter kind<br />of arrival.</span><ArrowUpRight aria-hidden="true" size={20} strokeWidth={1} />
        </a>
      </div>
    </section>
  )
}

const stories = [
  { category: 'Architecture', title: 'When material becomes memory', image: images.stair, alt: 'Sunlight across a honed stone wall and illuminated floating staircase.', number: '01' },
  { category: 'The considered life', title: 'A room shaped by the view', image: images.penthouse, alt: 'Sculptural ivory furniture set against a full-height city panorama.', number: '02' },
  { category: 'Landscape', title: 'The quiet intelligence of a garden', image: images.tropicalEstate, alt: 'Aerial view over a private residence nested within dense tropical gardens.', number: '03' },
]

function Perspective() {
  return (
    <section className="perspective section-ivory" id="perspective" aria-labelledby="perspective-title">
      <div className="perspective-heading page-gutter">
        <div><Eyebrow>Notes on exceptional living</Eyebrow><span className="section-number">05</span></div>
        <div className="perspective-title-row"><h2 id="perspective-title">The Velor<br /><em>perspective.</em></h2><div><p>A point of view beyond property. On architecture, art, material and the places that stay with us.</p><ArrowLink href="#private-invitation">View all perspectives</ArrowLink></div></div>
      </div>
      <div className="story-grid page-gutter">
        {stories.map((story) => (
          <article className="story-card" key={story.number}>
            <a className="story-image image-frame" href="#private-invitation" aria-label={`Read: ${story.title}`}>
              <img loading="lazy" src={story.image} alt={story.alt} />
              <span className="story-arrow" aria-hidden="true"><ArrowUpRight size={18} strokeWidth={1} /></span>
            </a>
            <div className="story-meta"><Eyebrow>{story.category}</Eyebrow><span>{story.number} / 03</span></div>
            <h3><a href="#private-invitation">{story.title}</a></h3>
            <a className="story-read" href="#private-invitation">A closer look <ArrowRight aria-hidden="true" size={13} strokeWidth={1.2} /></a>
          </article>
        ))}
      </div>
    </section>
  )
}

function PrivateInvitation() {
  return (
    <section className="private-invitation" id="private-invitation" aria-labelledby="invitation-title">
      <img className="invitation-image" loading="lazy" src="/images/velor-private-courtyard.png" alt="A secluded limestone residence courtyard at blue hour, with a still reflecting pool and warm light behind glass." />
      <div className="invitation-overlay" aria-hidden="true" />
      <div className="invitation-content page-gutter">
        <Eyebrow className="eyebrow-bronze">A private invitation</Eyebrow>
        <h2 id="invitation-title">Some discoveries begin<br />with a <em>conversation.</em></h2>
        <p>Whether you are searching for an exceptional residence or exploring a property opportunity, our team welcomes a more personal conversation.</p>
        <a href="#contact" className="invitation-link">Private enquiries <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1} /></a>
      </div>
      <span className="invitation-index">VELOR / PRIVATE OFFICE</span>
    </section>
  )
}

function SiteFooter() {
  return (
    <footer className="site-footer section-obsidian" id="contact">
      <div className="footer-main page-gutter">
        <div className="footer-brand"><a href="#top" aria-label="VELOR Private Estates home"><BrandWordmark /></a><p>Beyond the address.</p></div>
        <div className="footer-column"><Eyebrow>Discover</Eyebrow><a href="#collection">The collection</a><a href="#destinations">Destinations</a><a href="#perspective">The perspective</a><a href="#philosophy">Our philosophy</a></div>
        <div className="footer-column"><Eyebrow>Private office</Eyebrow><a href="#private-invitation">Private enquiries</a><span>By introduction / by appointment</span></div>
        <div className="footer-signature"><span className="signature-line" aria-hidden="true" /><span className="display-text">The living gallery.</span></div>
      </div>
      <div className="footer-bottom page-gutter"><span>© 2026 VELOR PRIVATE ESTATES</span><span>International private property</span><a href="#top">Back to top ↑</a></div>
    </footer>
  )
}

export function VelorHomepage() {
  return (
    <main className="velor-site">
      <Hero />
      <Philosophy />
      <Collection />
      <ArtOfPlace />
      <Destinations />
      <Perspective />
      <PrivateInvitation />
      <SiteFooter />
    </main>
  )
}
