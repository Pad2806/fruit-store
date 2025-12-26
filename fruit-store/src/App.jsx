import { Routes, Route } from "react-router-dom";

// USER PAGES
import Home from "./app/user/pages/home";
import About from "./app/user/pages/about";
import Contact from "./app/user/pages/contact";
import Products from "./app/user/pages/products";
import ProductDetail from "./app/user/pages/product_detail";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/gioi-thieu" element={<About />} />
      <Route path="/lien-he" element={<Contact />} />
      <Route path="/san-pham" element={<Products />} />
      <Route path="/san-pham/:id" element={<ProductDetail />} />
    </Routes>
  );
}

export default App;
