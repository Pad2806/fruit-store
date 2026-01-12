import apiClient from "./api";

export const createOrder = async (payload) => {
  const res = await apiClient.post("/user/orders", payload);
  return res.data;
};

export const confirmOrderStripe = async (payment_intent_id) => {
  const res = await apiClient.post("/user/orders/confirm", { payment_intent_id });
  return res.data;
};

export const getOrderById = async (orderId) => {
  const res = await apiClient.get(`/user/orders/${orderId}`);
  return res.data;
};

export const cancelOrder = async (orderId) => {
  const res = await apiClient.post(`/user/orders/${orderId}/cancel`);
  return res.data;
};
