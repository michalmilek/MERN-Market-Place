import { FormValues } from "../pages/Profile/Products/ProductsForm";
import { axiosInstance } from "./axiosInstance";

interface Filters {
  seller: string;
}

export const AddProduct = async (payload: FormValues) => {
  try {
    const response = await axiosInstance.post("/api/add-product", payload);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

export const GetProducts = async (filters?: Filters) => {
  try {
    const response = await axiosInstance.post("/api/get-all-products", filters);
    return response.data;
  } catch (error) {
    return (error as any).response.data.message;
  }
};

export const EditProducts = async (id: string, payload: FormValues) => {
  try {
    const response = await axiosInstance.put(`api/edit-product/${id}`, payload);
    return response.data;
  } catch (error) {
    return (error as Error).message;
  }
};

export const GetProductById = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/api/product/${id}`);
    return response.data;
  } catch (error) {
    return (error as Error).message;
  }
};

export const DeleteProduct = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`api/delete-product/${id}`);
    return response.data;
  } catch (error) {
    return (error as Error).message;
  }
};

//upload product img
export const UploadProductImg = async (payload: any) => {
  try {
    const response = await axiosInstance.post(
      "/api/upload-image-to-product",
      payload
    );
    return response.data;
  } catch (error) {
    return (error as Error).message;
  }
};

export const updateProductStatus = async (id: string, status: string) => {
  try {
    const response = await axiosInstance.put(`/api/update-status/${id}`, {
      status,
    });
    return response.data;
  } catch (error) {
    return (error as Error).message;
  }
};


export const PlaceNewBid = async (bidData: any) => {
  try {
    const response = await axiosInstance.post("/api/place-new-bid", bidData);
    return response.data;
  } catch (error) {
    return (error as Error).message;
  }
};

export const GetAllBids = async (filters: any) => {
  try {
    const response = await axiosInstance.get("/api/get-all-bids", filters);
    return response.data;
  } catch (error) {
    return (error as Error).message;
  }
};
