import RequireRole from "../../shared/components/RequireRole";
import SellerDashBoard from "../pages/sellerdashboard";

const sellerRoutes = [
  {
    path: "/seller",
    element: 
      <RequireRole allowedRoles="seller">
        <SellerDashBoard />
      </RequireRole>,
  },
];

export default sellerRoutes;
