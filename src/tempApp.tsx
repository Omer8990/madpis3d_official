import React, { useState } from 'react';
import { ShoppingCart, Menu, X, AlertCircle, Truck, Package } from 'lucide-react';
import './App.css';

interface Product {
  id: number;
  name: string;
  nameEn: string;
  price: number;
  description: string;
  image: string;
  stock: number;
}

interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  zipCode: string;
  notes: string;
}

const SHIPPING_COST = 25;
const FREE_SHIPPING_THRESHOLD = 150;

const products: Product[] = [
  {
    id: 1,
    name: 'אגרטל גדול',
    nameEn: 'Large Vase',
    price: 120,
    description: 'אגרטל מודפס תלת מימד באיכות גבוהה, מושלם לסלון או למרפסת',
    image: '/images/large_vase.png',
    stock: 5
  },
  {
    id: 2,
    name: 'אגרטל קטן',
    nameEn: 'Small Vase',
    price: 80,
    description: 'אגרטל קומפקטי ומעוצב, אידיאלי לשולחן העבודה או המטבח',
    image: '/images/small_vase.JPG',
    stock: 3
  },
  {
    id: 3,
    name: 'מעמד לשעון אפל',
    nameEn: 'Apple Watch Stand',
    price: 50,
    description: 'מעמד מינימליסטי ואלגנטי לשעון החכם שלך',
    image: '/images/apple_watch_stand.jpg',
    stock: 8
  },
  {
    id: 4,
    name: 'מסדר כבלים',
    nameEn: 'Cable Organizer',
    price: 30,
    description: 'פתרון חכם לניהול כבלים בשולחן העבודה',
    image: '/images/cable_organizer.jpg',
    stock: 2
  },
];

const StockIndicator: React.FC<{ stock: number }> = ({ stock }) => {
  if (stock === 0) {
    return (
      <div className="stock-indicator out">
        <AlertCircle className="icon" />
        <span>אזל המלאי</span>
      </div>
    );
  } else if (stock <= 3) {
    return (
      <div className="stock-indicator low">
        <AlertCircle className="icon" />
        <span>נשארו {stock} יחידות במלאי</span>
      </div>
    );
  }
  return null;
};

const App: React.FC = () => {
  const [cart, setCart] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [shippingDetails, setShippingDetails] = useState<ShippingDetails>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    notes: ''
  });

  const getAvailableStock = (productId: number) => {
    const product = products.find(p => p.id === productId);
    if (!product) return 0;
    const inCart = cart.filter(item => item.id === productId).length;
    return product.stock - inCart;
  };

  const addToCart = (product: Product) => {
    const availableStock = getAvailableStock(product.id);
    if (availableStock > 0) {
      setCart([...cart, product]);
    }
  };

  const removeFromCart = (productId: number) => {
    const indexToRemove = cart.findIndex(item => item.id === productId);
    if (indexToRemove !== -1) {
      const newCart = [...cart];
      newCart.splice(indexToRemove, 1);
      setCart(newCart);
    }
  };

  const getTotalPrice = () => {
    const subtotal = cart.reduce((total, item) => total + item.price, 0);
    const needsShipping = subtotal < FREE_SHIPPING_THRESHOLD;
    return {
      subtotal,
      shipping: needsShipping ? SHIPPING_COST : 0,
      total: needsShipping ? subtotal + SHIPPING_COST : subtotal
    };
  };

  const getCartItemCount = (productId: number) => {
    return cart.filter(item => item.id === productId).length;
  };


  const handleShippingDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckout = () => {
    const { subtotal, shipping, total } = getTotalPrice();

    // Create order details string
    const orderDetails = cart.reduce((acc, item) => {
      const count = getCartItemCount(item.id);
      return acc + `${item.name} x${count}, `;
    }, '').slice(0, -2);

        // Create PayPal item description with shipping details
    const itemDescription = encodeURIComponent(
      `Order: ${orderDetails}\n` +
      `Shipping to: ${shippingDetails.fullName}\n` +
      `Address: ${shippingDetails.address}, ${shippingDetails.city} ${shippingDetails.zipCode}\n` +
      `Phone: ${shippingDetails.phone}\n` +
      `Email: ${shippingDetails.email}\n` +
      `Notes: ${shippingDetails.notes}`
    );

    // Send order notification email (you'll need to set up an email service)
    const emailBody = `
      New Order:
      ${orderDetails}

      Shipping Details:
      Name: ${shippingDetails.fullName}
      Email: ${shippingDetails.email}
      Phone: ${shippingDetails.phone}
      Address: ${shippingDetails.address}
      City: ${shippingDetails.city}
      Zip Code: ${shippingDetails.zipCode}
      Notes: ${shippingDetails.notes}

      Order Total: ₪${total} (Subtotal: ₪${subtotal}, Shipping: ₪${shipping})
    `;
    // temp until email will be sent instead
    console.log(emailBody);

    // You can implement email sending here using a service like EmailJS or your backend

    const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=madpis3d@gmail.com&item_name=${itemDescription}&amount=${total}&currency_code=ILS`;
    window.open(paypalUrl, '_blank');
  };

  return (
    <div dir="rtl" className="app-container">
      {/* Header */}
      <header className="main-header">
        <div className="header-content">
          <div className="header-left">
            <button
              className="menu-button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <h1>Madpis3D</h1>
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="cart-button"
          >
            <ShoppingCart />
            {cart.length > 0 && (
              <span className="cart-count">{cart.length}</span>
            )}
          </button>
        </div>
      </header>

      {/* Cart Sidebar */}
            {isCartOpen && (
        <div className="cart-overlay">
          <div className="cart-sidebar">
            {/* ... (previous cart header) ... */}

            <div className="cart-items">
              {cart.length > 0 ? (
                <>
                    {Array.from(new Set(cart.map(item => item.id))).map((productId) => {
                    const product = products.find(p => p.id === productId);
                    if (!product) return null;
                    const quantity = getCartItemCount(productId);
                    return (
                      <div key={productId} className="cart-item">
                        <div className="item-info">
                          <span className="item-name">{product.name}</span>
                          <div className="item-quantity">
                            {quantity} × ₪{product.price}
                          </div>
                        </div>
                        <div className="item-actions">
                          <span className="item-total">₪{product.price * quantity}</span>
                          <button
                            onClick={() => removeFromCart(productId)}
                            className="remove-button"
                          >
                            הסר
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </>
              ) : (
                <p className="empty-cart">העגלה ריקה</p>
              )}
            </div>

            {cart.length > 0 && (
              <div className="cart-footer">
                <div className="cart-summary">
                  <div className="summary-row">
                    <span>סכום ביניים:</span>
                    <span>₪{getTotalPrice().subtotal}</span>
                  </div>
                  <div className="summary-row">
                    <span>משלוח:</span>
                    <span>₪{getTotalPrice().shipping}</span>
                  </div>
                  {getTotalPrice().shipping === 0 && (
                    <div className="free-shipping-message">
                      <Package className="icon" />
                      <span>משלוח חינם!</span>
                    </div>
                  )}
                  <div className="summary-row total">
                    <span>סה״כ:</span>
                    <span>₪{getTotalPrice().total}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                  }}
                  className="checkout-button"
                >
                  המשך לתשלום
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="main-content">
        <div className="hero-section">
          <h2>הדפסות תלת מימד באיכות מעולה</h2>
          <p>מוצרים ייחודיים מותאמים אישית, מיוצרים בישראל</p>
          <div className="shipping-banner">
            <Truck className="icon"/>
            <p>
              משלוח: ₪25 | חינם בהזמנה מעל ₪150
            </p>
          </div>
        </div>

        <div className="products-grid">
          {products.map((product) => {
            const availableStock = getAvailableStock(product.id);
            const cartQuantity = getCartItemCount(product.id);

            return (
              <div key={product.id} className="product-card">
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <div className="product-info">
                  <h3>{product.name}</h3>
                  <p className="product-description">{product.description}</p>
                  <StockIndicator stock={availableStock} />
                  {cartQuantity > 0 && (
                    <div className="cart-quantity">
                      {cartQuantity} בעגלת הקניות
                    </div>
                  )}
                  <div className="product-footer">
                    <span className="price">₪{product.price}</span>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={availableStock === 0}
                      className={`add-to-cart ${availableStock === 0 ? 'disabled' : ''}`}
                    >
                      {availableStock === 0 ? 'אזל המלאי' : 'הוסף לעגלה'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
                {isCheckoutOpen && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>פרטי משלוח</h3>
                <button onClick={() => setIsCheckoutOpen(false)} className="close-button">
                  <X size={20} />
                </button>
              </div>

              <form className="shipping-form" onSubmit={(e) => {
                e.preventDefault();
                handleCheckout();
              }}>
                <div className="form-group">
                  <label htmlFor="fullName">שם מלא:</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={shippingDetails.fullName}
                    onChange={handleShippingDetailsChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email">אימייל:</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={shippingDetails.email}
                    onChange={handleShippingDetailsChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phone">טלפון:</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={shippingDetails.phone}
                    onChange={handleShippingDetailsChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="address">כתובת:</label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={shippingDetails.address}
                    onChange={handleShippingDetailsChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="city">עיר:</label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={shippingDetails.city}
                      onChange={handleShippingDetailsChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="zipCode">מיקוד:</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={shippingDetails.zipCode}
                      onChange={handleShippingDetailsChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="notes">הערות למשלוח:</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={shippingDetails.notes}
                    onChange={handleShippingDetailsChange}
                  />
                </div>

                <div className="order-summary">
                  <h4>סיכום הזמנה</h4>
                  <div className="summary-row">
                    <span>סכום ביניים:</span>
                    <span>₪{getTotalPrice().subtotal}</span>
                  </div>
                  <div className="summary-row">
                    <span>משלוח:</span>
                    <span>₪{getTotalPrice().shipping}</span>
                  </div>
                  <div className="summary-row total">
                    <span>סה״כ לתשלום:</span>
                    <span>₪{getTotalPrice().total}</span>
                  </div>
                </div>

                <button type="submit" className="checkout-button">
                  המשך לתשלום
                </button>
              </form>
            </div>
          </div>
        )}
      </main>

      <footer className="main-footer">
        <p>© {new Date().getFullYear()} Madpis3D. כל הזכויות שמורות.</p>
        <p>יצירת קשר: madpis3d@gmail.com</p>
      </footer>
    </div>
  );
};

export default App;
