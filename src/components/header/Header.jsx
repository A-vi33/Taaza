import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { FiShoppingCart } from 'react-icons/fi'; // <-- (1) IMPORT THE ICON
 
function Header() {
  const [cartCount, setCartCount] = useState(0);
  const navigate = useNavigate();
 
  // This useEffect logic remains unchanged.
  useEffect(() => {
    const updateCartCount = () => {
      const savedCart = localStorage.getItem('taazaCart');
      if (savedCart) {
        const cartItems = JSON.parse(savedCart);
        const totalCount = cartItems.reduce((total, item) => total + item.quantity, 0);
        setCartCount(totalCount);
      } else {
        setCartCount(0);
      }
    };
 
    updateCartCount();
    const storageChangeHandler = () => updateCartCount();
    window.addEventListener('storage', storageChangeHandler);
    const interval = setInterval(updateCartCount, 1000);
 
    return () => {
      window.removeEventListener('storage', storageChangeHandler);
      clearInterval(interval);
    };
  }, []);
 
  const handleCartClick = () => {
    navigate('/cart');
  };
 
  return (
    <header className="sticky top-0 z-50 flex items-center justify-between bg-white px-4 py-4 shadow-md sm:px-6 lg:px-8">
      {/* Left side: Logo and Contact Info */}
      <div className="flex items-center gap-4 sm:gap-8">
        <a href="/" className="text-3xl font-bold text-primary transition-colors hover:text-primary-dark">
          Taaza
        </a>
        <div className="hidden items-center gap-2 rounded-lg border bg-gray-50 p-2 text-sm text-gray-600 md:flex">
          <span>📧</span>
          <span>Contact us:</span>
          <a href="mailto:info@taaza.com" className="font-medium text-blue-500 transition-colors hover:text-blue-700">
            info@taaza.com
          </a>
        </div>
      </div>
     
      {/* Right side: Cart Button */}
      <div
        onClick={handleCartClick}
        // The 'group' class allows us to style child elements on hover of this parent div
        className="group flex cursor-pointer items-center gap-3 rounded-xl bg-gray-50 p-3 shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 hover:shadow-md"
      >
        {/* (2) USE THE ICON COMPONENT INSTEAD OF THE EMOJI */}
        {/* We can now control its color and size easily */}
        <FiShoppingCart
          size={24}
          className="text-primary transition-transform duration-300 group-hover:scale-110"
        />
       
        <span className="hidden font-semibold text-gray-800 sm:block">My Cart</span>
       
        {/* Cart Count Bubble - This part is already correct! */}
        {/* bg-primary makes it red, text-white makes the text white */}
        <div
          className={clsx(
            'flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-red shadow-lg shadow-primary/30',
            cartCount > 0 && 'animate-pulse-custom'
          )}
        >
          {cartCount}
        </div>
      </div>
    </header>
  );
}
 
export default Header;