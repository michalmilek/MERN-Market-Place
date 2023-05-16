import { Button, Card, Divider, Input, message } from "antd";
import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  getAllProducts,
  GetProducts,
  ProductQuery,
} from "../../apicalls/products";
import Filters from "../../components/Filters";
import { SetLoader } from "../../redux/loadersSlice";
import { RootState } from "../../redux/store";
import { BsFilterLeft, BsFilterRight } from "react-icons/bs";
import SliderComponent from "../../components/SliderComponent";
import Offers from "../../components/Offers";

interface ISeller {
  _id: string;
  name: string;
  email: string;
  password: string;
  role: string;
  status: string;
  profilePicture: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: string;
  category: string;
  age: string;
  billAvailable: boolean;
  warrantyAvailable: boolean;
  accessoriesAvailable: boolean;
  boxAvailable: boolean;
  images: string[];
  seller: ISeller;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const Home = () => {
  const [showFilters, setShowFilters] = useState(true);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filters, setFilters] = useState<ProductQuery>({
    status: "approved",
  });
  const [inputValue, setInputValue] = useState("");
  const { user } = useSelector((state: RootState) => (state as any).users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = useCallback(async () => {
    try {
      dispatch(SetLoader(true));
      const response = await getAllProducts(filters);
      if (response.success) {
        setProducts(response.data);
        dispatch(SetLoader(false));
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error((error as Error).message);
    }
  }, [dispatch, filters]);

  useEffect(() => {
    getData();
  }, [getData, filters]);

  return (
    <>
      <SliderComponent />
      <Offers />
      <div className="flex flex-col gap-5">
        <div className="flex items-center pr-4 lg:pr-0">
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="hover:opacity-75 cursor-pointer transition-all"
            type="ghost">
            {showFilters ? (
              <BsFilterLeft className="text-xl" />
            ) : (
              <BsFilterRight className="text-xl" />
            )}
          </Button>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setFilters({ ...filters, productName: inputValue });
              }
            }}
          />
        </div>
        <div className="flex flex-col md:flex-row gap-2 md:gap-10 items-start justify-start">
          {showFilters && (
            <Filters
              filters={filters}
              setFilters={setFilters}
              setShowFilters={setShowFilters}
            />
          )}
          <div className="grid grid-cols-1  xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products?.map((product) => {
              if (product.status === filters.status) {
                return (
                  <Card
                    onClick={() => navigate(`/product/${product._id}`)}
                    className="shadow-md max-h-[350px] min-w-[225px] cursor-pointer hover:brightness-90 transition-all">
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="h-44 w-44 object-cover"
                    />
                    <div>
                      <h1 className="text-lg font-semibold">{product.name}</h1>
                      <p className="text-sm text-gray-500">
                        {product.description}
                      </p>
                      <Divider />
                      <span className="text-green-500 font-bold">
                        {product.price}$
                      </span>
                    </div>
                  </Card>
                );
              }
              return null;
            })}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
