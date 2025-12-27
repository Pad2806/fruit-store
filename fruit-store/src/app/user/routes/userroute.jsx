import Login from '../pages/auths/login';
import Cart from '../pages/cart/cart';
import Checkout from '../pages/checkout/checkout';
const userRoutes = [
  {path: "/login", element: <Login />},
  {path: "/cart", element: <Cart />},
  {path: "/checkouts", element: <Checkout />}

];

export default userRoutes;