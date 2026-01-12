import {userRoutes} from "../../app/user/routes/userroute";
import adminRoutes from "../../app/admin/routes/adminroutes";
import sellerRoutes from "../../app/seller/routes/sellerroutes";
import Forbidden403 from '../../app/shared/pages/for-bidden-403/Forbidden403'
import NotFound404 from '../../app/shared/pages/not-found-404/NotFound404'

const appRoutes = [
  ...userRoutes,
  ...sellerRoutes,
  ...adminRoutes,
  { path: "403", element: <Forbidden403 /> },
  { path: "*", element: <NotFound404/> }
];


export default appRoutes
