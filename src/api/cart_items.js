import apiClient from "./api";

export const addProductToCart = async (productId, userId, quantity = 1) => {
  const payload = {
    user_id: userId,
    quantity,
  };
  const response = await apiClient.post(`/user/cart-items/${productId}`, payload);
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
