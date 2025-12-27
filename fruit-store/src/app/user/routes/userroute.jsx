import UserLayout from "../UserLayout";
import Home from "../pages/home";
import About from "../pages/about";
import Contact from "../pages/contact";
import Products from "../pages/products";
import ProductDetail from "../pages/product_detail";

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