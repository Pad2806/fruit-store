import UserLayout from "../UserLayout";
import Home from "../pages/home/home";
import About from "../pages/about/about";
import Contact from "../pages/contact/contact";
import Products from "../pages/products/products";
import ProductDetail from "../pages/product_detail/product_detail";

const userRoutes = [
  {
    element: <UserLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/products", element: <Products /> },
      { path: "/products/:id", element: <ProductDetail /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> },
    ],
  },
];

export default userRoutes;