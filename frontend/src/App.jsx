import { useEffect, useMemo, useState } from 'react';
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
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            );
          })}
        </main>
      )}
    </div>
  );
}

export default App;
