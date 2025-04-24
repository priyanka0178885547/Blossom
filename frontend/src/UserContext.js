import React, { createContext, useState } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);

  return (
    <UserContext.Provider value={{ wishlist, setWishlist, cart, setCart }}>
      {children}
    </UserContext.Provider>
  );
};