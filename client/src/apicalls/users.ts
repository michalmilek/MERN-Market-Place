import { axiosInstance } from "./axiosInstance";

interface PayloadLoginInterface {
  email: string;
  password: string;
}

interface PayloadRegisterInterface extends PayloadLoginInterface {
  name: string;
}

export const RegisterUser = async (payload: PayloadRegisterInterface) => {
  try {
    const response = await axiosInstance.post("/auth/register", payload);
    return response.data;
  } catch (error) {
    return (error as any).response.data.message;
  }
};

export const LoginUser = async (payload: PayloadLoginInterface) => {
  try {
    const response = await axiosInstance.post("/auth/login", payload);
    return response.data;
  } catch (error) {
    return (error as any).response.data.message;
  }
};

export const GetCurrentUser = async () => {
  try {
    const response = await axiosInstance.get("/auth/get-current-user");
    return response.data;
  } catch (error) {
    return (error as any).response.data.message;
  }
};

export const GetAllUsers = async () => {
  try {
    const response = await axiosInstance.get("/auth/get-all-users");
    return response.data;
  } catch (error) {
    return (error as any).response.data.message;
  }
};

export const UpdateUserStatus = async (id: string, status: string) => {
  try {
    const response = await axiosInstance.put(`/auth/update-user-status/${id}`, {
      status,
    });
    return response.data;
  } catch (error) {
    return (error as Error).message;
  }
};
