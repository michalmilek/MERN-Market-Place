import { Button, Card, Divider, Input, message } from "antd";
import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllProducts, GetProducts } from "../../apicalls/products";
import Filters from "../../components/Filters";
import { SetLoader } from "../../redux/loadersSlice";
import { RootState } from "../../redux/store";
import { BsFilterLeft } from "react-icons/bs";

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

interface Filters2 {
  status: string;
  category?: string;
  age?: string[];
}

const Home = () => {
  const [showFilters, setShowFilters] = useState(true);
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filters, setFilters] = useState<any>({
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
    <div className={`flex ${!showFilters && "flex-col"} gap-5`}>
      {!showFilters && (
        <div className="flex items-center">
          <Button
            onClick={() => setShowFilters(true)}
            className="hover:opacity-75 cursor-pointer transition-all"
            type="ghost">
            <BsFilterLeft className="text-xl" />
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
      )}
      {showFilters && (
        <Filters
          filters={filters}
          setFilters={setFilters}
          setShowFilters={setShowFilters}
        />
      )}
      <div
        className={`grid ${showFilters ? "grid-cols-4" : "grid-cols-5"} gap-8`}>
        {products?.map((product) => {
          if (product.status === filters.status) {
            return (
              <Card
                onClick={() => navigate(`/product/${product._id}`)}
                className="shadow-md max-h-[350px] max-w-[250px] cursor-pointer hover:brightness-90 transition-all">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="h-44 w-44 object-cover"
                />
                <div>
                  <h1 className="text-lg font-semibold">{product.name}</h1>
                  <p className="text-sm text-gray-500">{product.description}</p>
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
  );
};

export default Home;