import { axiosInstance } from "./axiosInstance";

export async function AddNotification(notificationData: any) {
  try {
    const response = await axiosInstance.post("/api/notify", notificationData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw new Error(
      (error as any).response?.data?.message || "Internal Server Error"
    );
  }
}

export const GetNotifications = async (userId: string) => {
  try {
    const response = await axiosInstance.get(
      `/api/notifications?userId=${userId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as any).response?.data?.message || "Internal Server Error"
    );
  }
};

export const DeleteNotification = async (
  notificationId: string,
  userId: string
) => {
  try {
    const response = await axiosInstance.delete(
      `/api/delete-notification/${notificationId}?userId=${userId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as any).response?.data?.message || "Internal Server Error"
    );
  }
};

export const MarkAllNotificationsAsRead = async (userId: string) => {
  try {
    const response = await axiosInstance.patch(
      `/api/notifications/mark-all-as-read?userId=${userId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as any).response?.data?.message || "Internal Server Error"
    );
  }
};

export const MarkNotificationAsRead = async (
  notificationId: string,
  userId: string
) => {
  try {
    const response = await axiosInstance.patch(
      `/api/notifications/${notificationId}/mark-as-read?userId=${userId}`
    );
    return response.data;
  } catch (error) {
    throw new Error(
      (error as any).response?.data?.message || "Internal Server Error"
    );
  }
};
