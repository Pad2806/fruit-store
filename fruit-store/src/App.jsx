import { useRoutes } from "react-router-dom";
import userRoutes from "./app/user/routes/userroute";

function App() {
  const routes = useRoutes([
    ...userRoutes
  ]);

  return routes;
}

export default App;
