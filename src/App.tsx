import React from 'react';
import './App.css';

const products = [
  {
    id: 1,
    name: 'אגרטל גדול',
    price: 120,
    image: '/images/large_vase.png',
  },
  {
    id: 2,
    name: 'אגרטל קטן',
    price: 80,
    image: '/images/small-vase.jpg',
  },
  {
    id: 3,
    name: 'מעמד לשעון אפל',
    price: 50,
    image: '/images/apple-watch-stand.jpg',
  },
  {
    id: 4,
    name: 'מסדר כבלים',
    price: 30,
    image: '/images/cable-organizer.jpg',
  },
];

const App: React.FC = () => {
  return (
    <div className="container">
      <header className="header">
        <h1>Madpis3D - המדפיס תלת מימד</h1>
      </header>

      <main>
        <div className="products">
          {products.map((product) => (
            <div key={product.id} className="product-card">
              <img src={product.image} alt={product.name} className="product-image" />
              <h2 className="product-name">{product.name}</h2>
              <p className="product-price">₪{product.price}</p>
              <a
                href={`https://www.paypal.com/cgi-bin/webscr?cmd=_xclick&business=madpis3d@gmail.com&item_name=${product.name}&amount=${product.price}&currency_code=ILS`}
                target="_blank"
                rel="noopener noreferrer"
                className="buy-button"
              >
                קנה עכשיו
              </a>
            </div>
          ))}
        </div>
      </main>

      <footer className="footer">
        <p>© 2025 Madpis3D. כל הזכויות שמורות.</p>
      </footer>
    </div>
  );
};

export default App;
