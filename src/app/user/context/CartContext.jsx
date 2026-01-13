import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { addProductToCart } from "../../../api/cart_items";
import { getCartDetails } from "../../../api/cart";
import { ToastService } from "../components/toast/Toast";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  // Function to refresh cart count from server
  const refreshCartCount = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token || !user?.id) {
      setCartCount(0);
      return;
    }

    try {
      const data = await getCartDetails();
      const items = data.cart_items || [];
      // Calculate total quantity from all cart items
      const totalQuantity = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
      setCartCount(totalQuantity);
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
    }
  }, [user?.id]);

  // Fetch cart count when user changes (login/logout)
  useEffect(() => {
    refreshCartCount();
  }, [refreshCartCount]);

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        ToastService.error("Bạn chưa đăng nhập");
        return;
      }

      if (!user?.id) {
        ToastService.error("Không tìm thấy thông tin người dùng");
        return;
      }

      await addProductToCart(product.id, user.id, 1);
      // Refresh cart count from server to get accurate count
      await refreshCartCount();
      ToastService.success("Đã thêm sản phẩm vào giỏ hàng");
    } catch (error) {
      ToastService.error("Thêm sản phẩm vào giỏ hàng thất bại");
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, addToCart, refreshCartCount, setCartCount }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}

