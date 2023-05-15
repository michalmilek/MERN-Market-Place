import { Breakpoint, Button, message, Table } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetProducts, updateProductStatus } from "../../apicalls/products";
import { SetLoader } from "../../redux/loadersSlice";
import ProductsForm, { FormValues } from "../Profile/Products/ProductsForm";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { RootState } from "../../redux/store";

const Products = () => {
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();

  const getData = useCallback(async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts();
      if (response.success) {
        console.log(response);
        setProducts(response.data);
        dispatch(SetLoader(false));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error((error as Error).message);
    }
  }, [dispatch]);

  const onStatusUpdate = async (id: string, status: string) => {
    try {
      dispatch(SetLoader(true));
      const response = await updateProductStatus(id, status);
      if (response.success) {
        console.log(response);
        message.success(response.message);
        getData();
      }
    } catch (error) {
      message.error("Some error happened during updating");
    } finally {
      dispatch(SetLoader(false));
    }
  };

  /* const handleDelete = async (productId: string) => {
    try {
      dispatch(SetLoader(true));
      const response = await DeleteProduct(productId);
      dispatch(SetLoader(false));
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        message.error(response.error);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error((error as Error).message);
    }
  }; */

  const columns = [
    {
      title: "Product",
      dataIndex: "name",
      responsive: ["xs", "sm", "md", "lg"] as Breakpoint[],
    },
    {
      title: "Seller",
      dataIndex: "name",
      render: (text: any, record: any) => {
        return record.seller.name;
      },
      responsive: ["sm", "md", "lg"] as Breakpoint[],
    },
    {
      title: "Description",
      dataIndex: "description",
      responsive: ["sm", "md", "lg"] as Breakpoint[],
    },
    { title: "Price", dataIndex: "price", responsive: ["lg"] as Breakpoint[] },
    {
      title: "Category",
      dataIndex: "category",
      responsive: ["sm", "md", "lg"] as Breakpoint[],
    },
    { title: "Age", dataIndex: "age", responsive: ["lg"] as Breakpoint[] },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: any, record: any) => record.status.toUpperCase(),
      responsive: ["xs", "sm", "md", "lg"] as Breakpoint[],
    },
    {
      title: "Added on",
      dataIndex: "createdAt",
      render: (date: string) => {
        const formattedDate = new Date(date).toLocaleString("pl-PL", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: false,
        });
        return formattedDate;
      },
      responsive: ["sm", "md", "lg"] as Breakpoint[],
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_text: any, record: any) => {
        const { status, _id } = record;

        return (
          <div className="flex gap-3">
            {status === "pending" && (
              <span
                onClick={() => onStatusUpdate(_id, "approved")}
                className="underline cursor-pointer text-green-500">
                Approve
              </span>
            )}
            {status === "pending" && (
              <span
                onClick={() => onStatusUpdate(_id, "approved")}
                className="underline cursor-pointer text-red-500">
                Reject
              </span>
            )}
            {status === "approved" && (
              <span
                onClick={() => onStatusUpdate(_id, "blocked")}
                className="underline cursor-pointer">
                Block
              </span>
            )}
            {status === "blocked" && (
              <span
                onClick={() => onStatusUpdate(_id, "approved")}
                className="underline cursor-pointer">
                Unblock
              </span>
            )}
          </div>
        );
      },
      responsive: ["xs", "sm", "md", "lg"] as Breakpoint[],
    },
  ];

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={products}
      />
    </div>
  );
};

export default Products;
