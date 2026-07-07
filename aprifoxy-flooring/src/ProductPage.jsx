import { useMemo, useState } from 'react'
import img1 from './assets/7745.jpg'
import img2 from './assets/46058.jpg'
import img3 from './assets/46258.jpg'
import img4 from './assets/46324.jpg'
import img5 from './assets/46334.jpg'
import img6 from './assets/46336.jpg'

const flooringImages = Object.entries(
  import.meta.glob('./assets/FLOORING/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', {
    eager: true,
    import: 'default',
  })
)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true, sensitivity: 'base' }))
  .map(([, src]) => src)

const fallbackImages = [img1, img2, img3, img4, img5, img6]
const imagePool = flooringImages.length ? flooringImages : fallbackImages
const alignedImage = (slot) => imagePool[slot % imagePool.length]

const baseProducts = [
  {
    name: 'Laminate Flooring',
    description: 'Affordable, stylish and scratch-resistant flooring for homes and offices.',
    features: ['Scratch-resistant', 'Easy to clean', 'Budget-friendly'],
    category: 'wood',
  },
  {
    name: 'Hardwood Flooring',
    description: 'Premium natural wood that adds value and elegance to your space.',
    features: ['Natural wood', 'Long-lasting', 'Classic appearance'],
    category: 'wood',
  },
  {
    name: 'Engineered Wood',
    description: 'Real wood top layer with better stability and moisture resistance.',
    features: ['Real wood surface', 'Moisture stability', 'Elegant look'],
    category: 'wood',
  },
  {
    name: 'Vinyl Flooring',
    description: 'Water-resistant and ideal for kitchens, bathrooms and high-use rooms.',
    features: ['Water-resistant', 'Comfortable underfoot', 'Many designs'],
    category: 'resilient',
  },
  {
    name: 'Luxury Vinyl Plank (LVP)',
    description: 'Wood-look waterproof flooring designed for high-traffic interiors.',
    features: ['Waterproof', 'Realistic wood look', 'Durable wear layer'],
    category: 'resilient',
  },
  {
    name: 'Ceramic Tile Flooring',
    description: 'Versatile fired-clay tiles suitable for wet and dry interior areas.',
    features: ['Water tolerant', 'Design variety', 'Hard-wearing'],
    category: 'tile',
  },
  {
    name: 'Porcelain Tile Flooring',
    description: 'Dense low-porosity tile for premium indoor and outdoor durability.',
    features: ['High density', 'Stain resistant', 'Excellent durability'],
    category: 'tile',
  },
  {
    name: 'Carpet Flooring',
    description: 'Soft textile flooring for comfort-focused residential and hospitality zones.',
    features: ['Soft comfort', 'Sound absorption', 'Wide style selection'],
    category: 'soft',
  },
  {
    name: 'Epoxy Flooring',
    description: 'Seamless, chemical-resistant and ideal for garages and industry.',
    features: ['Seamless finish', 'Chemical resistant', 'Slip-resistant options'],
    category: 'seamless',
  },
  {
    name: 'Polished Concrete Flooring',
    description: 'Mechanically polished concrete surface with high gloss and low upkeep.',
    features: ['Reflective finish', 'Long lifespan', 'Low maintenance'],
    category: 'seamless',
  },
]

const products = baseProducts.map((item, index) => ({
  ...item,
  id: index + 1,
  number: String(index + 1).padStart(2, '0'),
  image: alignedImage(index),
}))

const categories = [
  { id: 'all', label: 'All Products' },
  { id: 'wood', label: 'Wood' },
  { id: 'resilient', label: 'Resilient' },
  { id: 'tile', label: 'Tile' },
  { id: 'soft', label: 'Soft' },
  { id: 'seamless', label: 'Seamless' },
]

const swatches = ['#F2BA44', '#D2A679', '#A58A73', '#8C9195', '#53636E', '#2E4057']

const toHex = (value) => value.toString(16).padStart(2, '0').toUpperCase()
const rgbToHex = ({ r, g, b }) => `#${toHex(r)}${toHex(g)}${toHex(b)}`
const hexToRgb = (hex) => {
  const clean = hex.replace('#', '')
  const normalized = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  const num = Number.parseInt(normalized, 16)

  if (Number.isNaN(num) || normalized.length !== 6) {
    return { r: 242, g: 186, b: 68 }
  }

  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255,
  }
}

const swatchPalette = swatches.map((hex, index) => ({
  hex,
  index,
  rgb: hexToRgb(hex),
}))

const getClosestSwatchIndex = (color) => {
  return swatchPalette.reduce(
    (bestMatch, swatch) => {
      const distance =
        (swatch.rgb.r - color.r) ** 2 +
        (swatch.rgb.g - color.g) ** 2 +
        (swatch.rgb.b - color.b) ** 2

      if (distance < bestMatch.distance) {
        return { index: swatch.index, distance }
      }

      return bestMatch
    },
    { index: 0, distance: Number.POSITIVE_INFINITY }
  ).index
}

export default function ProductPage() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showQuoteModal, setShowQuoteModal] = useState(false)
  const [selectedQuoteProduct, setSelectedQuoteProduct] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [pickedColor, setPickedColor] = useState({ r: 242, g: 186, b: 68 })

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const categoryMatch = activeCategory === 'all' || item.category === activeCategory
      const search = searchTerm.trim().toLowerCase()
      const searchMatch =
        !search ||
        item.name.toLowerCase().includes(search) ||
        item.description.toLowerCase().includes(search) ||
        item.features.some((feature) => feature.toLowerCase().includes(search))

      return categoryMatch && searchMatch
    })
  }, [activeCategory, searchTerm])

  const selectedFinishIndex = useMemo(() => getClosestSwatchIndex(pickedColor), [pickedColor])

  const requestQuote = ({ productName = '', fullName = '', email = '', details = '' } = {}) => {
    const message = [
      'Hello Afripoxy Flooring,',
      '',
      'I would like to request a quote.',
      `Name: ${fullName || '-'}`,
      `Email: ${email || '-'}`,
      `Product: ${productName || '-'}`,
      `Preferred Color: ${colorHex} (RGB ${pickedColor.r}, ${pickedColor.g}, ${pickedColor.b})`,
      `Project Details: ${details || '-'}`,
    ].join('\n')

    window.open(`https://wa.me/27786677565?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer')
  }

  const openQuoteModal = (productName = '') => {
    setSelectedQuoteProduct(productName)
    setShowQuoteModal(true)
  }

  const closeQuoteModal = () => {
    setShowQuoteModal(false)
    setSelectedQuoteProduct('')
  }

  const applySwatch = (hex) => setPickedColor(hexToRgb(hex))
  const colorHex = rgbToHex(pickedColor)
  const tint = `rgba(${pickedColor.r}, ${pickedColor.g}, ${pickedColor.b}, 0.22)`

  return (
    <div className="products-page">
      <section className="products-hero">
        <div className="products-hero-content">
          <p className="products-eyebrow">OUR PRODUCTS</p>
          <h1>Premium Flooring Options for Every Space</h1>
          <p className="products-hero-text">
            Explore our curated range of flooring systems and request quick pricing directly.
          </p>
        </div>
      </section>

      <section className="products-filter-section">
        <div className="container">
          <div className="product-quick-tools">
            <div className="quick-search-wrap">
              <label htmlFor="product-search">Quick Search</label>
              <input
                id="product-search"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Search floor type, finish, or feature"
              />
            </div>

            <div className="color-studio" aria-label="RGB color picker">
              <div className="color-studio-top">
                <p>Finish Color Studio (RGB)</p>
                <span>{colorHex}</span>
              </div>

              <div className="swatch-row">
                {swatchPalette.map(({ hex, index }) => (
                  <button
                    key={hex}
                    type="button"
                    className={`swatch-chip ${selectedFinishIndex === index ? 'active' : ''}`}
                    style={{ backgroundColor: hex }}
                    onClick={() => applySwatch(hex)}
                    aria-label={`Select ${hex}`}
                  />
                ))}
              </div>

              <div className="rgb-grid">
                <label>
                  <span>R</span>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={pickedColor.r}
                    onChange={(event) => setPickedColor((prev) => ({ ...prev, r: Number(event.target.value) }))}
                  />
                  <em>{pickedColor.r}</em>
                </label>
                <label>
                  <span>G</span>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={pickedColor.g}
                    onChange={(event) => setPickedColor((prev) => ({ ...prev, g: Number(event.target.value) }))}
                  />
                  <em>{pickedColor.g}</em>
                </label>
                <label>
                  <span>B</span>
                  <input
                    type="range"
                    min="0"
                    max="255"
                    value={pickedColor.b}
                    onChange={(event) => setPickedColor((prev) => ({ ...prev, b: Number(event.target.value) }))}
                  />
                  <em>{pickedColor.b}</em>
                </label>
              </div>
            </div>
          </div>

          <div className="products-filter">
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                className={`filter-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="products-section">
        <div className="container">
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <article key={product.id} className="product-card">
                <div className="product-image-wrapper">
                  <span className="product-number">{product.number}</span>
                  <img src={product.image} alt={product.name} className="product-image" loading="lazy" />
                  <div className="product-tint-layer" style={{ backgroundColor: tint }} aria-hidden="true" />
                </div>
                <div className="product-content">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <ul className="product-features">
                    {product.features.map((feature) => (
                      <li key={feature}>
                        <span className="feature-icon">•</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <div className="product-actions">
                    <button type="button" className="btn-outline" onClick={() => setSelectedProduct(product)}>
                      View Details
                    </button>
                    <button type="button" className="btn-primary" onClick={() => openQuoteModal(product.name)}>
                      Request Quote
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="products-cta">
        <div className="container cta-content">
          <h2>Need Help Choosing the Right Floor?</h2>
          <p>Our team will guide you to the best system for your space, use-case, and budget.</p>
          <div className="cta-actions">
            <button type="button" className="btn-primary" onClick={() => openQuoteModal()}>
              REQUEST A QUOTE
            </button>
            <a className="btn-outline" href="tel:+27786677565">+27 78 667 7565</a>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={() => setSelectedProduct(null)}>
              ×
            </button>
            <div className="modal-body">
              <div className="modal-image">
                <img src={selectedProduct.image} alt={selectedProduct.name} />
                <span className="modal-badge">{selectedProduct.number}</span>
                <div className="modal-color-badge" style={{ backgroundColor: colorHex }}>
                  <span>Selected Color</span>
                  <strong>{colorHex}</strong>
                </div>
              </div>
              <div className="modal-info">
                <h2>{selectedProduct.name}</h2>
                <p className="modal-description">{selectedProduct.description}</p>
                <div className="modal-color-panel">
                  <div className="color-studio-top">
                    <p>Adjust Finish Color</p>
                    <span>{colorHex}</span>
                  </div>

                  <div className="swatch-row">
                    {swatchPalette.map(({ hex, index }) => (
                      <button
                        key={hex}
                        type="button"
                        className={`swatch-chip ${selectedFinishIndex === index ? 'active' : ''}`}
                        style={{ backgroundColor: hex }}
                        onClick={() => applySwatch(hex)}
                        aria-label={`Select ${hex}`}
                      />
                    ))}
                  </div>

                  <div className="rgb-grid">
                    <label>
                      <span>R</span>
                      <input
                        type="range"
                        min="0"
                        max="255"
                        value={pickedColor.r}
                        onChange={(event) => setPickedColor((prev) => ({ ...prev, r: Number(event.target.value) }))}
                      />
                      <em>{pickedColor.r}</em>
                    </label>
                    <label>
                      <span>G</span>
                      <input
                        type="range"
                        min="0"
                        max="255"
                        value={pickedColor.g}
                        onChange={(event) => setPickedColor((prev) => ({ ...prev, g: Number(event.target.value) }))}
                      />
                      <em>{pickedColor.g}</em>
                    </label>
                    <label>
                      <span>B</span>
                      <input
                        type="range"
                        min="0"
                        max="255"
                        value={pickedColor.b}
                        onChange={(event) => setPickedColor((prev) => ({ ...prev, b: Number(event.target.value) }))}
                      />
                      <em>{pickedColor.b}</em>
                    </label>
                  </div>
                </div>
                <h3>Key Features</h3>
                <ul className="modal-features">
                  {selectedProduct.features.map((feature) => (
                    <li key={feature}>
                      <span className="checkmark">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="modal-actions">
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={() => {
                      setSelectedProduct(null)
                      openQuoteModal(selectedProduct.name)
                    }}
                  >
                    Request Quote
                  </button>
                  <button type="button" className="btn-outline" onClick={() => setSelectedProduct(null)}>
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {showQuoteModal && (
        <div className="modal-overlay" onClick={closeQuoteModal}>
          <div className="modal-content modal-form" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="modal-close" onClick={closeQuoteModal}>
              ×
            </button>
            <div className="modal-body">
              <h2>Request a Quote</h2>
              <p>Tell us about your project and we will respond quickly.</p>
              <div className="modal-color-panel">
                <div className="color-studio-top">
                  <p>Quote Color Choice</p>
                  <span>{colorHex}</span>
                </div>
                <div className="swatch-row">
                  {swatchPalette.map(({ hex, index }) => (
                    <button
                      key={hex}
                      type="button"
                      className={`swatch-chip ${selectedFinishIndex === index ? 'active' : ''}`}
                      style={{ backgroundColor: hex }}
                      onClick={() => applySwatch(hex)}
                      aria-label={`Select ${hex}`}
                    />
                  ))}
                </div>
              </div>
              <form
                className="quote-form"
                onSubmit={(event) => {
                  event.preventDefault()
                  const formData = new FormData(event.currentTarget)
                  const fullName = String(formData.get('name') || '').trim()
                  const email = String(formData.get('email') || '').trim()
                  const productName = String(formData.get('product') || '').trim() || selectedQuoteProduct
                  const details = String(formData.get('details') || '').trim()

                  requestQuote({ fullName, email, productName, details })
                  closeQuoteModal()
                  event.currentTarget.reset()
                }}
              >
                <div className="form-group">
                  <label htmlFor="quote-name">Full Name</label>
                  <input id="quote-name" name="name" type="text" required />
                </div>
                <div className="form-group">
                  <label htmlFor="quote-email">Email Address</label>
                  <input id="quote-email" name="email" type="email" required />
                </div>
                <div className="form-group">
                  <label htmlFor="quote-product">Product</label>
                  <select
                    id="quote-product"
                    name="product"
                    value={selectedQuoteProduct}
                    onChange={(event) => setSelectedQuoteProduct(event.target.value)}
                  >
                    <option value="">Select Product</option>
                    {products.map((item) => (
                      <option key={item.id} value={item.name}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="quote-details">Project Details</label>
                  <textarea id="quote-details" name="details" rows="4" />
                </div>
                <button type="submit" className="btn-primary form-submit">
                  Send Request
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
