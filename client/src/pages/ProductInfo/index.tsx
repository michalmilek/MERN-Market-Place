import {
  Button,
  Carousel,
  Divider,
  message,
  Card,
  Typography,
  Input,
  Checkbox,
} from "antd";
import { CarouselProps, CarouselRef } from "antd/es/carousel";
import React, {
  useState,
  useCallback,
  useEffect,
  useRef,
  MutableRefObject,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { GetAllBids, GetProductById } from "../../apicalls/products";
import { SetLoader } from "../../redux/loadersSlice";
import moment from "moment";
import BidModal from "../../components/BidModal";
import { RootState } from "../../redux/store";

interface AuctionBid {
  _id: string;
  seller: {
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
  };
  buyer: {
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
  };
  product: {
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
    seller: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  bidAmount: number;
  message: string;
  mobile: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface Product {
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
  seller: {
    name: string;
    email: string;
    _id: string;
  };
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  bids: AuctionBid[];
}

const ProductInfo = () => {
  const [showAddNewBid, setShowAddNewBid] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  console.log("🚀 ~ product:", product);
  const [selectedImgIndex, setSelectedImgIndex] = useState(0);
  const [showBids, setShowBids] = useState(true);
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => (state as any).users);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const carouselRef = useRef<CarouselRef>(null);
  const { Text } = Typography;

  /* const handleGetProduct = async (productId: string) => {
    try {
      dispatch(SetLoader(true));
      const response = await GetProductById(productId);
      if (response.success) {
        message.success(response.message);
      } else {
        throw new Error("Product didnt fetch correctly");
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      dispatch(SetLoader(false));
    }
  }; */

  const getData = useCallback(async () => {
    try {
      dispatch(SetLoader(true));
      if (id) {
        const response = await GetProductById(id);
        if (response.success) {
          const bidsResponse = await GetAllBids({ product: id });
          setProduct({ ...response.product, bids: bidsResponse.data });
        }
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      dispatch(SetLoader(false));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [getData, id]);

  return (
    <div className="overflow-x-hidden">
      {product && (
        <div className="grid grid-cols-2">
          <div className="flex flex-col gap-10">
            <Carousel
              arrows
              afterChange={(current) => setSelectedImgIndex(current)}
              className="w-96"
              ref={carouselRef}>
              {product.images.map((image, index) => (
                <a
                  title="Click to open page in new card"
                  key={index}
                  href={image}
                  target="_blank"
                  rel="noopener noreferrer">
                  <img
                    className="w-96 h-96 object-cover rounded-md cursor-pointer hover:opacity-80 transition-all"
                    src={image}
                    alt=""
                  />
                </a>
              ))}
            </Carousel>
            <div className="flex flex-wrap gap-5 max-w-[384px]">
              {product.images.map((image, index) => (
                <img
                  key={index}
                  className={`w-20 h-20 object-cover rounded-md cursor-pointer hover:opacity-80 transition-all ${
                    selectedImgIndex === index
                      ? "border-2 border-primary border-dashed p-2"
                      : ""
                  }`}
                  src={image}
                  alt=""
                  onClick={() => {
                    setSelectedImgIndex(index);
                    carouselRef.current?.goTo(index);
                  }}
                />
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-5 font-semibold">
            <h1 className="text-primary text-2xl font-semibold uppercase ">
              {product.name}
            </h1>
            <span>{product.description}</span>

            <Divider className="border-gray-300" />
            <div className="flex flex-col gap-2">
              <h1 className="text-primary text-2xl font-semibold uppercase mb-4">
                Product Details
              </h1>
              <div className="flex justify-between">
                <span>Price:</span>
                <span className="font-normal">{product.price}</span>
              </div>
              <div className="flex justify-between">
                <span>Category:</span>
                <span className="font-normal">{product.category}</span>
              </div>
              <div className="flex justify-between">
                <span>Bill Available:</span>
                <span className="font-normal">
                  {product.billAvailable ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Box Available:</span>
                <span className="font-normal">
                  {product.boxAvailable ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Accesories Available:</span>
                <span className="font-normal">
                  {product.accessoriesAvailable ? "Yes" : "No"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Warranty Available:</span>
                <span className="font-normal">
                  {product.warrantyAvailable ? "Yes" : "No"}
                </span>
              </div>
            </div>

            <Divider className="border-gray-300" />
            <div className="flex flex-col gap-2">
              <h1 className="text-primary text-2xl font-semibold uppercase mb-4">
                Owner Details
              </h1>

              <div className="flex justify-between">
                <span>Owner Name:</span>
                <span className="font-normal">{product.seller.name}</span>
              </div>
              <div className="flex justify-between">
                <span>Email:</span>
                <span className="font-normal">{product.seller.email}</span>
              </div>
            </div>
            <Divider className="border-gray-300" />
            <div className="flex flex-col gap-2">
              <h1 className="text-primary text-2xl font-semibold uppercase mb-4">
                Added on
              </h1>
              <div className="flex justify-between">
                <span>Added on:</span>
                <span className="font-normal">
                  {moment(product.createdAt).format("DD.MM.YYYY HH:mm:ss")}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Updated at:</span>
                <span className="font-normal">
                  {moment(product.updatedAt).format("DD.MM.YYYY HH:mm:ss")}
                </span>
              </div>
            </div>
            <Divider className="border-gray-300" />
            <div className="flex flex-col gap-2">
              <div className="flex justify-between">
                <h1 className="text-primary text-2xl font-semibold uppercase mb-4">
                  Bids
                </h1>
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={showBids}
                    onChange={() => setShowBids((prev) => !prev)}>
                    {showBids ? "Hide bids" : "Show bids"}
                  </Checkbox>
                  <Button
                    disabled={user._id === product.seller._id}
                    onClick={() => setShowAddNewBid(true)}
                    title={
                      user._id === product.seller._id
                        ? "You cant buy your product"
                        : undefined
                    }
                    type="dashed">
                    New bid
                  </Button>
                </div>
              </div>
              {showAddNewBid && (
                <BidModal
                  product={product}
                  getData={getData}
                  showAddNewBid={showAddNewBid}
                  setShowAddNewBid={setShowAddNewBid}
                />
              )}
              {product.bids.length !== 0 && showBids && (
                <div className="flex flex-col gap-3 max-h-[400px] overflow-y-scroll p-4 border border-gray-200 border-solid shadow-md">
                  {product.bids?.map((bid) => {
                    if (product._id === bid.product._id) {
                      return (
                        <Card
                          className="hover:scale-105 transition-all duration-500 cursor-pointer"
                          type="inner"
                          key={bid.createdAt}>
                          <div className="flex flex-col">
                            <div className="flex justify-between items-center">
                              <div className="flex flex-col gap-2">
                                <Text className="font-bold mb-2">
                                  {bid.seller.name}
                                </Text>
                                <Text className="mb-4">{bid.seller.email}</Text>
                              </div>
                              <Text className="text-xl text-green-500 font-bold mb-4">
                                {bid.bidAmount} $
                              </Text>
                            </div>
                            <Text className="text-gray-500 text-center">
                              {new Date(bid.createdAt).toLocaleString()}
                            </Text>
                          </div>
                        </Card>
                      );
                    }
                    return null;
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfo;
