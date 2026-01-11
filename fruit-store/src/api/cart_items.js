import apiClient from "./api";

export const addProductToCart = async (productId) => {
  const response = await apiClient.post(
    `/user/cart-items/${productId}`,
    {
      user_id: "e2a0e0e5-b8a0-4f43-9798-269557bb75ca",
      quantity: 1,
    }
  );
  return response.data;
};

export const updateItemQuantity = async (cartItemId, quantity) => {
  return await apiClient.put(`/user/cart-items/${cartItemId}`, {
    quantity,
  });
};

export const removeCartItem = async (cartItemId) => {
  return await apiClient.delete(`/user/cart-items/${cartItemId}`);
};
