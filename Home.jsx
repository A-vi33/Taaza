import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { db } from '../../firebase';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';

function Home(props) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cart, setCart] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [weightInput, setWeightInput] = useState({});
  const [showWeightInput, setShowWeightInput] = useState(null);

  useEffect(() => {
    if (!user || user.type !== 'customer') {
      navigate('/login');
    }
  }, [user, navigate]);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(collection(db, 'products'), (querySnapshot) => {
      const productsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setProducts(productsData);
      setError(null);
      setLoading(false);
    }, (err) => {
      setError('Failed to load products.');
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading products...</div>;
  if (error) return <div className="p-8 text-center text-red-600">{error}</div>;

  // Group items by category from Firestore products
  const groupedItems = {
    chicken: products.filter(item => item.category === 'chicken'),
    fish: products.filter(item => item.category === 'fish'),
    mutton: products.filter(item => item.category === 'mutton'),
    goat: products.filter(item => item.category === 'goat'),
    duck: products.filter(item => item.category === 'duck'),
    quail: products.filter(item => item.category === 'quail')
  };

  // Get filtered items based on active filter
  const getFilteredItems = () => {
    if (activeFilter === 'all') {
      return products;
    }
    return groupedItems[activeFilter] || [];
  };

  const handleFilterClick = (filter) => {
    setActiveFilter(filter);
  };

  // Calculate price based on weight (in grams)
  const calculatePrice = (item, weight) => {
    // Always use item.price as per-kg price
    return Math.round((item.price * (weight / 1000)));
  };

  // Handle Add to Cart click: show weight input for this product
  const handleAddToCartClick = (item) => {
    setShowWeightInput(item.id);
    setWeightInput((prev) => ({ ...prev, [item.id]: 500 })); // default 500g
  };

  // Handle weight change
  const handleWeightChange = (itemId, value) => {
    let val = parseInt(value, 10);
    if (isNaN(val) || val < 50) val = 50;
    if (val > 20000) val = 20000;
    setWeightInput((prev) => ({ ...prev, [itemId]: val }));
  };

  // Confirm add to cart with selected weight
  const handleConfirmAddToCart = (item) => {
    const weight = weightInput[item.id] || 500;
    const price = calculatePrice(item, weight);
    const cartItem = {
      ...item,
      weight,
      price,
      quantity: 1
    };
    // Check if same item+weight exists
    const existingItem = cart.find(
      (cartItem) => cartItem.id === item.id && cartItem.weight === weight
    );
    let updatedCart;
    if (existingItem) {
      updatedCart = cart.map((cartItem) =>
        cartItem.id === item.id && cartItem.weight === weight
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      );
    } else {
      updatedCart = [...cart, cartItem];
    }
    setCart(updatedCart);
    localStorage.setItem('taazaCart', JSON.stringify(updatedCart));
    setSuccessMessage(`${item.name} (${weight}g) added to cart successfully!`);
    setShowSuccess(true);
    setShowWeightInput(null);
    setTimeout(() => {
      setShowSuccess(false);
    }, 2000);
  };

  const containerStyle = {
    padding: '2rem',
    backgroundColor: '#f8f9fa',
    minHeight: '100vh',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '2rem'
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '0.5rem'
  };

  const subtitleStyle = {
    fontSize: '1.1rem',
    color: '#666',
    marginBottom: '2rem'
  };

  const categoryStyle = {
    marginBottom: '3rem'
  };

  const categoryTitleStyle = {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: '1rem',
    borderBottom: '2px solid #e74c3c',
    paddingBottom: '0.5rem'
  };

  const itemsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    marginBottom: '2rem'
  };

  const itemCardStyle = {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '1.2rem',
    boxShadow: '0 4px 16px rgba(231,76,60,0.08)',
    transition: 'transform 0.25s cubic-bezier(.4,2,.6,1), box-shadow 0.25s cubic-bezier(.4,2,.6,1)',
    border: '1px solid #f8b500',
    position: 'relative',
    fontFamily: 'Montserrat, sans-serif',
    cursor: 'pointer',
    overflow: 'hidden',
  };

  const itemImageStyle = {
    fontSize: '2.5rem',
    textAlign: 'center',
    marginBottom: '0.75rem'
  };

  const itemNameStyle = {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: '0.4rem'
  };

  const itemDescriptionStyle = {
    color: '#666',
    fontSize: '0.8rem',
    marginBottom: '0.75rem',
    lineHeight: '1.3'
  };

  const itemPriceStyle = {
    fontSize: '1.1rem',
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: '0.75rem'
  };

  const addToCartButtonStyle = {
    background: 'linear-gradient(90deg, #e74c3c 0%, #f8b500 100%)',
    color: 'white',
    border: 'none',
    padding: '0.7rem 1.2rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: 700,
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(231,76,60,0.12)',
    transition: 'transform 0.15s, box-shadow 0.15s, background 0.3s',
    outline: 'none',
  };

  const successMessageStyle = {
    position: 'fixed',
    top: '20px',
    right: showSuccess ? '20px' : '-400px',
    background: 'linear-gradient(90deg, #27ae60 0%, #f8b500 100%)',
    color: 'white',
    padding: '1rem 1.5rem',
    borderRadius: '8px',
    boxShadow: '0 4px 16px rgba(39,174,96,0.12)',
    zIndex: 1000,
    fontFamily: 'Montserrat, sans-serif',
    fontWeight: 700,
    fontSize: '1.1rem',
    transition: 'right 0.5s cubic-bezier(.4,2,.6,1)',
  };

  const filterContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '0.5rem',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  };

  const filterTileStyle = {
    padding: '0.5rem 1rem',
    borderRadius: '25px',
    border: '2px solid #e74c3c',
    backgroundColor: 'white',
    color: '#e74c3c',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'all 0.3s ease',
    minWidth: '80px',
    textAlign: 'center'
  };

  const activeFilterTileStyle = {
    ...filterTileStyle,
    backgroundColor: '#e74c3c',
    color: 'white'
  };

  return (
    <div style={containerStyle}>
      <style>
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;700&display=swap');
      </style>
      <div style={{
        width: '100%',
        minHeight: '220px',
        background: 'linear-gradient(90deg, #e74c3c 0%, #f8b500 100%)',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        borderRadius: '0 0 24px 24px',
        marginBottom: '2rem',
        boxShadow: '0 4px 16px rgba(0,0,0,0.08)'
      }}>
        <h1 style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '2.8rem', fontWeight: 700, margin: 0 }}>Welcome to Taaza!</h1>
        <p style={{ fontFamily: 'Montserrat, sans-serif', fontSize: '1.2rem', marginTop: 8, marginBottom: 0 }}>Fresh Meat & Fish Delivered to Your Doorstep</p>
      </div>
      {/* Success Message */}
      {showSuccess && (
        <div style={successMessageStyle}>
          ✅ {successMessage}
        </div>
      )}

      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Taaza Non-Veg Market</h1>
        <p style={subtitleStyle}>Fresh & Premium Quality Meat Products</p>
      </div>

      {/* Filter Container */}
      <div style={filterContainerStyle}>
        <button 
          style={activeFilter === 'all' ? activeFilterTileStyle : filterTileStyle} 
          onClick={() => handleFilterClick('all')}
          onMouseEnter={(e) => {
            if (activeFilter !== 'all') {
              e.target.style.backgroundColor = '#fdf2f2';
            }
          }}
          onMouseLeave={(e) => {
            if (activeFilter !== 'all') {
              e.target.style.backgroundColor = 'white';
            }
          }}
        >
          All
        </button>
        <button 
          style={activeFilter === 'chicken' ? activeFilterTileStyle : filterTileStyle} 
          onClick={() => handleFilterClick('chicken')}
          onMouseEnter={(e) => {
            if (activeFilter !== 'chicken') {
              e.target.style.backgroundColor = '#fdf2f2';
            }
          }}
          onMouseLeave={(e) => {
            if (activeFilter !== 'chicken') {
              e.target.style.backgroundColor = 'white';
            }
          }}
        >
          🍗 Chicken
        </button>
        <button 
          style={activeFilter === 'fish' ? activeFilterTileStyle : filterTileStyle} 
          onClick={() => handleFilterClick('fish')}
          onMouseEnter={(e) => {
            if (activeFilter !== 'fish') {
              e.target.style.backgroundColor = '#fdf2f2';
            }
          }}
          onMouseLeave={(e) => {
            if (activeFilter !== 'fish') {
              e.target.style.backgroundColor = 'white';
            }
          }}
        >
          🐟 Fish
        </button>
        <button 
          style={activeFilter === 'mutton' ? activeFilterTileStyle : filterTileStyle} 
          onClick={() => handleFilterClick('mutton')}
          onMouseEnter={(e) => {
            if (activeFilter !== 'mutton') {
              e.target.style.backgroundColor = '#fdf2f2';
            }
          }}
          onMouseLeave={(e) => {
            if (activeFilter !== 'mutton') {
              e.target.style.backgroundColor = 'white';
            }
          }}
        >
          🐑 Mutton
        </button>
        <button 
          style={activeFilter === 'goat' ? activeFilterTileStyle : filterTileStyle} 
          onClick={() => handleFilterClick('goat')}
          onMouseEnter={(e) => {
            if (activeFilter !== 'goat') {
              e.target.style.backgroundColor = '#fdf2f2';
            }
          }}
          onMouseLeave={(e) => {
            if (activeFilter !== 'goat') {
              e.target.style.backgroundColor = 'white';
            }
          }}
        >
          🐐 Goat
        </button>
        <button 
          style={activeFilter === 'duck' ? activeFilterTileStyle : filterTileStyle} 
          onClick={() => handleFilterClick('duck')}
          onMouseEnter={(e) => {
            if (activeFilter !== 'duck') {
              e.target.style.backgroundColor = '#fdf2f2';
            }
          }}
          onMouseLeave={(e) => {
            if (activeFilter !== 'duck') {
              e.target.style.backgroundColor = 'white';
            }
          }}
        >
          🦆 Duck
        </button>
        <button 
          style={activeFilter === 'quail' ? activeFilterTileStyle : filterTileStyle} 
          onClick={() => handleFilterClick('quail')}
          onMouseEnter={(e) => {
            if (activeFilter !== 'quail') {
              e.target.style.backgroundColor = '#fdf2f2';
            }
          }}
          onMouseLeave={(e) => {
            if (activeFilter !== 'quail') {
              e.target.style.backgroundColor = 'white';
            }
          }}
        >
          🦅 Quail
        </button>
      </div>

      {/* Display filtered items */}
      {activeFilter === 'all' && (
        <>
          {/* Chicken Section */}
          {groupedItems.chicken.length > 0 && (
            <div style={categoryStyle}>
              <h2 style={categoryTitleStyle}>🍗 Chicken Products</h2>
              <div style={itemsGridStyle}>
                {groupedItems.chicken.map(item => (
                  <div key={item.id} style={itemCardStyle} onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-5px)';
                    e.target.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.15)';
                  }} onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 3px 5px rgba(0, 0, 0, 0.1)';
                  }}>
                    <div style={itemImageStyle}>
                      {typeof item.imageUrl === 'string' && item.imageUrl.startsWith('data') === false && item.imageUrl.length < 10
                        ? item.imageUrl
                        : <img src={item.imageUrl} alt={item.name} style={{ width: '400px', height: '120px', objectFit: 'cover', borderRadius: '8px', background: '#f8f8f8' }} />
                      }
                    </div>
                    <h3 style={itemNameStyle}>{item.name}</h3>
                    <p style={itemDescriptionStyle}>{item.description}</p>
                    <div style={itemPriceStyle}>₹{item.price}/kg</div>
                    <button 
                      style={addToCartButtonStyle}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
                      onClick={() => handleAddToCartClick(item)}
                    >
                      Add to Cart
                    </button>
                    {showWeightInput === item.id && (
                      <div style={{ marginTop: 8 }}>
                        <input type="number" min={50} max={20000} step={50} value={weightInput[item.id] || 500} onChange={e => handleWeightChange(item.id, e.target.value)} style={{ width: 80, marginRight: 8 }} />
                        g
                        <span style={{ marginLeft: 12, fontWeight: 500 }}>
                          Price: ₹{calculatePrice(item, weightInput[item.id] || 500)}
                        </span>
                        <button style={{ marginLeft: 12, background: '#e74c3c', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', cursor: 'pointer' }} onClick={() => handleConfirmAddToCart(item)}>Confirm</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fish Section */}
          {groupedItems.fish.length > 0 && (
            <div style={categoryStyle}>
              <h2 style={categoryTitleStyle}>🐟 Fish Products</h2>
              <div style={itemsGridStyle}>
                {groupedItems.fish.map(item => (
                  <div key={item.id} style={itemCardStyle} onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-5px)';
                    e.target.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.15)';
                  }} onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 3px 5px rgba(0, 0, 0, 0.1)';
                  }}>
                    <div style={itemImageStyle}>
                      {typeof item.imageUrl === 'string' && item.imageUrl.startsWith('data') === false && item.imageUrl.length < 10
                        ? item.imageUrl
                        : <img src={item.imageUrl} alt={item.name} style={{ width: '400px', height: '120px', objectFit: 'cover', borderRadius: '8px', background: '#f8f8f8' }} />
                      }
                    </div>
                    <h3 style={itemNameStyle}>{item.name}</h3>
                    <p style={itemDescriptionStyle}>{item.description}</p>
                    <div style={itemPriceStyle}>₹{item.price}/kg</div>
                    <button 
                      style={addToCartButtonStyle}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
                      onClick={() => handleAddToCartClick(item)}
                    >
                      Add to Cart
                    </button>
                    {showWeightInput === item.id && (
                      <div style={{ marginTop: 8 }}>
                        <input type="number" min={50} max={20000} step={50} value={weightInput[item.id] || 500} onChange={e => handleWeightChange(item.id, e.target.value)} style={{ width: 80, marginRight: 8 }} />
                        g
                        <span style={{ marginLeft: 12, fontWeight: 500 }}>
                          Price: ₹{calculatePrice(item, weightInput[item.id] || 500)}
                        </span>
                        <button style={{ marginLeft: 12, background: '#e74c3c', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', cursor: 'pointer' }} onClick={() => handleConfirmAddToCart(item)}>Confirm</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Mutton Section */}
          {groupedItems.mutton.length > 0 && (
            <div style={categoryStyle}>
              <h2 style={categoryTitleStyle}>🐑 Mutton Products</h2>
              <div style={itemsGridStyle}>
                {groupedItems.mutton.map(item => (
                  <div key={item.id} style={itemCardStyle} onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-5px)';
                    e.target.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.15)';
                  }} onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 3px 5px rgba(0, 0, 0, 0.1)';
                  }}>
                    <div style={itemImageStyle}>
                      {typeof item.imageUrl === 'string' && item.imageUrl.startsWith('data') === false && item.imageUrl.length < 10
                        ? item.imageUrl
                        : <img src={item.imageUrl} alt={item.name} style={{ width: '400px', height: '120px', objectFit: 'cover', borderRadius: '8px', background: '#f8f8f8' }} />
                      }
                    </div>
                    <h3 style={itemNameStyle}>{item.name}</h3>
                    <p style={itemDescriptionStyle}>{item.description}</p>
                    <div style={itemPriceStyle}>₹{item.price}/kg</div>
                    <button 
                      style={addToCartButtonStyle}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
                      onClick={() => handleAddToCartClick(item)}
                    >
                      Add to Cart
                    </button>
                    {showWeightInput === item.id && (
                      <div style={{ marginTop: 8 }}>
                        <input type="number" min={50} max={20000} step={50} value={weightInput[item.id] || 500} onChange={e => handleWeightChange(item.id, e.target.value)} style={{ width: 80, marginRight: 8 }} />
                        g
                        <span style={{ marginLeft: 12, fontWeight: 500 }}>
                          Price: ₹{calculatePrice(item, weightInput[item.id] || 500)}
                        </span>
                        <button style={{ marginLeft: 12, background: '#e74c3c', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', cursor: 'pointer' }} onClick={() => handleConfirmAddToCart(item)}>Confirm</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Goat Section */}
          {groupedItems.goat.length > 0 && (
            <div style={categoryStyle}>
              <h2 style={categoryTitleStyle}>🐐 Goat Products</h2>
              <div style={itemsGridStyle}>
                {groupedItems.goat.map(item => (
                  <div key={item.id} style={itemCardStyle} onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-5px)';
                    e.target.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.15)';
                  }} onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 3px 5px rgba(0, 0, 0, 0.1)';
                  }}>
                    <div style={itemImageStyle}>
                      {typeof item.imageUrl === 'string' && item.imageUrl.startsWith('data') === false && item.imageUrl.length < 10
                        ? item.imageUrl
                        : <img src={item.imageUrl} alt={item.name} style={{ width: '400px', height: '120px', objectFit: 'cover', borderRadius: '8px', background: '#f8f8f8' }} />
                      }
                    </div>
                    <h3 style={itemNameStyle}>{item.name}</h3>
                    <p style={itemDescriptionStyle}>{item.description}</p>
                    <div style={itemPriceStyle}>₹{item.price}/kg</div>
                    <button 
                      style={addToCartButtonStyle}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
                      onClick={() => handleAddToCartClick(item)}
                    >
                      Add to Cart
                    </button>
                    {showWeightInput === item.id && (
                      <div style={{ marginTop: 8 }}>
                        <input type="number" min={50} max={20000} step={50} value={weightInput[item.id] || 500} onChange={e => handleWeightChange(item.id, e.target.value)} style={{ width: 80, marginRight: 8 }} />
                        g
                        <span style={{ marginLeft: 12, fontWeight: 500 }}>
                          Price: ₹{calculatePrice(item, weightInput[item.id] || 500)}
                        </span>
                        <button style={{ marginLeft: 12, background: '#e74c3c', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', cursor: 'pointer' }} onClick={() => handleConfirmAddToCart(item)}>Confirm</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Duck Section */}
          {groupedItems.duck.length > 0 && (
            <div style={categoryStyle}>
              <h2 style={categoryTitleStyle}>🦆 Duck Products</h2>
              <div style={itemsGridStyle}>
                {groupedItems.duck.map(item => (
                  <div key={item.id} style={itemCardStyle} onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-5px)';
                    e.target.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.15)';
                  }} onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 3px 5px rgba(0, 0, 0, 0.1)';
                  }}>
                    <div style={itemImageStyle}>
                      {typeof item.imageUrl === 'string' && item.imageUrl.startsWith('data') === false && item.imageUrl.length < 10
                        ? item.imageUrl
                        : <img src={item.imageUrl} alt={item.name} style={{ width: '400px', height: '120px', objectFit: 'cover', borderRadius: '8px', background: '#f8f8f8' }} />
                      }
                    </div>
                    <h3 style={itemNameStyle}>{item.name}</h3>
                    <p style={itemDescriptionStyle}>{item.description}</p>
                    <div style={itemPriceStyle}>₹{item.price}/kg</div>
                    <button 
                      style={addToCartButtonStyle}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
                      onClick={() => handleAddToCartClick(item)}
                    >
                      Add to Cart
                    </button>
                    {showWeightInput === item.id && (
                      <div style={{ marginTop: 8 }}>
                        <input type="number" min={50} max={20000} step={50} value={weightInput[item.id] || 500} onChange={e => handleWeightChange(item.id, e.target.value)} style={{ width: 80, marginRight: 8 }} />
                        g
                        <span style={{ marginLeft: 12, fontWeight: 500 }}>
                          Price: ₹{calculatePrice(item, weightInput[item.id] || 500)}
                        </span>
                        <button style={{ marginLeft: 12, background: '#e74c3c', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', cursor: 'pointer' }} onClick={() => handleConfirmAddToCart(item)}>Confirm</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quail Section */}
          {groupedItems.quail.length > 0 && (
            <div style={categoryStyle}>
              <h2 style={categoryTitleStyle}>🦅 Quail Products</h2>
              <div style={itemsGridStyle}>
                {groupedItems.quail.map(item => (
                  <div key={item.id} style={itemCardStyle} onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-5px)';
                    e.target.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.15)';
                  }} onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 3px 5px rgba(0, 0, 0, 0.1)';
                  }}>
                    <div style={itemImageStyle}>
                      {typeof item.imageUrl === 'string' && item.imageUrl.startsWith('data') === false && item.imageUrl.length < 10
                        ? item.imageUrl
                        : <img src={item.imageUrl} alt={item.name} style={{ width: '400px', height: '120px', objectFit: 'cover', borderRadius: '8px', background: '#f8f8f8' }} />
                      }
                    </div>
                    <h3 style={itemNameStyle}>{item.name}</h3>
                    <p style={itemDescriptionStyle}>{item.description}</p>
                    <div style={itemPriceStyle}>₹{item.price}/kg</div>
                    <button 
                      style={addToCartButtonStyle}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
                      onClick={() => handleAddToCartClick(item)}
                    >
                      Add to Cart
                    </button>
                    {showWeightInput === item.id && (
                      <div style={{ marginTop: 8 }}>
                        <input type="number" min={50} max={20000} step={50} value={weightInput[item.id] || 500} onChange={e => handleWeightChange(item.id, e.target.value)} style={{ width: 80, marginRight: 8 }} />
                        g
                        <span style={{ marginLeft: 12, fontWeight: 500 }}>
                          Price: ₹{calculatePrice(item, weightInput[item.id] || 500)}
                        </span>
                        <button style={{ marginLeft: 12, background: '#e74c3c', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', cursor: 'pointer' }} onClick={() => handleConfirmAddToCart(item)}>Confirm</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Display single category when filtered */}
      {activeFilter !== 'all' && groupedItems[activeFilter] && groupedItems[activeFilter].length > 0 && (
        <div style={categoryStyle}>
          <h2 style={categoryTitleStyle}>
            {activeFilter === 'chicken' && '🍗 Chicken Products'}
            {activeFilter === 'fish' && '🐟 Fish Products'}
            {activeFilter === 'mutton' && '🐑 Mutton Products'}
            {activeFilter === 'goat' && '🐐 Goat Products'}
            {activeFilter === 'duck' && '🦆 Duck Products'}
            {activeFilter === 'quail' && '🦅 Quail Products'}
          </h2>
          <div style={itemsGridStyle}>
            {groupedItems[activeFilter].map(item => (
              <div key={item.id} style={itemCardStyle} onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-5px)';
                e.target.style.boxShadow = '0 8px 15px rgba(0, 0, 0, 0.15)';
              }} onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 3px 5px rgba(0, 0, 0, 0.1)';
              }}>
                <div style={itemImageStyle}>
                  {typeof item.imageUrl === 'string' && item.imageUrl.startsWith('data') === false && item.imageUrl.length < 10
                    ? item.imageUrl
                    : <img src={item.imageUrl} alt={item.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px', background: '#f8f8f8' }} />
                  }
                </div>
                <h3 style={itemNameStyle}>{item.name}</h3>
                <p style={itemDescriptionStyle}>{item.description}</p>
                <div style={itemPriceStyle}>₹{item.price}/kg</div>
                <button 
                  style={addToCartButtonStyle}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#c0392b'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#e74c3c'}
                  onClick={() => handleAddToCartClick(item)}
                >
                  Add to Cart
                </button>
                {showWeightInput === item.id && (
                  <div style={{ marginTop: 8 }}>
                    <input type="number" min={50} max={20000} step={50} value={weightInput[item.id] || 500} onChange={e => handleWeightChange(item.id, e.target.value)} style={{ width: 80, marginRight: 8 }} />
                    g
                    <span style={{ marginLeft: 12, fontWeight: 500 }}>
                      Price: ₹{calculatePrice(item, weightInput[item.id] || 500)}
                    </span>
                    <button style={{ marginLeft: 12, background: '#e74c3c', color: 'white', border: 'none', borderRadius: 6, padding: '0.3rem 0.8rem', cursor: 'pointer' }} onClick={() => handleConfirmAddToCart(item)}>Confirm</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;