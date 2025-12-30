import { useRoutes } from "react-router-dom";
import {userRoutes} from "./app/user/routes/userroute";
import adminRoutes from "./app/admin/routes/adminroutes";
import sellerRoutes from "./app/seller/routes/sellerroutes";


function App() {
  const routes = useRoutes([
    ...userRoutes,
    ...adminRoutes,
    ...sellerRoutes
  ]);
  return routes;
}

export default App;
