import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { addProductToCart } from "../../../api/cart_items";
import { getCartDetails } from "../../../api/cart";
import { ToastService } from "../components/toast/Toast";
import { useAuth } from "./AuthContext";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);
  const { user } = useAuth();

  const refreshCartCount = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token || !user?.id) {
      setCartCount(0);
      return;
    }

    try {
      const data = await getCartDetails();
      const items = data?.cart_items || [];

      const uniqueCount = new Set(
        items
          .map((item) => item.product_id ?? item.product?.id ?? item.productId)
          .filter(Boolean)
      ).size;

      setCartCount(uniqueCount);
    } catch (error) {
      console.error("Error fetching cart count:", error);
      setCartCount(0);
    }
  }, [user?.id]);

  useEffect(() => {
    refreshCartCount();
  }, [refreshCartCount]);

  const addToCart = async (product, qty = 1) => {
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

      const quantity = Math.max(1, Number(qty) || 1);

      await addProductToCart(product.id, user.id, quantity);
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
