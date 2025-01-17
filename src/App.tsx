import React, { useState } from 'react';
import { ShoppingCart, Menu, X, AlertCircle } from 'lucide-react';

const products = [
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
    image: '/images/small-vase.jpg',
    stock: 3
  },
  {
    id: 3,
    name: 'מעמד לשעון אפל',
    nameEn: 'Apple Watch Stand',
    price: 50,
    description: 'מעמד מינימליסטי ואלגנטי לשעון החכם שלך',
    image: '/images/apple-watch-stand.jpg',
    stock: 8
  },
  {
    id: 4,
    name: 'מסדר כבלים',
    nameEn: 'Cable Organizer',
    price: 30,
    description: 'פתרון חכם לניהול כבלים בשולחן העבודה',
    image: '/images/cable-organizer.jpg',
    stock: 2
  },
];

const App = () => {
  const [cart, setCart] = useState([]);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const getAvailableStock = (productId) => {
    const product = products.find(p => p.id === productId);
    const inCart = cart.filter(item => item.id === productId).length;
    return product.stock - inCart;
  };

  const addToCart = (product) => {
    const availableStock = getAvailableStock(product.id);
    if (availableStock > 0) {
      setCart([...cart, product]);
    }
  };

  const removeFromCart = (productId) => {
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

  const getCartItemCount = (productId) => {
    return cart.filter(item => item.id === productId).length;
  };

  const handleCheckout = () => {
    const paypalUrl = `https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=madpis3d@gmail.com&amount=${getTotalPrice()}&currency_code=ILS`;
    window.open(paypalUrl, '_blank');
  };

  const StockIndicator = ({ stock }) => {
    if (stock === 0) {
      return (
        <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded-md flex items-center text-red-700 text-sm">
          <AlertCircle className="h-4 w-4 ml-2" />
          <span>אזל המלאי</span>
        </div>
      );
    } else if (stock <= 3) {
      return (
        <div className="mt-2 p-2 bg-orange-50 border border-orange-200 rounded-md flex items-center text-orange-700 text-sm">
          <AlertCircle className="h-4 w-4 ml-2" />
          <span>נשארו {stock} יחידות במלאי</span>
        </div>
      );
    }
    return null;
  };

  return (
    <div dir="rtl" className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm fixed w-full top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <button
                className="md:hidden p-2 rounded-md hover:bg-gray-100"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Madpis3D</h1>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="p-2 rounded-md hover:bg-gray-100 relative"
            >
              <ShoppingCart className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white rounded-full w-4 h-4 text-xs flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {isCartOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed inset-y-0 left-0 w-full sm:w-96 bg-white shadow-xl">
            <div className="p-4 h-full flex flex-col">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-bold">העגלה שלי</h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 rounded-md hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto">
                {cart.length > 0 ? (
                  <>
                    {Array.from(new Set(cart.map(item => item.id))).map((productId) => {
                      const product = products.find(p => p.id === productId);
                      const quantity = getCartItemCount(productId);
                      return (
                        <div key={productId} className="flex justify-between items-center py-3 border-b">
                          <div>
                            <span className="font-medium">{product.name}</span>
                            <div className="text-sm text-gray-500">
                              {quantity} × ₪{product.price}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm">₪{product.price * quantity}</span>
                            <button
                              onClick={() => removeFromCart(productId)}
                              className="px-2 py-1 bg-red-500 text-white rounded-md hover:bg-red-600 text-sm"
                            >
                              הסר
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <p className="text-center text-gray-500 mt-4">העגלה ריקה</p>
                )}
              </div>

              {cart.length > 0 && (
                <div className="mt-auto pt-4 border-t">
                  <div className="text-lg font-bold mb-3">
                    סה״כ: ₪{getTotalPrice()}
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 text-sm font-medium"
                  >
                    לתשלום
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            הדפסות תלת מימד באיכות מעולה
          </h2>
          <p className="text-lg text-gray-600">
            מוצרים ייחודיים מותאמים אישית, מיוצרים בישראל
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {products.map((product) => {
            const availableStock = getAvailableStock(product.id);
            const cartQuantity = getCartItemCount(product.id);

            return (
              <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200">
                <div className="aspect-w-1 aspect-h-1 w-full">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <StockIndicator stock={availableStock} />
                  {cartQuantity > 0 && (
                    <div className="mt-2 text-sm text-blue-600">
                      {cartQuantity} בעגלת הקניות
                    </div>
                  )}
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-lg font-bold">₪{product.price}</span>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={availableStock === 0}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        availableStock === 0
                          ? 'bg-gray-300 cursor-not-allowed'
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
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

      <footer className="bg-white border-t mt-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-600 text-sm">
            <p className="mb-2">Madpis3D © {new Date().getFullYear()}</p>
            <p>יצירת קשר: info@madpis3d.co.il</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
