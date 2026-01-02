import { BrowserRouter, Routes, Route } from "react-router-dom";
import UserLayout from "./app/user/UserLayout";

// USER PAGES
import Home from "./app/user/pages/home";
import About from "./app/user/pages/about";
import Contact from "./app/user/pages/contact";
import Products from "./app/user/pages/products";
import ProductDetail from "./app/user/pages/product_detail";

function App() {
  return (
    <Routes>
      <Route element={<UserLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
      </Route>
    </Routes>
  );
}

export default App;
