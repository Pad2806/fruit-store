import { BrowserRouter, useRoutes } from "react-router-dom";
import appRoutes from "./layout/routes/Route";
import PageTitle from "./layout/components/page-title/PageTitle";
import { CartProvider } from "./app/user/context/CartContext";
import ScrollToTop from "./layout/components/scroll-to-top/ScrollToTop";
import ScrollButton from "./layout/components/scroll-to-top/ScrollToTopButton";

function AppRoutes() {
  return useRoutes(appRoutes);
}

import { AuthProvider } from "./app/user/context/AuthContext";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ScrollButton />
      <AuthProvider>
        <CartProvider>
          <PageTitle />
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
