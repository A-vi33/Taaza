import React, { useState, useEffect } from 'react';
// --- ADDED FiX and FiTrash2 icons for the cart sidebar ---
import { FiSearch, FiShoppingCart, FiUser, FiPlus, FiMinus, FiX, FiTrash2 } from 'react-icons/fi';
import clsx from 'clsx';
 
// --- ASSET IMPORTS (No changes here) ---
import breast from '../../assets/breast.png';
import chickenThighs from '../../assets/chickenThighs.png';
import wholeChicken from '../../assets/wholeChicken.png';
import chickenWings from '../../assets/chickenWings.png';
import chickenDrumsticks from '../../assets/chickenDrumsticks.png';
import chickenMince from '../../assets/chickenMince.png';
import chickenLiver from '../../assets/chickenLiver.png';
import freshFishRohu from '../../assets/freshFishRohu.png';
import pomfretFish from '../../assets/pomfretFish.png';
import salmonFillet from '../../assets/salmonFillet.png';
import tunaSteak from '../../assets/tunaSteak.png';
import catlaFish from '../../assets/catlaFish.png';
import mackerelFish from '../../assets/mackerelFish.png';
import muttonCurryCut from '../../assets/muttonCurryCut.png';
import muttonChops from '../../assets/muttonChops.png';
import muttonBiryaniCut from '../../assets/muttonBiryaniCut.png';
import muttonKeema from '../../assets/muttonKeema.png';
import muttonRibs from '../../assets/muttonRibs.png';
import goatMeat from '../../assets/goatMeat.png';
import goatCurryCut from '../../assets/goatCurryCut.png';
import duckMeat from '../../assets/duckMeat.png';
import quailMeat from '../../assets/quailMeat.png';
import heroBanner from '../../assets/bg.jpg';
 
// --- DATA (No changes here, but I've included your additions) ---
const nonVegItems = [
    { id: 1, name: 'Fresh Chicken Breast', price: 180, image: breast, category: 'chicken', description: 'Tender, boneless fillets perfect for grilling.' },
    { id: 2, name: 'Chicken Thighs', price: 160, image: chickenThighs, category: 'chicken', description: 'Juicy and flavorful bone-in thighs.' },
    { id: 3, name: 'Whole Chicken', price: 350, image: wholeChicken, category: 'chicken', description: 'Skin-on whole bird, ideal for roasting.' },
    { id: 4, name: 'Chicken Wings', price: 140, image: chickenWings, category: 'chicken', description: 'Perfect for spicy appetizers and snacks.' },
    {id: 5,name: 'Chicken Drumsticks',price: 150,image: chickenDrumsticks,category: 'chicken',description: 'Tender drumsticks, ideal for roasting'},
    {id: 6,name: 'Chicken Mince',price: 170,image: chickenMince,category: 'chicken',description: 'Fresh minced chicken for kebabs and patties'},
    {id: 7,name: 'Chicken Liver',price: 120,image: chickenLiver,category: 'chicken',description: 'Nutritious chicken liver, rich in iron'},
    { id: 8, name: 'Rohu Fish', price: 220, image: freshFishRohu, category: 'fish', description: 'Freshwater fish, curry cut with head.' },
    { id: 9, name: 'Pomfret Fish', price: 280, image: pomfretFish, category: 'fish', description: 'Premium whole cleaned sea fish.' },
    { id: 10, name: 'Salmon Fillet', price: 450, image: salmonFillet, category: 'fish', description: 'Rich in Omega-3, skinless fillet.' },
    {id: 11,name: 'Tuna Steak',price: 380,image: tunaSteak,category: 'fish',description: 'Fresh tuna steak, perfect for grilling'},
    {id: 12,name: 'Catla Fish', price: 200,image: catlaFish,category: 'fish',description: 'Fresh water fish, great for curries'},
    { id: 13,name: 'Mackerel Fish',price: 180,image: mackerelFish, category: 'fish',description: 'Oily fish rich in omega-3 fatty acids' },
    { id: 14, name: 'Mutton Curry Cut', price: 380, image: muttonCurryCut, category: 'mutton', description: 'Bone-in pieces for rich, hearty curries.' },
    { id: 15, name: 'Mutton Chops', price: 420, image: muttonChops, category: 'mutton', description: 'Loin chops perfect for pan-searing.' },
    {id: 16,name: 'Mutton Biryani Cut', price: 360,image: muttonBiryaniCut, category: 'mutton', description: 'Special cut for biryani preparation'},
    { id: 17, name: 'Mutton Keema', price: 340, image: muttonKeema, category: 'mutton',description: 'Minced mutton for kebabs and curries'},
    { id: 18,name: 'Mutton Ribs',price: 400,image: muttonRibs,category: 'mutton',description: 'Tender mutton ribs, great for slow cooking'},
    { id: 19, name: 'Goat Meat', price: 350, image: goatMeat, category: 'goat', description: 'Fresh goat meat, lean and healthy'},
    { id: 20, name: 'Goat Curry Cut', price: 330, image: goatCurryCut, category: 'goat', description: 'Tender goat meat for traditional dishes.' },
    { id: 21, name: 'Duck Meat', price: 280, image: duckMeat, category: 'duck', description: 'Rich and flavorful meat, curry cut.' },
    { id: 22, name: 'Quail Meat', price: 200, image: quailMeat, category: 'quail', description: 'A pair of cleaned quail, a true delicacy.' }
];
 
const categoryData = {
    all: { name: 'All', icon: 'All' },
    chicken: { name: 'Chicken', icon: '🍗' },
    fish: { name: 'Fish', icon: '🐟' },
    mutton: { name: 'Mutton', icon: '🐑' },
    goat: { name: 'Goat', icon: '🐐' },
    duck: { name: 'Duck', icon: '🦆' },
    quail: { name: 'Quail', icon: '🦅' },
};
 
 
function Home() {
  const [cart, setCart] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  // --- CHANGE 1: Add state for cart visibility ---
  const [isCartOpen, setIsCartOpen] = useState(false);
 
  useEffect(() => {
    const savedCart = localStorage.getItem('taazaCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, []);
 
  useEffect(() => {
    localStorage.setItem('taazaCart', JSON.stringify(cart));
  }, [cart]);
 
  // --- CHANGE 2: Add function to toggle cart visibility ---
  const toggleCart = () => setIsCartOpen(!isCartOpen);
 
  // --- CART LOGIC ---
  const addToCart = (item) => setCart([...cart, { ...item, quantity: 1 }]);
  const incrementQuantity = (itemId) => setCart(cart.map(item => item.id === itemId ? { ...item, quantity: item.quantity + 1 } : item));
  const decrementQuantity = (itemId) => {
    const itemInCart = cart.find(item => item.id === itemId);
    if (itemInCart.quantity === 1) {
      setCart(cart.filter(item => item.id !== itemId)); // This removes the item
    } else {
      setCart(cart.map(item => item.id === itemId ? { ...item, quantity: item.quantity - 1 } : item));
    }
  };
  // New function to remove an item completely, regardless of quantity
  const removeFromCart = (itemId) => {
    setCart(cart.filter(item => item.id !== itemId));
  };
 
  const clearCart = () => setCart([]);
 
  const totalCartItems = cart.reduce((sum, item) => sum + item.quantity, 0);
 
  return (
    <div className="bg-gray-100 font-sans text-gray-800">
      {/* --- HEADER --- */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-40"> {/* Reduced z-index to 40 */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between h-28 md:h-20">
            <div className="flex items-center justify-between w-full md:w-auto">
              <div className="text-3xl font-bold text-primary">Taaza</div>
              <div className="flex items-center gap-4 md:hidden">
                {/* --- CHANGE 3: Added onClick to mobile cart icon --- */}
                <div className="relative cursor-pointer" onClick={toggleCart}>
                  <FiShoppingCart size={24} />
                  {totalCartItems > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">{totalCartItems}</span>}
                </div>
                <FiUser size={24} />
              </div>
            </div>
           
            <div className="flex items-center bg-gray-100 rounded-lg p-2 w-full md:w-2/5 md:mx-4">
              <FiSearch size={20} className="text-gray-500" />
              <input type="text" placeholder="Search for any product..." className="bg-transparent w-full ml-2 outline-none text-gray-800" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
            </div>
 
            <div className="hidden md:flex items-center gap-6">
              {/* --- CHANGE 4: Added onClick to desktop cart icon --- */}
              <div className="relative cursor-pointer" onClick={toggleCart}>
                <FiShoppingCart size={24} />
                {totalCartItems > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">{totalCartItems}</span>}
              </div>
              <FiUser size={24} />
            </div>
          </div>
        </div>
      </header>
 
       {/* --- CHANGE 5: Conditionally render the Cart Sidebar --- */}
       {isCartOpen && (
        <CartSidebar
          cart={cart}
          closeCart={toggleCart}
          incrementQuantity={incrementQuantity}
          decrementQuantity={decrementQuantity}
          removeFromCart={removeFromCart}
          clearCart={clearCart}
        />
      )}
 
      <main className="pt-28 md:pt-20">
        {/* Main content... */}
        <section
          className="h-[200px] sm:h-[300px] md:h-[400px] bg-cover bg-center flex items-center justify-center"
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${heroBanner})`}}
        >
          <h1 className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-shadow">Freshness Delivered</h1>
        </section>
 
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">Shop by Category</h2>
          <div className="flex justify-center flex-wrap gap-x-4 gap-y-6 sm:gap-x-6 md:gap-x-8">
            {Object.entries(categoryData).map(([key, { name, icon }]) => (
              <div key={key} className={clsx("flex flex-col items-center gap-2 cursor-pointer p-2 rounded-lg transition-all duration-200 border-2", activeFilter === key ? "border-primary" : "border-transparent")} onClick={() => setActiveFilter(key)}>
                <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-full bg-white flex items-center justify-center text-3xl shadow-sm border border-gray-200">{icon}</div>
                <span className="font-medium text-sm text-center md:text-base">{name}</span>
              </div>
            ))}
          </div>
        </section>
 
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 md:pb-24">
          {nonVegItems.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase())).length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <h3 className="text-xl font-semibold">No products found</h3>
              <p className="mt-2">Try adjusting your search or filters.</p>
            </div>
          ) : activeFilter === 'all' ? (
            <div className="space-y-12">
              {Object.keys(categoryData).filter(key => key !== 'all').map(categoryKey => {
                const itemsForCategory = nonVegItems.filter(item => item.category === categoryKey && item.name.toLowerCase().includes(searchQuery.toLowerCase()));
                if (itemsForCategory.length === 0) return null;
 
                return (
                  <div key={categoryKey}>
                    <h3 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center gap-3"><span className="text-3xl">{categoryData[categoryKey].icon}</span>{categoryData[categoryKey].name}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {itemsForCategory.map(item => <ProductCard key={item.id} item={item} cart={cart} addToCart={addToCart} incrementQuantity={incrementQuantity} decrementQuantity={decrementQuantity} />)}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {nonVegItems.filter(item => item.category === activeFilter && item.name.toLowerCase().includes(searchQuery.toLowerCase())).map(item => <ProductCard key={item.id} item={item} cart={cart} addToCart={addToCart} incrementQuantity={incrementQuantity} decrementQuantity={decrementQuantity} />)}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
 
 
const ProductCard = ({ item, cart, addToCart, incrementQuantity, decrementQuantity }) => {
  const itemInCart = cart.find(cartItem => cartItem.id === item.id);
 
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-xl">
      <div className="w-full h-48"><img src={item.image} alt={item.name} className="w-full h-full object-cover" /></div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-4 flex-grow">{item.description}</p>
        <div className="flex justify-between items-center mt-auto">
          <span className="text-xl font-bold text-primary">₹{item.price}<small className="text-sm font-normal text-gray-500">/kg</small></span>
          {itemInCart ? (
            <div className="flex items-center border-2 border-primary rounded-lg">
              <button className="text-primary p-2 flex items-center" onClick={() => decrementQuantity(item.id)}><FiMinus /></button>
              <span className="px-2 font-bold text-gray-800">{itemInCart.quantity}</span>
              <button className="text-primary p-2 flex items-center" onClick={() => incrementQuantity(item.id)}><FiPlus /></button>
            </div>
          ) : (
            <button className="border-2 border-primary text-primary font-bold py-2 px-6 rounded-lg hover:bg-primary hover:text-white transition-colors duration-200" onClick={() => addToCart(item)}>ADD</button>
          )}
        </div>
      </div>
    </div>
  );
};
 
// --- CHANGE 6: Added new CartSidebar component ---
const CartSidebar = ({ cart, closeCart, incrementQuantity, decrementQuantity, removeFromCart, clearCart }) => {
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
 
  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={closeCart}></div>
      {/* Sidebar */}
      <div className="fixed top-0 right-0 w-full max-w-md h-full bg-white shadow-2xl z-50 flex flex-col">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-2xl font-semibold">Your Cart</h2>
          <button onClick={closeCart} className="text-gray-500 hover:text-gray-800"><FiX size={24} /></button>
        </div>
 
        {cart.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-gray-500">
            <FiShoppingCart size={60} className="mb-4" />
            <h3 className="text-xl">Your cart is empty</h3>
            <p>Add items to get started!</p>
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto p-4 space-y-4">
              {cart.map(item => (
                <div key={item.id} className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-20 h-20 rounded-md object-cover" />
                  <div className="flex-grow">
                    <h4 className="font-semibold">{item.name}</h4>
                    <p className="text-sm text-gray-500">₹{item.price}</p>
                     <div className="flex items-center border border-gray-300 rounded-md w-fit mt-2">
                        <button className="text-primary p-1.5" onClick={() => decrementQuantity(item.id)}><FiMinus size={14} /></button>
                        <span className="px-3 font-bold text-sm">{item.quantity}</span>
                        <button className="text-primary p-1.5" onClick={() => incrementQuantity(item.id)}><FiPlus size={14}/></button>
                    </div>
                  </div>
                  <div className="text-right">
                     <p className="font-bold">₹{item.price * item.quantity}</p>
                     <button onClick={() => removeFromCart(item.id)} className="text-red-500 hover:text-red-700 mt-2"><FiTrash2 size={18} /></button>
                  </div>
                </div>
              ))}
            </div>
 
            <div className="p-4 border-t space-y-4">
              <div className="flex justify-between font-semibold">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <button className="w-full bg-primary text-white font-bold py-3 rounded-lg hover:bg-primary-dark transition-colors">
                Proceed to Checkout
              </button>
              <button onClick={clearCart} className="w-full bg-gray-200 text-gray-700 font-bold py-2 rounded-lg hover:bg-gray-300 transition-colors">
                Clear Cart
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
};
 
export default Home;