import { axiosInstance } from "./axiosInstance";

export const getUserBids = async (userId: string) => {
  try {
    const response = await axiosInstance.get(
      `/api/get-all-user-bids?userId=${userId}`
    );
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const deleteBid = async (bidId: string) => {
  try {
    const response = await axiosInstance.delete(`/api/delete-bid/${bidId}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
