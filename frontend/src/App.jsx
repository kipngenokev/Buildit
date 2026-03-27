import { useEffect, useMemo, useRef, useState } from 'react';
import { fallbackProducts } from './data/fallbackProducts';

const categoryLabels = {
  SINK: 'Sinks',
  TILE: 'Tiles',
  TAP: 'Kitchen & Bathroom Taps',
  SHOWER: 'Showers'
};

const categoryOrder = ['SINK', 'TILE', 'TAP', 'SHOWER'];

function formatPrice(price) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price);
}

function App() {
  const [products, setProducts] = useState([]);
  const [status, setStatus] = useState('loading');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const triggerButtonRef = useRef(null);

  const closeDetails = () => {
    setSelectedProduct(null);
    if (triggerButtonRef.current) {
      triggerButtonRef.current.focus();
    }
  };

  useEffect(() => {
    let active = true;

    fetch('/api/products')
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Request failed: ${response.status}`);
        }

        return response.json();
      })
      .then((items) => {
        if (!active) {
          return;
        }

        setProducts(Array.isArray(items) && items.length > 0 ? items : fallbackProducts);
        setStatus('ready');
      })
      .catch(() => {
        if (!active) {
          return;
        }

        setProducts(fallbackProducts);
        setStatus('ready');
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedProduct) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        closeDetails();
        return;
      }

      if (event.key === 'Tab') {
        if (!dialogRef.current) {
          return;
        }

        const focusableElements = Array.from(
          dialogRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          )
        ).filter((element) => !element.hasAttribute('disabled'));

        if (focusableElements.length === 0) {
          event.preventDefault();
          dialogRef.current.focus();
          return;
        }

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        const activeElement = document.activeElement;

        if (event.shiftKey && activeElement === firstElement) {
          event.preventDefault();
          lastElement.focus();
        } else if (!event.shiftKey && activeElement === lastElement) {
          event.preventDefault();
          firstElement.focus();
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [selectedProduct]);

  useEffect(() => {
    if (!selectedProduct) {
      return;
    }

    if (closeButtonRef.current) {
      closeButtonRef.current.focus();
    } else if (dialogRef.current) {
      dialogRef.current.focus();
    }
  }, [selectedProduct]);

  const groupedProducts = useMemo(() => {
    return products.reduce((acc, product) => {
      const category = product.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(product);
      return acc;
    }, {});
  }, [products]);

  return (
    <div className="page">
      <header className="hero">
        <p className="eyebrow">Buildit Premium Hardware Store</p>
        <h1>Curated Sinks, Tiles, Taps and Showers for Distinctive Spaces</h1>
        <p>
          Discover design-forward products with precise specifications and practical details,
          built for beautiful kitchens and bathrooms.
        </p>
      </header>

      {status === 'loading' ? (
        <p className="loading">Loading product catalog…</p>
      ) : (
        <main>
          {categoryOrder.map((category) => {
            const items = groupedProducts[category] || [];

            if (items.length === 0) {
              return null;
            }

            return (
              <section key={category} className="catalog-section" aria-label={categoryLabels[category]}>
                <div className="section-header">
                  <h2>{categoryLabels[category]}</h2>
                </div>

                <div className="grid">
                  {items.map((product) => (
                    <article className="card" key={product.id ?? product.name}>
                      <img src={product.imageUrl} alt={product.name} loading="lazy" />
                      <div className="card-content">
                        <h3>{product.name}</h3>
                        <p className="summary">{product.shortDescription}</p>
                        <p className="description">{product.detailedDescription}</p>
                        <div className="meta">
                          <span>{product.designStyle} design</span>
                          <span>{product.material}</span>
                        </div>
                        <p className="price">{formatPrice(product.price)}</p>
                        <button
                          type="button"
                          className="details-button"
                          onClick={(event) => {
                            triggerButtonRef.current = event.currentTarget;
                            setSelectedProduct(product);
                          }}
                        >
                          View details
                        </button>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </main>
      )}

      {selectedProduct ? (
        <section
          className="product-detail-overlay"
          role="dialog"
          aria-modal="true"
          aria-label={`${selectedProduct.name} details`}
          tabIndex={-1}
          ref={dialogRef}
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              closeDetails();
            }
          }}
        >
          <article className="product-detail-card">
            <button
              type="button"
              className="close-button"
              aria-label="Close details"
              ref={closeButtonRef}
              onClick={closeDetails}
            >
              ×
            </button>
            <img src={selectedProduct.imageUrl} alt={selectedProduct.name} loading="lazy" />
            <h2>{selectedProduct.name}</h2>
            <p className="summary">{selectedProduct.shortDescription}</p>
            <p className="description">{selectedProduct.detailedDescription}</p>
            <div className="meta">
              <span>{selectedProduct.designStyle} design</span>
              <span>{selectedProduct.material}</span>
            </div>
            <p className="price">{formatPrice(selectedProduct.price)}</p>
          </article>
        </section>
      ) : null}
    </div>
  );
}

export default App;
