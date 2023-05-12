import { message, Modal, Table } from "antd";
import React, { useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  GetAllBids,
  GetAllBidsForProduct,
  GetProductById,
} from "../apicalls/products";
import { FormValues } from "../pages/Profile/Products/ProductsForm";
import { SetLoader } from "../redux/loadersSlice";
import moment from "moment";

interface Props {
  showBids: boolean;
  setShowBids: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProduct: null | FormValues;
}

const Bids = ({ setShowBids, showBids, selectedProduct }: Props) => {
  const [bidsData, setBidsData] = React.useState([]);
  const dispatch = useDispatch();

  const getData = useCallback(async () => {
    try {
      dispatch(SetLoader(true));
      if (selectedProduct) {
        const bidsResponse = await GetAllBidsForProduct(selectedProduct._id);
        setBidsData(bidsResponse.data);
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      dispatch(SetLoader(false));
    }
  }, [dispatch, selectedProduct]);

  React.useEffect(() => {
    if (selectedProduct) {
      getData();
    }
  }, [getData, selectedProduct]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text: string, record: any) => record.buyer.name,
    },
    {
      title: "Bid Amount",
      dataIndex: "bidAmount",
      render: (text: string, record: any) => record.bidAmount + "$",
    },
    {
      title: "bid Date",
      dataIndex: "bidDate",
      render: (text: string, record: any) =>
        moment(text).format("MMMM Do YYYY, h:mm:ss a"),
    },
    {
      title: "Message",
      dataIndex: "message",
    },
    {
      title: "Contact Details",
      dataIndex: "contactDetails",
      render: (text: string, record: any) => (
        <div>
          <p>
            <span className="font-bold">Phone:</span> {record.mobile}
          </p>
          <p>
            <span className="font-bold">Email:</span> {record.buyer.email}
          </p>
        </div>
      ),
    },
  ];

  return (
    <Modal
      centered
      onCancel={() => setShowBids(false)}
      title="Bids"
      open={showBids}
      width={1000}>
      {selectedProduct && (
        <div className="flex flex-col gap-6">
          <h1>{selectedProduct.name}</h1>
          <Table
            dataSource={bidsData}
            columns={columns}
          />
        </div>
      )}
    </Modal>
  );
};

export default Bids;
