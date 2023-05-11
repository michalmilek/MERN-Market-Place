import { Card, Divider, message } from "antd";
import React, { useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetProducts } from "../../apicalls/products";
import { SetLoader } from "../../redux/loadersSlice";
import { RootState } from "../../redux/store";

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
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filters, setFilters] = useState({
    status: "approved",
  });
  const { user } = useSelector((state: RootState) => (state as any).users);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  //console.log(products);

  const getData = useCallback(async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProducts();
      if (response.success) {
        setProducts(response.data);
        dispatch(SetLoader(false));
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error((error as Error).message);
    }
  }, [dispatch]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div>
      <div className="grid grid-cols-4 gap-5">
        {products?.map((product) => (
          <Card
            onClick={() => navigate(`/product/${product._id}`)}
            className="shadow-md cursor-pointer hover:brightness-90 transition-all">
            <img
              src={product.images[0]}
              alt={product.name}
              className="h-44 w-44 object-cover"
            />
            <div>
              <h1 className="text-lg font-semibold">{product.name}</h1>
              <p className="text-sm text-gray-500">{product.description}</p>
              <Divider />
              <span className="text-green-500 font-bold">{product.price}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
