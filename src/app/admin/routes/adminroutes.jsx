import RequireRole from "../../shared/components/RequireRole";
import AdminPanel from "../pages/adminpanel";

const adminRoutes = [
  {
    path: "/admin",
    element:
      <RequireRole allowedRoles="admin">
        <AdminPanel />
      </RequireRole>,
  },
];

export default adminRoutes;

