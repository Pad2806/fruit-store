import { BrowserRouter, useRoutes } from "react-router-dom";
import appRoutes from "./layout/routes/Route";
import PageTitle from "./layout/components/page-title/PageTitle";
import { CartProvider } from "./app/user/context/CartContext";
import ScrollToTop from "./layout/components/scroll-to-top/ScrollToTop";
import ScrollButton from "./layout/components/scroll-to-top/ScrollToTopButton";

function AppRoutes() {
  return useRoutes(appRoutes);
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <ScrollButton />
      <CartProvider>
        <PageTitle />
        <AppRoutes />
      </CartProvider>
    </BrowserRouter>
  );
}

export default App;
