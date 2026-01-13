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

import PrivacyPolicy from "../pages/privacy_policy/privacy_policy";
import OnlineShoppingGuide from "../pages/online_shopping_guide/online_shopping_guide";
import OrderSuccess from "../pages/order_success/order_success";
import WarrantyPolicy from "../pages/policy_warranty/warranty";
import InspectionPolicy from "../pages/policy_inspection/inspection";
import PurchasePolicy from "../pages/policies/purchase_policy";
import PaymentPolicy from "../pages/policies/payment_policy";
import GoogleCallback from "../pages/GoogleCallback";
import PaymentVisa from "../pages/payment_visa/payment_visa";
import RequireRole from "../../shared/components/RequireRole";


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
      {path: "/cart", element: <RequireRole allowedRoles="user"><Cart /></RequireRole>},
      {path: "/checkouts", element: <RequireRole allowedRoles="user"><Checkout /></RequireRole>},
      {path: "/user", element: <RequireRole allowedRoles="user"><User /></RequireRole>},
      { path: "/policy", element: <PrivacyPolicy /> },
      {path: "/guide", element: <OnlineShoppingGuide />},
      {path: "/order-success", element: <RequireRole allowedRoles="user"><OrderSuccess /></RequireRole>},
      { path: "/policy-warranty", element: <WarrantyPolicy /> },
      { path: "/policy-inspection", element: <InspectionPolicy /> },
      { path: "/purchase-policy", element: <PurchasePolicy /> },
      { path: "/payment-policy", element: <PaymentPolicy /> },
      { path: "/google-callback", element: <GoogleCallback /> },
      { path: "/payment-visa", element: <RequireRole allowedRoles="user"><PaymentVisa /></RequireRole> }
    ],
  },
];

export { userRoutes };


