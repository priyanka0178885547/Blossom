// import React from 'react';
// import { Routes, Route } from 'react-router-dom';
// import Home from './components/Home';
// import Signup from './components/Signup';
// import Login from './components/login';
// //import Search from './components/Search';
// import About from './components/about';
// import Shop from './components/shop';

// export default function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/signup" element={<Signup />} />
//       <Route path="/login" element={<Login />} />
//       {/*<Route path="/search" element={<Search />} />*/}
//       <Route path="/about" element={<About />} />
//       <Route path="/shop" element={<Shop />} />
//     </Routes>
//   );
// }

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup';
import Login from './components/login';
import About from './components/about';
import Shop from './components/shop';
import WishlistPage from "./components/wishlistPage";
import SellerDashboard from './components/seller/Dashboard';

export default function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/about" element={<About />} />
      <Route path="/shop" element={<Shop />} />
      <Route path="/seller/dashboard" element={<SellerDashboard />} />
      <Route path="/wishlist" element={<WishlistPage />} />
    </Routes>
  );
}

