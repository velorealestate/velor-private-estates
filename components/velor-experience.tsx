'use client'

import { useEffect, useRef, useState } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
} from 'lucide-react'
import {
  destinations,
  residences,
  stories,
  type Destination,
  type GalleryImage,
  type Residence,
  type Story,
} from '@/components/velor-content'
import {
  VelorEnquiryForm,
  type EnquiryType,
} from '@/components/velor-enquiry-form'

export type VelorExperience =
  | { kind: 'gallery'; title: string; images: GalleryImage[]; initialIndex?: number }
  | { kind: 'residence'; slug: string }
  | { kind: 'destination'; slug: string }
  | { kind: 'story'; slug: string }
  | { kind: 'enquiry'; enquiryType: EnquiryType; residenceSlug?: string }

type VelorExperienceLayerProps = {
  experience: VelorExperience
  onClose: () => void
  onNavigate: (next: VelorExperience) => void
}

function getExperienceKey(experience: VelorExperience) {
  switch (experience.kind) {
    case 'gallery':
      return `gallery:${experience.title}:${experience.images[0]?.src ?? ''}`
    case 'enquiry':
      return `enquiry:${experience.enquiryType}:${experience.residenceSlug ?? ''}`
    default:
      return `${experience.kind}:${experience.slug}`
  }
}

function experienceTitle(experience: VelorExperience) {
  switch (experience.kind) {
    case 'gallery':
      return `${experience.title} / architectural gallery`
    case 'residence':
      return residences.find((residence) => residence.slug === experience.slug)?.name ?? 'A VELOR residence'
    case 'destination':
      return destinations.find((destination) => destination.slug === experience.slug)?.name ?? 'A VELOR destination'
    case 'story':
      return stories.find((story) => story.slug === experience.slug)?.title ?? 'The VELOR perspective'
    case 'enquiry':
      return 'Private enquiries'
  }
}

function ExperienceTopbar({
  closeButtonRef,
  onClose,
  context,
}: {
  closeButtonRef: React.RefObject<HTMLButtonElement | null>
  onClose: () => void
  context: string
}) {
  return (
    <div className="experience-topbar">
      <div className="experience-wordmark" aria-label="Velor Private Estates">
        <span>Velor</span>
        <small>PRIVATE ESTATES</small>
      </div>
      <span className="experience-topbar-context">{context}</span>
      <button
        ref={closeButtonRef}
        className="experience-close"
        type="button"
        onClick={onClose}
        aria-label="Close experience"
      >
        <X aria-hidden="true" size={19} strokeWidth={1.1} />
      </button>
    </div>
  )
}

export function VelorExperienceLayer({
  experience,
  onClose,
  onNavigate,
}: VelorExperienceLayerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const [galleryIndex, setGalleryIndex] = useState(experience.kind === 'gallery' ? experience.initialIndex ?? 0 : 0)
  const experienceKey = getExperienceKey(experience)
  const gallery = experience.kind === 'gallery' ? experience.images : null

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    if (!dialog.open) dialog.showModal()
    closeButtonRef.current?.focus()

    return () => {
      if (dialog.open) dialog.close()
    }
  }, [])

  useEffect(() => {
    if (experience.kind === 'gallery') {
      const lastIndex = Math.max(experience.images.length - 1, 0)
      setGalleryIndex(Math.min(Math.max(experience.initialIndex ?? 0, 0), lastIndex))
    }
    dialogRef.current?.scrollTo({ top: 0 })
    closeButtonRef.current?.focus()
  }, [experienceKey, experience])

  function moveGallery(direction: -1 | 1) {
    if (!gallery?.length) return
    setGalleryIndex((current) => (current + direction + gallery.length) % gallery.length)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDialogElement>) {
    if (experience.kind !== 'gallery') return
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      moveGallery(-1)
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      moveGallery(1)
    }
  }

  const context = experience.kind === 'enquiry' ? 'PRIVATE OFFICE' : 'THE LIVING GALLERY'

  return (
    <dialog
      ref={dialogRef}
      className={`experience-dialog experience-dialog--${experience.kind}`}
      aria-labelledby="experience-title"
      onCancel={(event) => {
        event.preventDefault()
        onClose()
      }}
      onKeyDown={handleKeyDown}
      onClick={(event) => {
        if (experience.kind === 'enquiry' && event.target === event.currentTarget) onClose()
      }}
    >
      <ExperienceTopbar closeButtonRef={closeButtonRef} onClose={onClose} context={context} />

      {experience.kind === 'gallery' && gallery && gallery.length > 0 && (
        <GalleryExperience
          title={experienceTitle(experience)}
          images={gallery}
          index={galleryIndex}
          onIndexChange={setGalleryIndex}
          onMove={moveGallery}
        />
      )}

      {experience.kind === 'residence' && (
        <ResidenceExperience
          residence={residences.find((residence) => residence.slug === experience.slug) ?? residences[0]}
          onNavigate={onNavigate}
        />
      )}

      {experience.kind === 'destination' && (
        <DestinationExperience
          destination={destinations.find((destination) => destination.slug === experience.slug) ?? destinations[0]}
          onNavigate={onNavigate}
        />
      )}

      {experience.kind === 'story' && (
        <StoryExperience
          story={stories.find((story) => story.slug === experience.slug) ?? stories[0]}
          onNavigate={onNavigate}
        />
      )}

      {experience.kind === 'enquiry' && (
        <VelorEnquiryForm
          key={experienceKey}
          initialType={experience.enquiryType}
          initialResidence={experience.residenceSlug}
          onClose={onClose}
        />
      )}
    </dialog>
  )
}

function ExperienceAction({
  children,
  onClick,
  tone = 'light',
}: {
  children: React.ReactNode
  onClick: () => void
  tone?: 'light' | 'dark'
}) {
  return (
    <button className={`experience-action experience-action--${tone}`} type="button" onClick={onClick}>
      <span>{children}</span>
      <ArrowRight aria-hidden="true" size={15} strokeWidth={1.2} />
    </button>
  )
}

function GalleryExperience({
  title,
  images,
  index,
  onIndexChange,
  onMove,
}: {
  title: string
  images: GalleryImage[]
  index: number
  onIndexChange: (index: number) => void
  onMove: (direction: -1 | 1) => void
}) {
  const galleryRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fullscreenError, setFullscreenError] = useState(false)
  const currentImage = images[index]

  useEffect(() => {
    const updateFullscreen = () => setIsFullscreen(document.fullscreenElement === galleryRef.current)
    document.addEventListener('fullscreenchange', updateFullscreen)
    return () => document.removeEventListener('fullscreenchange', updateFullscreen)
  }, [])

  async function toggleFullscreen() {
    const galleryElement = galleryRef.current
    if (!galleryElement) return

    setFullscreenError(false)
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen()
      } else {
        await galleryElement.requestFullscreen()
      }
    } catch {
      setFullscreenError(true)
    }
  }

  return (
    <section className="gallery-experience" ref={galleryRef} aria-labelledby="experience-title">
      <h1 className="sr-only" id="experience-title">{title}</h1>
      <div className="gallery-stage">
        <div className="gallery-image-wrap" key={`${index}-${currentImage.src}`}>
          <img className="gallery-image" src={currentImage.src} alt={currentImage.alt} fetchPriority="high" />
          <span className="gallery-material">{currentImage.material}</span>
        </div>
        <button className="gallery-control gallery-control--previous" type="button" onClick={() => onMove(-1)} aria-label="View previous image">
          <ChevronLeft aria-hidden="true" size={20} strokeWidth={1.1} />
        </button>
        <button className="gallery-control gallery-control--next" type="button" onClick={() => onMove(1)} aria-label="View next image">
          <ChevronRight aria-hidden="true" size={20} strokeWidth={1.1} />
        </button>
      </div>

      <div className="gallery-information">
        <div className="gallery-caption">
          <span className="eyebrow">{title}</span>
          <h2>{currentImage.caption}</h2>
        </div>
        <div className="gallery-tools">
          <span className="gallery-count" aria-live="polite">{String(index + 1).padStart(2, '0')} <i>/</i> {String(images.length).padStart(2, '0')}</span>
          <button className="gallery-fullscreen" type="button" onClick={() => void toggleFullscreen()} aria-pressed={isFullscreen}>
            <Maximize2 aria-hidden="true" size={15} strokeWidth={1.1} />
            <span>{isFullscreen ? 'Exit full screen' : 'Full screen'}</span>
          </button>
        </div>
      </div>

      <nav className="gallery-thumbnails" aria-label="Choose a gallery image">
        {images.map((image, imageIndex) => (
          <button
            className={`gallery-thumbnail${imageIndex === index ? ' gallery-thumbnail--active' : ''}`}
            type="button"
            key={`${image.src}-${imageIndex}`}
            aria-label={`Show image ${imageIndex + 1}: ${image.caption}`}
            aria-current={imageIndex === index ? 'true' : undefined}
            onClick={() => onIndexChange(imageIndex)}
          >
            <img src={image.src} alt="" loading="lazy" />
          </button>
        ))}
      </nav>
      {fullscreenError && <p className="gallery-fullscreen-error" role="status">Full-screen viewing is unavailable in this browser.</p>}
    </section>
  )
}

function ResidenceExperience({
  residence,
  onNavigate,
}: {
  residence: Residence
  onNavigate: (next: VelorExperience) => void
}) {
  return (
    <article className="residence-experience" aria-labelledby="experience-title">
      <section className="residence-hero">
        <img src={residence.image} alt={residence.alt} fetchPriority="high" />
        <div className="residence-hero-scrim" aria-hidden="true" />
        <div className="residence-hero-copy page-gutter">
          <span className="eyebrow">{residence.number} / {residence.descriptor}</span>
          <h1 id="experience-title">{residence.name}<em>.</em></h1>
          <p>{residence.location}</p>
          <button
            className="experience-inline-link"
            type="button"
            onClick={() => onNavigate({ kind: 'gallery', title: residence.name, images: residence.gallery })}
          >
            Enter the gallery <ArrowDownRight aria-hidden="true" size={17} strokeWidth={1.1} />
          </button>
        </div>
        <span className="residence-hero-index">Illustrative collection / not an available listing</span>
      </section>

      <section className="residence-introduction section-ivory page-gutter">
        <div className="experience-section-label">
          <span className="eyebrow">An architectural study</span>
          <span className="experience-index">{residence.number}</span>
        </div>
        <div className="residence-intro-copy">
          <p className="residence-summary">{residence.summary}</p>
          <p className="residence-description">{residence.description}</p>
          <ExperienceAction
            tone="dark"
            onClick={() => onNavigate({ kind: 'enquiry', enquiryType: 'viewing', residenceSlug: residence.slug })}
          >
            Request a private viewing
          </ExperienceAction>
        </div>
      </section>

      <section className="residence-gallery-section section-ivory page-gutter" aria-labelledby="residence-gallery-title">
        <div className="experience-heading-row">
          <div>
            <span className="eyebrow">Architecture / in detail</span>
            <h2 id="residence-gallery-title">A closer <em>perspective.</em></h2>
          </div>
          <button
            className="experience-text-link"
            type="button"
            onClick={() => onNavigate({ kind: 'gallery', title: residence.name, images: residence.gallery })}
          >
            View all {residence.gallery.length} images <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.1} />
          </button>
        </div>
        <div className="residence-image-grid">
          {residence.gallery.slice(0, 3).map((image, index) => (
            <button
              className={`residence-gallery-image residence-gallery-image--${index + 1}`}
              key={`${image.src}-${index}`}
              type="button"
              onClick={() => onNavigate({ kind: 'gallery', title: residence.name, images: residence.gallery, initialIndex: index })}
              aria-label={`Open image ${index + 1}: ${image.caption}`}
            >
              <img src={image.src} alt="" loading="lazy" />
              <span>{image.caption}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="residence-detail-section section-ivory page-gutter">
        <div className="residence-detail-copy">
          <span className="eyebrow">Material / atmosphere / craft</span>
          <h2>Designed to belong<br />to its <em>setting.</em></h2>
          <p>Material choices are considered as part of the architecture—not as a finish applied afterward. Each one responds to light, landscape and the experience of moving through the home.</p>
          <ul className="material-list">
            {residence.materials.map((material, index) => (
              <li key={material}><span>0{index + 1}</span>{material}</li>
            ))}
          </ul>
        </div>
        <figure className="residence-detail-image">
          <img src={residence.gallery[residence.gallery.length - 1].src} alt={residence.gallery[residence.gallery.length - 1].alt} loading="lazy" />
          <figcaption>{residence.gallery[residence.gallery.length - 1].material}</figcaption>
        </figure>
      </section>

      <section className="residence-specifications section-obsidian page-gutter" aria-labelledby="residence-specifications-title">
        <div className="experience-section-label">
          <span className="eyebrow eyebrow-bronze">At a glance</span>
          <span className="experience-index experience-index--dark">{residence.number}</span>
        </div>
        <div className="residence-spec-copy">
          <h2 id="residence-specifications-title">A considered<br /><em>composition.</em></h2>
          <dl className="specification-list">
            {residence.specifications.map((specification) => (
              <div key={specification.label}>
                <dt>{specification.label}</dt>
                <dd>{specification.value}</dd>
              </div>
            ))}
          </dl>
          <p className="concept-note">The VELOR collection shown here is illustrative. No pricing, dimensions or availability are implied.</p>
        </div>
      </section>

      <section className="related-residences section-ivory page-gutter" aria-labelledby="related-residences-title">
        <div className="experience-heading-row">
          <div>
            <span className="eyebrow">The private collection</span>
            <h2 id="related-residences-title">Further <em>discoveries.</em></h2>
          </div>
        </div>
        <div className="related-residence-grid">
          {residence.related.map((slug) => {
            const related = residences.find((item) => item.slug === slug)
            if (!related) return null
            return <RelatedResidence key={slug} residence={related} onOpen={() => onNavigate({ kind: 'residence', slug })} />
          })}
        </div>
      </section>

      <ExperienceFooter onEnquiry={() => onNavigate({ kind: 'enquiry', enquiryType: 'consultation' })} />
    </article>
  )
}

function RelatedResidence({
  residence,
  onOpen,
}: {
  residence: Residence
  onOpen: () => void
}) {
  return (
    <button className="related-residence" type="button" onClick={onOpen}>
      <img src={residence.image} alt="" loading="lazy" />
      <span className="related-residence-number">{residence.number} / {residence.descriptor}</span>
      <span className="related-residence-title">{residence.name}</span>
      <ArrowUpRight aria-hidden="true" size={18} strokeWidth={1.1} />
    </button>
  )
}

function DestinationExperience({
  destination,
  onNavigate,
}: {
  destination: Destination
  onNavigate: (next: VelorExperience) => void
}) {
  return (
    <article className="destination-experience" aria-labelledby="experience-title">
      <section className="destination-hero">
        <img src={destination.image} alt={destination.alt} fetchPriority="high" />
        <div className="destination-hero-scrim" aria-hidden="true" />
        <div className="destination-hero-copy page-gutter">
          <span className="eyebrow">{destination.number} / A VELOR destination</span>
          <h1 id="experience-title">{destination.name}<em>.</em></h1>
          <p>{destination.location}</p>
        </div>
      </section>

      <section className="destination-introduction section-ivory page-gutter">
        <div className="experience-section-label">
          <span className="eyebrow">Geography / character</span>
          <span className="experience-index">{destination.number}</span>
        </div>
        <div className="destination-intro-copy">
          <p className="destination-standfirst">{destination.introduction}</p>
          <ul className="destination-highlights">
            {destination.highlights.map((highlight, index) => (
              <li key={highlight}><span>0{index + 1}</span>{highlight}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="destination-map-section section-ivory page-gutter" aria-labelledby="destination-map-title">
        <div className="destination-map-copy">
          <span className="eyebrow">A sense of place</span>
          <h2 id="destination-map-title">The wider <em>context.</em></h2>
          <p>Explore the surrounding region. This map offers geographic context only; it does not identify a private residence or property location.</p>
          <a className="experience-text-link" href={destination.mapLink} target="_blank" rel="noreferrer">
            Open map in OpenStreetMap <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.1} />
          </a>
        </div>
        <div className="destination-map-frame">
          <iframe title={destination.mapTitle} src={destination.mapEmbed} loading="lazy" referrerPolicy="strict-origin-when-cross-origin" />
          <span className="map-caption">Regional reference / OpenStreetMap</span>
        </div>
      </section>

      <section className="destination-residences section-obsidian page-gutter" aria-labelledby="destination-residences-title">
        <div className="experience-heading-row experience-heading-row--dark">
          <div>
            <span className="eyebrow eyebrow-bronze">A curated collection</span>
            <h2 id="destination-residences-title">Residences in <em>conversation.</em></h2>
          </div>
          <span className="concept-note">Illustrative residences / not available listings</span>
        </div>
        <div className="related-residence-grid">
          {destination.residences.map((slug) => {
            const residence = residences.find((item) => item.slug === slug)
            if (!residence) return null
            return <RelatedResidence key={slug} residence={residence} onOpen={() => onNavigate({ kind: 'residence', slug })} />
          })}
        </div>
      </section>

      <ExperienceFooter onEnquiry={() => onNavigate({ kind: 'enquiry', enquiryType: 'consultation' })} />
    </article>
  )
}

function StoryExperience({
  story,
  onNavigate,
}: {
  story: Story
  onNavigate: (next: VelorExperience) => void
}) {
  return (
    <article className="story-experience" aria-labelledby="experience-title">
      <section className="story-hero">
        <img src={story.image} alt={story.alt} fetchPriority="high" />
        <div className="story-hero-scrim" aria-hidden="true" />
        <div className="story-hero-copy page-gutter">
          <span className="eyebrow">{story.category} / {story.readTime}</span>
          <h1 id="experience-title">{story.title}<em>.</em></h1>
          <p className="story-standfirst">{story.standfirst}</p>
        </div>
      </section>

      <article className="story-reading section-ivory">
        <div className="story-reading-meta page-gutter">
          <span className="eyebrow">The VELOR perspective</span>
          <span>Field notes / {story.number} of 03</span>
        </div>
        <div className="story-reading-body">
          <p className="story-lead">{story.paragraphs[0]}</p>
          <figure className="story-inline-image">
            <img src={story.image} alt={story.alt} loading="lazy" />
            <figcaption><span>{story.annotation}</span><span>VELOR / {story.number}</span></figcaption>
          </figure>
          <blockquote>{story.pullQuote}</blockquote>
          {story.paragraphs.slice(1).map((paragraph, index) => (
            <p key={`${story.slug}-${index}`}>{paragraph}</p>
          ))}
          <div className="story-endnote">
            <span className="fine-rule" aria-hidden="true" />
            <span className="eyebrow">Beyond the address</span>
          </div>
        </div>
      </article>

      <section className="related-stories section-ivory page-gutter" aria-labelledby="related-stories-title">
        <div className="experience-heading-row">
          <div>
            <span className="eyebrow">Continue reading</span>
            <h2 id="related-stories-title">More from the <em>perspective.</em></h2>
          </div>
        </div>
        <div className="related-story-list">
          {story.related.map((slug) => {
            const related = stories.find((item) => item.slug === slug)
            if (!related) return null
            return (
              <button className="related-story" type="button" key={slug} onClick={() => onNavigate({ kind: 'story', slug })}>
                <span className="eyebrow">{related.category}</span>
                <span className="related-story-title">{related.title}</span>
                <ArrowUpRight aria-hidden="true" size={19} strokeWidth={1.1} />
              </button>
            )
          })}
        </div>
      </section>

      <ExperienceFooter onEnquiry={() => onNavigate({ kind: 'enquiry', enquiryType: 'consultation' })} />
    </article>
  )
}

function ExperienceFooter({ onEnquiry }: { onEnquiry: () => void }) {
  return (
    <footer className="experience-footer">
      <span className="eyebrow">VELOR / Private office</span>
      <button className="experience-inline-link" type="button" onClick={onEnquiry}>
        Begin a private conversation <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.1} />
      </button>
    </footer>
  )
}
