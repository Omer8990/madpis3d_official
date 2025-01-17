import React, { useState } from 'react';
import { ShoppingCart, Menu, X, AlertCircle } from 'lucide-react';
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
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const getCartItemCount = (productId: number) => {
    return cart.filter(item => item.id === productId).length;
  };

  const handleCheckout = () => {
    const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=madpis3d@gmail.com&amount=${getTotalPrice()}&currency_code=ILS`;
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
            <div className="cart-header">
              <h2>העגלה שלי</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="close-button"
              >
                <X size={20} />
              </button>
            </div>

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
                <div className="total-price">
                  סה״כ: ₪{getTotalPrice()}
                </div>
                <button
                  onClick={handleCheckout}
                  className="checkout-button"
                >
                  לתשלום
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
      </main>

      <footer className="main-footer">
        <p>© {new Date().getFullYear()} Madpis3D. כל הזכויות שמורות.</p>
        <p>יצירת קשר: madpis3d@gmail.com</p>
      </footer>
    </div>
  );
};

export default App;
