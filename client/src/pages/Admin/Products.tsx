import { Button, message, Table } from "antd";
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
    },
    {
      title: "Seller",
      dataIndex: "name",
      render: (text: any, record: any) => {
        return record.seller.name;
      },
    },
    { title: "Description", dataIndex: "description" },
    { title: "Price", dataIndex: "price" },
    { title: "Category", dataIndex: "category" },
    { title: "Age", dataIndex: "age" },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: any, record: any) => record.status.toUpperCase(),
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
