import { Breakpoint, Button, message, Table } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  DeleteProduct,
  getAllProducts,
  GetProducts,
} from "../../../apicalls/products";
import { SetLoader } from "../../../redux/loadersSlice";
import ProductsForm, { FormValues } from "./ProductsForm";
import { AiOutlineDelete, AiOutlineEdit } from "react-icons/ai";
import { RootState } from "../../../redux/store";
import { BiDollar } from "react-icons/bi";
import Bids from "../../../components/Bids";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [showProductsForm, setShowProductsForm] = useState(false);
  const [showBids, setShowBids] = useState(false);
  const [bids, setBids] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState<null | FormValues>(
    null
  );
  const { user } = useSelector((state: RootState) => (state as any).users);
  console.log(user);
  const dispatch = useDispatch();

  console.log(selectedProduct);
  const getData = useCallback(async () => {
    try {
      dispatch(SetLoader(true));
      const response = await getAllProducts({
        sellerId: user._id,
      });
      if (response.success) {
        console.log(response);
        setProducts(response.data);
        dispatch(SetLoader(false));
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error((error as Error).message);
    }
  }, [dispatch, user._id]);

  const handleDelete = async (productId: string) => {
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
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      responsive: ["xs", "sm", "md", "lg"] as Breakpoint[],
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
        return (
          <div className="flex gap-5">
            <AiOutlineDelete
              className="cursor-pointer"
              title="Delete product"
              onClick={() => {
                handleDelete(record._id);
              }}
            />
            <AiOutlineEdit
              title="Edit product"
              className="cursor-pointer"
              onClick={() => {
                setSelectedProduct(record);
                setShowProductsForm(true);
              }}
            />
            <BiDollar
              onClick={() => {
                setSelectedProduct(record);
                setShowBids(true);
              }}
              title="Show bids"
              className="cursor-pointer"
            />
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
      <div className="flex justify-end mb-8 pr-4 md:pr-0">
        <Button
          type="default"
          onClick={() => {
            setSelectedProduct(null);
            setShowProductsForm(true);
          }}>
          Add product
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
      />

      {showProductsForm && (
        <ProductsForm
          showProductsForm={showProductsForm}
          setShowProductsForm={setShowProductsForm}
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          getData={getData}
        />
      )}
      {showBids && (
        <Bids
          showBids={showBids}
          setShowBids={setShowBids}
          selectedProduct={selectedProduct}
        />
      )}
    </div>
  );
};

export default Products;
