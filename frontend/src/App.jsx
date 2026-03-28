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
  const [authMode, setAuthMode] = useState('login');
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [authState, setAuthState] = useState({ token: '', role: '', email: '' });
  const [authMessage, setAuthMessage] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [cartMessage, setCartMessage] = useState('');
  const dialogRef = useRef(null);
  const closeButtonRef = useRef(null);
  const triggerButtonRef = useRef(null);

  const isAuthenticated = Boolean(authState.token);

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

  useEffect(() => {
    const storedToken = localStorage.getItem('buildit_token');
    const storedRole = localStorage.getItem('buildit_role');
    const storedEmail = localStorage.getItem('buildit_email');
    if (storedToken) {
      setAuthState({
        token: storedToken,
        role: storedRole || '',
        email: storedEmail || ''
      });
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setCartItems([]);
      return;
    }

    fetch('/api/cart', {
      headers: {
        Authorization: `Bearer ${authState.token}`
      }
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load cart');
        }
        return response.json();
      })
      .then((items) => {
        setCartItems(Array.isArray(items) ? items : []);
      })
      .catch(() => {
        setCartItems([]);
      });
  }, [authState.token, isAuthenticated]);

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

  const cartCount = useMemo(() => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  }, [cartItems]);

  const handleCredentialsChange = (event) => {
    const { name, value } = event.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleAuthSubmit = async (event) => {
    event.preventDefault();
    setAuthMessage('');
    const endpoint = authMode === 'register' ? '/api/auth/register' : '/api/auth/login';

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });

      if (!response.ok) {
        throw new Error();
      }

      const data = await response.json();
      const email = credentials.email.trim().toLowerCase();
      setAuthState({
        token: data.token,
        role: data.role,
        email
      });
      localStorage.setItem('buildit_token', data.token);
      localStorage.setItem('buildit_role', data.role);
      localStorage.setItem('buildit_email', email);
      setAuthMessage(authMode === 'register' ? 'Registration successful.' : 'Login successful.');
      setCredentials((prev) => ({ ...prev, password: '' }));
    } catch {
      setAuthMessage('Authentication failed. Verify your credentials and try again.');
    }
  };

  const logout = () => {
    setAuthState({ token: '', role: '', email: '' });
    setCartItems([]);
    setAuthMessage('You have been logged out.');
    localStorage.removeItem('buildit_token');
    localStorage.removeItem('buildit_role');
    localStorage.removeItem('buildit_email');
  };

  const addToCart = async (productId) => {
    setCartMessage('');
    if (!isAuthenticated) {
      setCartMessage('Please login or register to add products to cart.');
      return;
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authState.token}`
        },
        body: JSON.stringify({ productId, quantity: 1 })
      });

      if (!response.ok) {
        throw new Error();
      }

      const items = await response.json();
      setCartItems(Array.isArray(items) ? items : []);
      setCartMessage('Product added to cart.');
    } catch {
      setCartMessage('Unable to add to cart right now.');
    }
  };

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
      <section className="auth-cart-panel" aria-label="Authentication and cart">
        <div className="auth-card">
          <h2>{isAuthenticated ? 'Account' : 'Authenticate'}</h2>
          {isAuthenticated ? (
            <>
              <p className="auth-meta">
                Signed in as <strong>{authState.email}</strong> ({authState.role})
              </p>
              <button type="button" className="secondary-button" onClick={logout}>
                Logout
              </button>
            </>
          ) : (
            <form onSubmit={handleAuthSubmit} className="auth-form">
              <div className="auth-mode-buttons">
                <button
                  type="button"
                  className={authMode === 'login' ? 'mode-button active' : 'mode-button'}
                  onClick={() => setAuthMode('login')}
                >
                  Login
                </button>
                <button
                  type="button"
                  className={authMode === 'register' ? 'mode-button active' : 'mode-button'}
                  onClick={() => setAuthMode('register')}
                >
                  Register
                </button>
              </div>
              <label>
                Email
                <input
                  name="email"
                  type="email"
                  value={credentials.email}
                  onChange={handleCredentialsChange}
                  required
                />
              </label>
              <label>
                Password
                <input
                  name="password"
                  type="password"
                  value={credentials.password}
                  onChange={handleCredentialsChange}
                  required
                  minLength={8}
                />
              </label>
              <button type="submit" className="secondary-button">
                {authMode === 'register' ? 'Create account' : 'Sign in'}
              </button>
              <a className="oauth-link" href="/oauth2/authorization/google">
                Continue with OAuth2
              </a>
            </form>
          )}
          {authMessage ? <p className="auth-message">{authMessage}</p> : null}
        </div>
        <div className="cart-card">
          <h2>Cart</h2>
          <p className="auth-meta">Items in cart: {cartCount}</p>
          {cartItems.length > 0 ? (
            <ul>
              {cartItems.map((item) => (
                <li key={item.id ?? item.productId}>
                  {item.productName} × {item.quantity}
                </li>
              ))}
            </ul>
          ) : (
            <p className="auth-meta">Your cart is empty.</p>
          )}
          {cartMessage ? <p className="auth-message">{cartMessage}</p> : null}
        </div>
      </section>

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
                        <button
                          type="button"
                          className="add-to-cart-button"
                          onClick={() => addToCart(product.id)}
                        >
                          Add to cart
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
