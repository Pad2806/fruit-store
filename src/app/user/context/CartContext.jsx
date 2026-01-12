import { createContext, useContext, useState } from "react";
import { addProductToCart } from "../../../api/cart_items";
import { ToastService } from "../components/toast/Toast";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartCount, setCartCount] = useState(0);

  const addToCart = async (product) => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        ToastService.error("Bạn chưa đăng nhập");
        return;
      }

      await addProductToCart(product.id);
      setCartCount((prev) => prev + 1);
      ToastService.success("Đã thêm sản phẩm vào giỏ hàng");
    } catch (error) {
      ToastService.error("Thêm sản phẩm vào giỏ hàng thất bại");
    }
  };

  return (
    <CartContext.Provider value={{ cartCount, addToCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
