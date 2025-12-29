import Login from '../pages/auths/login';
import Cart from '../pages/cart/cart';
import Checkout from '../pages/checkout/checkout';
import User from '../pages/user/user';
const userRoutes = [
  {path: "/login", element: <Login />},
  {path: "/cart", element: <Cart />},
  {path: "/checkouts", element: <Checkout />},
  {path: "/user", element: <User />}

];

export default userRoutes;