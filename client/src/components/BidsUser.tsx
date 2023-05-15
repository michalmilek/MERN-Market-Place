import { Breakpoint, message, Table } from "antd";
import React, { useState, useCallback, useEffect } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { deleteBid, getUserBids } from "../apicalls/bids";
import { SetLoader } from "../redux/loadersSlice";
import { RootState } from "../redux/store";

const BidsUser = () => {
  const [bids, setBids] = useState([]);
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => (state as any).users);

  const handleDelete = async (bidId: string) => {
    try {
      dispatch(SetLoader(true));
      const response = await deleteBid(bidId);
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      dispatch(SetLoader(false));
    }
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      responsive: ["xs", "sm", "md", "lg"] as Breakpoint[],
      render: (text: any, record: any) => record.product.name,
    },
    {
      title: "Bid Amount",
      dataIndex: "bidAmount",
      responsive: ["xs", "sm", "md", "lg"] as Breakpoint[],
      render: (text: any, record: any) => text + " $",
    },
    {
      title: "Seller",
      dataIndex: "seller",
      responsive: ["xs", "sm", "md", "lg"] as Breakpoint[],
      render: (text: any, record: any) => record.seller.name,
    },
    {
      title: "Bid Date",
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
              title="Delete bid"
              onClick={() => {
                handleDelete(record._id);
              }}
            />
          </div>
        );
      },
      responsive: ["xs", "sm", "md", "lg"] as Breakpoint[],
    },
  ];

  const getData = useCallback(async () => {
    try {
      dispatch(SetLoader(true));
      const response = await getUserBids(user._id);
      if (response.success) {
        console.log(response);
        setBids(response.data);
        dispatch(SetLoader(false));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoader(false));
      message.error((error as Error).message);
    }
  }, [dispatch, user._id]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div>
      <Table
        columns={columns}
        dataSource={bids}
      />
    </div>
  );
};

export default BidsUser;
