import apiClient from "./api";

export const getCartDetails = async () => {
    try {
        const response = await apiClient.get(`/user/carts`);
        return response.data;
    } catch (error) {
        console.error("Lỗi khi lấy chi tiết giỏ hàng:", error);
        throw error;
    }
};

export const createCart = async (userId) => {
    try {
        const response = await apiClient.post(`/user/carts`, { user_id: userId });
        return response.data;
    } catch (error) {
        console.error("Lỗi khi tạo giỏ hàng:", error);
        throw error;
    }
};