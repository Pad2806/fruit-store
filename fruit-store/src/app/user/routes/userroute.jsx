import UserLayout from "../UserLayout";
import Home from "../pages/home/home";
import About from "../pages/about/about";
import Contact from "../pages/contact/contact";
import Products from "../pages/products/products";
import ProductDetail from "../pages/product_detail/product_detail";
import Login from '../pages/auths/login';
import Cart from '../pages/cart/cart';
import Checkout from '../pages/checkout/checkout';
import User from '../pages/user/user';
import PrivacyPolicy from "../pages/privacypolicy/privacypolicy";
import OnlineShoppingGuide from "../pages/onlineshoppingguide/onlineshoppingguide";
import OrderSuccess from "../pages/ordersuccess/ordersuccess";
const userRoutes = [
  {
    element: <UserLayout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/products", element: <Products /> },
      { path: "/products/:id", element: <ProductDetail /> },
      { path: "/about", element: <About /> },
      { path: "/contact", element: <Contact /> }, 
      {path: "/login", element: <Login />},
      {path: "/cart", element: <Cart />},
      {path: "/checkouts", element: <Checkout />},
      {path: "/user", element: <User />},
      { path: "/chinh-sach-bao-mat", element: <PrivacyPolicy /> },
      {path: "/huong-dan-mua-hang", element: <OnlineShoppingGuide />},
      {path: "/order-success", element: <OrderSuccess />},
    ],
  },
];

export { userRoutes };


