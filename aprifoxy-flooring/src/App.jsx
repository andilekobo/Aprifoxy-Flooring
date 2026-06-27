import { useEffect, useState } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import img1 from './assets/7745.jpg'
import img2 from './assets/46058.jpg'
import img3 from './assets/46258.jpg'
import img4 from './assets/46324.jpg'
import img5 from './assets/46334.jpg'
import img6 from './assets/46336.jpg'
import logo from './assets/Afripoxy-Flooring-Logo-e1747045780513.png'

const projectGallery = Object.entries(
  import.meta.glob('./assets/*.{jpg,jpeg,JPG,JPEG}', { eager: true, import: 'default' })
)
  .map(([path, src]) => {
    const rawName = path.split('/').pop() || 'Project'
    const fileName = rawName.replace(/\.[^/.]+$/, '')

    return {
      src,
      alt: `Afripoxy epoxy floor project ${fileName}`,
    }
  })
  .sort((a, b) => a.alt.localeCompare(b.alt, undefined, { numeric: true, sensitivity: 'base' }))

export default function AfripoxyWebsite() {
  const [activePanelIndex, setActivePanelIndex] = useState(0)
  const [autoSlideEnabled, setAutoSlideEnabled] = useState(true)
  const [isIntroVisible, setIsIntroVisible] = useState(true)
  const [currentPage, setCurrentPage] = useState(() =>
    window.location.pathname.toLowerCase().startsWith('/projects') ? 'projects' : 'home'
  )
  const whatsappNumber = '27786677565'

  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('aprifoxy-theme')
    if (savedTheme === 'light' || savedTheme === 'dark') {
      return savedTheme
    }
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('aprifoxy-theme', theme)
  }, [theme])

  useEffect(() => {
    const introDuration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 120 : 1800
    const timer = window.setTimeout(() => setIsIntroVisible(false), introDuration)

    return () => window.clearTimeout(timer)
  }, [])

  useEffect(() => {
    const syncRoute = () => {
      const nextPage = window.location.pathname.toLowerCase().startsWith('/projects') ? 'projects' : 'home'
      setCurrentPage(nextPage)
    }

    window.addEventListener('popstate', syncRoute)

    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  useEffect(() => {
    if (currentPage !== 'home') {
      return
    }

    const storyPanels = Array.from(document.querySelectorAll('.story-panel'))
    if (!storyPanels.length) {
      return
    }

    storyPanels.forEach((panel, index) => {
      panel.dataset.panelIndex = String(index)
    })

    storyPanels.forEach((panel) => {
      const groupedRevealItems = new Set()

      panel.querySelectorAll('.reveal-stagger').forEach((group) => {
        const revealItems = Array.from(group.querySelectorAll('.reveal-up'))
        revealItems.forEach((item, index) => {
          groupedRevealItems.add(item)
          item.style.setProperty('--reveal-order', String(index))
        })
      })

      let panelOrder = 0
      panel.querySelectorAll('.reveal-up').forEach((item) => {
        if (groupedRevealItems.has(item)) {
          return
        }

        item.style.setProperty('--reveal-order', String(panelOrder))
        panelOrder += 1
      })
    })

    storyPanels[0].classList.add('is-inview')

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-inview')
            const panelIndex = Number(entry.target.dataset.panelIndex || 0)
            setActivePanelIndex(panelIndex)
          }
        })
      },
      {
        threshold: 0.55,
      }
    )

    storyPanels.forEach((panel) => observer.observe(panel))

    return () => observer.disconnect()
  }, [currentPage])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    gsap.registerPlugin(ScrollTrigger)

    const context = gsap.context(() => {
      gsap.from('.site-header', {
        y: -26,
        opacity: 0,
        duration: 0.85,
        ease: 'power3.out',
      })

      gsap.utils.toArray('.gsap-panel').forEach((panel) => {
        gsap.from(panel, {
          y: 40,
          opacity: 0,
          duration: 0.95,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: panel,
            start: 'top 72%',
            toggleActions: 'play none none reverse',
          },
        })

        const panelItems = panel.querySelectorAll('.gsap-item')
        if (panelItems.length) {
          gsap.from(panelItems, {
            y: 30,
            opacity: 0,
            duration: 0.75,
            ease: 'power3.out',
            stagger: 0.1,
            scrollTrigger: {
              trigger: panel,
              start: 'top 70%',
              toggleActions: 'play none none reverse',
            },
          })
        }
      })

      gsap.utils.toArray('.parallax-media').forEach((item) => {
        gsap.fromTo(
          item,
          { yPercent: -6 },
          {
            yPercent: 6,
            ease: 'none',
            scrollTrigger: {
              trigger: item,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.8,
            },
          }
        )
      })

      gsap.utils.toArray('.section-head').forEach((head) => {
        gsap.fromTo(
          head,
          {
            opacity: 0.72,
            y: 24,
          },
          {
            opacity: 1,
            y: -8,
            ease: 'none',
            scrollTrigger: {
              trigger: head,
              start: 'top 88%',
              end: 'bottom 24%',
              scrub: 0.7,
            },
          }
        )
      })

      gsap.to('.gsap-float', {
        y: -8,
        duration: 3.2,
        ease: 'sine.inOut',
        yoyo: true,
        repeat: -1,
        stagger: 0.2,
      })
    })

    return () => context.revert()
  }, [])

  useEffect(() => {
    if (!autoSlideEnabled) {
      return
    }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return
    }

    const timer = setTimeout(() => {
      const storyPanels = Array.from(document.querySelectorAll('.story-panel'))
      if (storyPanels.length < 2) {
        return
      }

      const nextPanelIndex = (activePanelIndex + 1) % storyPanels.length
      storyPanels[nextPanelIndex].scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 4800)

    return () => clearTimeout(timer)
  }, [activePanelIndex, autoSlideEnabled])

  useEffect(() => {
    if (!autoSlideEnabled) {
      return
    }

    const stopAutoplay = () => setAutoSlideEnabled(false)
    const passive = { passive: true }

    window.addEventListener('pointerdown', stopAutoplay, passive)
    window.addEventListener('touchstart', stopAutoplay, passive)
    window.addEventListener('wheel', stopAutoplay, passive)
    window.addEventListener('keydown', stopAutoplay)

    return () => {
      window.removeEventListener('pointerdown', stopAutoplay)
      window.removeEventListener('touchstart', stopAutoplay)
      window.removeEventListener('wheel', stopAutoplay)
      window.removeEventListener('keydown', stopAutoplay)
    }
  }, [autoSlideEnabled])

  const services = [
    {
      title: 'Residential Epoxy Systems',
      description:
        'Seamless, low-maintenance finishes built for modern homes, garages, and outdoor entertainment spaces.',
    },
    {
      title: 'Metallic Signature Floors',
      description:
        'Custom swirl patterns and mirror-like depth that give each room a one-of-a-kind premium character.',
    },
    {
      title: 'Industrial Coating Protection',
      description:
        'Heavy-duty chemical and abrasion-resistant systems designed for warehouses, workshops, and production zones.',
    },
  ]

  const process = [
    {
      step: '01',
      title: 'Consultation & Site Visit',
      description: 'We inspect your space and recommend the right epoxy system for traffic, moisture, and design goals.',
    },
    {
      step: '02',
      title: 'Surface Prep & Repair',
      description: 'Grinding, crack repair, and levelling ensure maximum adhesion and long-term durability.',
    },
    {
      step: '03',
      title: 'Application & Detailing',
      description: 'Primers, base coats, decorative effects, and protective top coats are applied with precision.',
    },
    {
      step: '04',
      title: 'Final Handover',
      description: 'After quality checks, we share care guidelines so your floor keeps its shine for years.',
    },
  ]

  const gallery = [
    { src: img1, alt: 'Glossy living room epoxy floor finish' },
    { src: img2, alt: 'Metallic epoxy swirl texture closeup' },
    { src: img3, alt: 'Polished epoxy coating in a modern interior' },
    { src: img4, alt: 'High-shine decorative epoxy flooring pattern' },
    { src: img5, alt: 'Durable industrial epoxy floor in workshop area' },
    { src: img6, alt: 'Luxury marble-like epoxy finish in a hallway' },
  ]

  const reviews = [
    {
      name: 'Sipho M.',
      role: 'Durban Homeowner',
      quote:
        'Afripoxy transformed our garage into a premium showroom finish. The team was punctual, neat, and highly professional.',
    },
    {
      name: 'Naledi K.',
      role: 'Retail Studio Owner',
      quote:
        'Our store floor now looks incredible and handles heavy daily traffic with zero wear. Clients comment on it all the time.',
    },
    {
      name: 'Johan P.',
      role: 'Warehouse Manager',
      quote:
        'The industrial coating has made cleaning easier and improved safety. Delivery was on schedule and communication was excellent.',
    },
  ]

  const openProjectsPage = (event) => {
    event.preventDefault()
    window.history.pushState({}, '', '/projects')
    setCurrentPage('projects')
    setAutoSlideEnabled(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const goToHomeSection = (event, sectionId = 'home') => {
    event.preventDefault()

    const scrollToSection = () => {
      const section = document.getElementById(sectionId)
      if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    if (currentPage === 'projects') {
      window.history.pushState({}, '', '/')
      setCurrentPage('home')
      window.setTimeout(scrollToSection, 80)
      return
    }

    scrollToSection()
  }

  const handleContactSubmit = (event) => {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)
    const name = String(formData.get('name') || '').trim()
    const email = String(formData.get('email') || '').trim()
    const details = String(formData.get('details') || '').trim()

    const message = [
      'Hello Afripoxy Flooring,',
      '',
      `Name: ${name || '-'}`,
      `Email: ${email || '-'}`,
      `Project Details: ${details || '-'}`,
    ].join('\n')

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer')
  }

  return (
    <div className="site-shell">
      {isIntroVisible && (
        <div className="brand-splash is-visible" aria-hidden={!isIntroVisible}>
          <div className="brand-splash-core">
            <img src={logo} alt="ApriFoxy Flooring" className="brand-splash-logo" />
            <p>ApriFoxy Flooring</p>
          </div>
        </div>
      )}

      <header className="site-header">
        <div className="container topbar">
          <a className="brand" href="/" onClick={(event) => goToHomeSection(event, 'home')} aria-label="Afripoxy Flooring Home">
            <span className="brand-mark">
              <img src={logo} alt="Afripoxy Flooring logo" className="brand-logo" />
            </span>
            <span>Afripoxy Flooring</span>
          </a>

          <nav className="nav-links" aria-label="Main navigation">
            <a href="/" onClick={(event) => goToHomeSection(event, 'services')}>Services</a>
            <a href="/" onClick={(event) => goToHomeSection(event, 'process')}>Process</a>
            <a href="/projects" onClick={openProjectsPage}>Projects</a>
            <a href="/" onClick={(event) => goToHomeSection(event, 'reviews')}>Reviews</a>
            <a href="/" onClick={(event) => goToHomeSection(event, 'contact')}>Contact</a>
          </nav>

          <div className="header-actions">
            <a className="btn btn-solid" href="/" onClick={(event) => goToHomeSection(event, 'contact')}>
              Book Estimate
            </a>

            <button
              type="button"
              className="btn btn-outline theme-toggle"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            >
              <img src={logo} alt="" className="theme-toggle-logo" aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {currentPage === 'projects' ? (
        <main className="projects-page">
          <section className="projects-hero gsap-panel">
            <div className="container projects-head reveal-stagger">
              <p className="eyebrow reveal-up gsap-item">Our completed installations</p>
              <h1 className="projects-title reveal-up gsap-item">Projects Gallery</h1>
              <p className="projects-subtitle reveal-up gsap-item">
                Browse the full portfolio, including the latest photos uploaded to this project.
              </p>
              <div className="projects-actions reveal-up gsap-item">
                <a className="btn btn-outline" href="/" onClick={(event) => goToHomeSection(event, 'gallery')}>
                  Back to Home
                </a>
                <a className="btn btn-solid" href="/" onClick={(event) => goToHomeSection(event, 'contact')}>
                  Request a Quote
                </a>
              </div>
            </div>
          </section>

          <section className="projects-wall gsap-panel">
            <div className="container">
              <div className="projects-grid reveal-stagger">
                {projectGallery.map((item, index) => (
                  <figure key={`${item.alt}-${index}`} className={`project-tile reveal-up gsap-item interactive-hover float-card float-${(index % 3) + 1}`}>
                    <img
                      className={`parallax-media float-media gsap-float float-${(index % 3) + 1}`}
                      src={item.src}
                      alt={item.alt}
                      loading="lazy"
                    />
                  </figure>
                ))}
              </div>
            </div>
          </section>
        </main>
      ) : (
      <main className="story-scroll">
        <section id="home" className="hero story-panel gsap-panel">
          <div className="container hero-grid">
            <div className="hero-copy reveal-up gsap-item">
              <p className="eyebrow">Premium epoxy surfaces for homes and industry</p>
              <h1>Floors that perform hard and look unforgettable.</h1>
              <p>
                Afripoxy builds seamless, impact-resistant flooring systems with luxury finishes and long-term value.
                From garages to commercial spaces, every installation is tailored and engineered for your environment.
              </p>
              <div className="hero-actions">
                <a className="btn btn-solid" href="/" onClick={(event) => goToHomeSection(event, 'contact')}>
                  Request a Quote
                </a>
                <a className="btn btn-outline" href="/projects" onClick={openProjectsPage}>
                  View Projects
                </a>
              </div>

              <ul className="hero-stats reveal-stagger" aria-label="Company highlights">
                <li className="reveal-up gsap-item interactive-hover">
                  <strong>250+</strong>
                  <span>Projects Delivered</span>
                </li>
                <li className="reveal-up gsap-item interactive-hover">
                  <strong>8 Years</strong>
                  <span>Installation Experience</span>
                </li>
                <li className="reveal-up gsap-item interactive-hover">
                  <strong>48 hrs</strong>
                  <span>Typical Turnaround</span>
                </li>
              </ul>
            </div>

            <div className="hero-visual reveal-up gsap-item float-card float-2">
              <img className="float-media gsap-float float-2 parallax-media" src={img1} alt="Afripoxy decorative epoxy floor installation" />
              <div className="quality-note">
                <p>Certified installers</p>
                <p>Warranty-backed systems</p>
              </div>
            </div>
          </div>
        </section>

        <div className="motion-ribbon gsap-panel" aria-label="Afripoxy quality highlights">
          <div className="ribbon-track">
            <span>Premium Epoxy Systems</span>
            <span>Seamless Installation</span>
            <span>Commercial Grade Durability</span>
            <span>Luxury Metallic Finishes</span>
            <span>Fast Project Turnarounds</span>
            <span>Premium Epoxy Systems</span>
            <span>Seamless Installation</span>
            <span>Commercial Grade Durability</span>
            <span>Luxury Metallic Finishes</span>
            <span>Fast Project Turnarounds</span>
          </div>
        </div>

        <section id="services" className="section story-panel gsap-panel">
          <div className="container">
            <div className="section-head reveal-up gsap-item">
              <p className="eyebrow">What we do best</p>
              <h2>Specialized coating systems for every floor type</h2>
            </div>

            <div className="service-grid reveal-stagger">
              {services.map((service) => (
                <article key={service.title} className="service-card reveal-up gsap-item interactive-hover">
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="process" className="section process-band story-panel gsap-panel">
          <div className="container">
            <div className="section-head reveal-up gsap-item">
              <p className="eyebrow">How we work</p>
              <h2>Clear process, consistent quality, zero guesswork</h2>
            </div>

            <div className="process-grid reveal-stagger">
              {process.map((item) => (
                <article key={item.step} className="process-card reveal-up gsap-item interactive-hover">
                  <span>{item.step}</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="gallery" className="section story-panel gsap-panel">
          <div className="container">
            <div className="section-head reveal-up gsap-item">
              <p className="eyebrow">Recent finishes</p>
              <h2>Project gallery</h2>
            </div>

            <div className="gallery-grid reveal-stagger">
              {gallery.map((item, index) => (
                <figure key={item.alt} className={`gallery-item reveal-up gsap-item float-card float-${(index % 3) + 1} interactive-hover`}>
                  <img className={`float-media gsap-float float-${(index % 3) + 1} parallax-media`} src={item.src} alt={item.alt} loading="lazy" />
                </figure>
              ))}
            </div>

            <div className="gallery-cta reveal-up gsap-item">
              <a className="btn btn-solid gallery-view-more" href="/projects" onClick={openProjectsPage}>
                View More Projects
              </a>
              <p>Request our full portfolio and finish catalogue.</p>
            </div>
          </div>
        </section>

        <section id="reviews" className="section story-panel gsap-panel reviews-panel">
          <div className="container">
            <div className="section-head reveal-up gsap-item">
              <p className="eyebrow">Client feedback</p>
              <h2>Reviews from projects across South Africa</h2>
            </div>

            <div className="reviews-grid reveal-stagger">
              {reviews.map((review) => (
                <article key={review.name} className="review-card reveal-up gsap-item interactive-hover">
                  <div className="review-stars" aria-label="5 star rating">
                    <span>★★★★★</span>
                  </div>
                  <p>{review.quote}</p>
                  <h3>{review.name}</h3>
                  <small>{review.role}</small>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="contact" className="section contact-wrap story-panel gsap-panel">
          <div className="container contact-grid">
            <div className="contact-copy reveal-up gsap-item">
              <p className="eyebrow">Start your project</p>
              <h2>Tell us what you need, and we will send a tailored estimate.</h2>
              <p>
                Share your floor size, usage type, and preferred finish. Our team replies quickly with practical
                recommendations, timelines, and next steps.
              </p>
              <div className="contact-meta">
                <a href="tel:+27786677565">+27 78 667 7565</a>
                <a href="mailto:hello@afripoxyflooring.com">hello@afripoxyflooring.com</a>
              </div>
            </div>

            <form className="contact-card reveal-up gsap-item interactive-hover" onSubmit={handleContactSubmit}>
              <label htmlFor="name">Full Name</label>
              <input id="name" name="name" type="text" placeholder="Jane Doe" required />

              <label htmlFor="email">Email Address</label>
              <input id="email" name="email" type="email" placeholder="jane@email.com" required />

              <label htmlFor="details">Project Details</label>
              <textarea id="details" name="details" rows="5" placeholder="Surface size, area type, and preferred finish." required />

              <button className="btn btn-solid" type="submit">
                Send Inquiry
              </button>
            </form>
          </div>
        </section>
      </main>
      )}

      <footer className="site-footer story-panel" id="footer">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand-block gsap-item">
              <h3 className="footer-brand-title">ApriFoxy Flooring</h3>
              <a className="footer-brand" href="#home" aria-label="ApriFoxy Flooring Home">
                <span className="footer-mark" aria-hidden="true">
                  <img src={logo} alt="" className="footer-logo" />
                </span>
                <strong>ApriFoxy Flooring</strong>
              </a>
              <p>
                Professional epoxy flooring systems for residential, commercial, and industrial spaces.
              </p>
            </div>

            <div className="footer-areas gsap-item">
              <div className="areas-list">
                <h3>Service Area</h3>
                <p className="areas-note">Coverage across major regions in South Africa.</p>
                <div className="areas-chip-list" role="list" aria-label="Service areas covered">
                  <span role="listitem">KZN</span>
                  <span role="listitem">Limpopo</span>
                  <span role="listitem">Free State</span>
                  <span role="listitem">North West</span>
                  <span role="listitem">Mpumalanga</span>
                  <span role="listitem">Western Cape</span>
                  <span role="listitem">Eastern Cape</span>
                </div>
              </div>
            </div>

            <div className="footer-social-block gsap-item" aria-label="Our socials">
              <h3>Our Socials</h3>
              <div className="social-links">
                <a href="https://www.facebook.com/" className="social-facebook" aria-label="Facebook" title="Facebook" target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                    <path d="M13.5 9H16V6h-2.5C10.9 6 9 7.9 9 10.5V13H7v3h2v5h3v-5h2.3l.7-3H12v-2.5c0-.8.7-1.5 1.5-1.5Z" />
                  </svg>
                  <span>Facebook</span>
                </a>
                <a href="https://www.instagram.com/" className="social-instagram" aria-label="Instagram" title="Instagram" target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                    <path d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9a4.5 4.5 0 0 1-4.5 4.5h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3Zm0 2A2.5 2.5 0 0 0 5 7.5v9A2.5 2.5 0 0 0 7.5 19h9a2.5 2.5 0 0 0 2.5-2.5v-9A2.5 2.5 0 0 0 16.5 5h-9ZM12 8a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm4.8-3.1a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2Z" />
                  </svg>
                  <span>Instagram</span>
                </a>
                <a href="https://wa.me/27786677565" className="social-whatsapp" aria-label="WhatsApp" title="WhatsApp" target="_blank" rel="noreferrer">
                  <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                    <path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.7-1.2A9 9 0 1 0 12 3Zm0 16.3a7.2 7.2 0 0 1-3.7-1l-.3-.2-2.8.7.8-2.7-.2-.3a7.2 7.2 0 1 1 6.2 3.5Zm4-5.4c-.2-.1-1.3-.7-1.5-.8-.2-.1-.4-.1-.5.1s-.6.8-.7.9c-.1.1-.2.2-.4.1-.2-.1-.9-.3-1.7-1.1-.6-.6-1-1.3-1.1-1.5-.1-.2 0-.3.1-.4l.3-.3c.1-.1.2-.2.2-.3.1-.1 0-.2 0-.3s-.5-1.2-.7-1.6c-.2-.4-.4-.3-.5-.3h-.4c-.1 0-.3.1-.5.2s-.6.6-.6 1.4.6 1.6.7 1.7c.1.1 1.2 1.9 3 2.7 1.8.8 1.8.5 2.1.5.3 0 1-.4 1.1-.7.1-.3.1-.6.1-.7 0-.1-.2-.2-.4-.3Z" />
                  </svg>
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            <div className="footer-links gsap-item">
              <h3>Quick Links</h3>
              <a href="#services">Services</a>
              <a href="#process">Process</a>
              <a href="#gallery">Gallery</a>
              <a href="#reviews">Reviews</a>
              <a href="#contact">Contact</a>
            </div>
          </div>

          <div className="footer-bottom gsap-item">
            <p>© 2026 Afripoxy Flooring. Engineered surfaces. Refined finish.</p>
            <p>
              Built by <span>Blue Peak ENGINEERS</span>
            </p>
          </div>

          <div className="payment-strip gsap-item" aria-label="Accepted payment methods">
            <p>Accepted Payments</p>
            <div className="payment-badges">
              <span className="payment-badge payment-payfast">
                <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                  <path d="M4 6h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm1 3v6h14V9H5Zm2 1h3v1H8v1h2v1H7v-3Zm5 0h4v1h-3v1h3v1h-4v-3Z" />
                </svg>
                <em>PayFast</em>
              </span>
              <span className="payment-badge payment-visa">
                <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                  <path d="M3 7h18v10H3V7Zm2 2v6h14V9H5Zm2 1h3l1 4h-2l-.2-.9H7.2L7 14H5l2-4Zm.9 1.1-.4 1h.9l-.3-1h-.2Zm4.1-1.1h3.5v1h-1v3h-1.5v-3h-1V10Z" />
                </svg>
                <em>VISA</em>
              </span>
              <span className="payment-badge payment-mastercard">
                <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                  <path d="M9.5 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm5 0a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm-2.5 1.2a4.9 4.9 0 0 1 0 5.6 4.9 4.9 0 0 1 0-5.6Z" />
                </svg>
                <em>Mastercard</em>
              </span>
              <span className="payment-badge payment-zapper">
                <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                  <path d="M12 3a9 9 0 1 0 9 9 9 9 0 0 0-9-9Zm-1 4h2v5h-2V7Zm0 7h2v2h-2v-2Z" />
                </svg>
                <em>Zapper</em>
              </span>
              <span className="payment-badge payment-instant-eft">
                <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                  <path d="M12 2 4 6v5c0 5.2 3.4 9.9 8 11 4.6-1.1 8-5.8 8-11V6l-8-4Zm0 3.2L17 7.7v3.2c0 3.8-2.3 7.3-5 8.6-2.7-1.3-5-4.8-5-8.6V7.7l5-2.5Zm-1 3.8h2v2h2v2h-2v2h-2v-2H9v-2h2V9Z" />
                </svg>
                <em>Instant EFT</em>
              </span>
              <span className="payment-badge payment-bank-eft">
                <svg viewBox="0 0 24 24" role="img" aria-hidden="true">
                  <path d="M12 4 3 8v2h18V8l-9-4Zm-7 8h2v5H5v-5Zm4 0h2v5H9v-5Zm4 0h2v5h-2v-5Zm4 0h2v5h-2v-5ZM3 19h18v2H3v-2Z" />
                </svg>
                <em>Bank EFT</em>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}