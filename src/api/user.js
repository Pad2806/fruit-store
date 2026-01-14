import apiClient from "./api";

export const getUser = async () => {
  const res = await apiClient.get("/user/profile");
  return res.data;
};
