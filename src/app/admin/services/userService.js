import api from "../../../axios";

export const getUsers = async (params) => {
    const response = await api.get("/admin/users", { params });
    return response.data;
};

export const createUser = async (data) => {
    const response = await api.post("/admin/users", data);
    return response.data;
};

export const updateUser = async (id, data) => {
    const response = await api.put(`/admin/users/${id}`, data);
    return response.data;
};

export const deleteUser = async (id) => {
    const response = await api.delete(`/admin/users/${id}`);
    return response.data;
};
