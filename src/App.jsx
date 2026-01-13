import { BrowserRouter, useRoutes } from "react-router-dom";
import appRoutes from "./layout/routes/Route";
import PageTitle from "./layout/components/page-title/PageTitle";
import { CartProvider } from "./app/user/context/CartContext";
import ScrollToTop from "./layout/components/scroll-to-top/ScrollToTop";
import ScrollButton from "./layout/components/scroll-to-top/ScrollToTopButton";
import { Toaster } from "react-hot-toast";
import ChatBox from "./app/user/components/chatbox/ChatBox";
import { AuthProvider } from "./app/user/context/AuthContext";
import RequireRole from "./app/shared/components/RequireRole";
function AppRoutes() {
  return useRoutes(appRoutes);
}

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <ScrollToTop />
      <ScrollButton />
      <AuthProvider>
        <CartProvider>
          <PageTitle />
            <ChatBox />
          <AppRoutes />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
    

  );
}
export default App;
