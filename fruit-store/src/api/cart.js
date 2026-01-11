import apiClient from "./api";
export const getCartDetails = async (cartId) => {
    try {
        const response = await apiClient.get(`/user/carts/${cartId}`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết giỏ hàng:", error);
        throw error;
    }
};