import { Button, Form, Input, message, Modal } from "antd";
import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Product } from "../pages/ProductInfo";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../redux/loadersSlice";
import { PlaceNewBid } from "../apicalls/products";
import { RootState } from "../redux/store";

interface Props {
  product: Product;
  getData: () => Promise<void>;
  setShowAddNewBid: React.Dispatch<React.SetStateAction<boolean>>;
  showAddNewBid: boolean;
}

interface FormikValues {
  bidAmount: string;
  message: string;
  mobile: string;
}

export interface BidData extends FormikValues {
  product: string;
  seller: string;
  buyer: string;
}

const BidModal = ({
  setShowAddNewBid,
  showAddNewBid,
  product,
  getData,
}: Props) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => (state as any).users);
  const validationSchema = Yup.object().shape({
    bidAmount: Yup.number()
      .required("Bid amount is required")
      .test(
        "greaterThanMinBid",
        `Bid amount must be greater than the current highest bid which is ${
          product?.bids ? product.bids[0]?.bidAmount + "$" : ""
        }`,
        function (value) {
          const currentHighestBid = product.bids[0]?.bidAmount || 0;
          return value > currentHighestBid;
        }
      ),
    message: Yup.string(),
    mobile: Yup.string()
      .matches(/^\d{10}$/, "Mobile number must be 10 digits")
      .required("Mobile number is required"),
  });

  const handlePlaceBid = async (values: FormikValues) => {
    try {
      dispatch(SetLoader(true));
      const response = await PlaceNewBid({
        ...values,
        product: product._id,
        seller: product.seller._id,
        buyer: user._id,
      });
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        throw new Error("Server error");
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      dispatch(SetLoader(false));
    }
  };

  const formik = useFormik({
    initialValues: {
      bidAmount: "",
      message: "",
      mobile: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      handlePlaceBid(values);
    },
  });

  return (
    <div>
      <Modal
        onOk={() => {
          if (formik.isValid) {
            formik.handleSubmit();
            setShowAddNewBid(false);
          }
        }}
        open={showAddNewBid}
        onCancel={() => setShowAddNewBid(false)}
        centered>
        <div>
          <h1 className="text-primary text-center mb-3">Place A Bid</h1>
        </div>

        <Form layout="vertical">
          <Form.Item
            label="Bid amount"
            name="bidAmount"
            validateStatus={
              formik.errors.bidAmount && formik.touched.bidAmount ? "error" : ""
            }
            help={
              formik.errors.bidAmount && formik.touched.bidAmount
                ? formik.errors.bidAmount
                : ""
            }>
            <Input
              name="bidAmount"
              type="number"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.bidAmount}
              onKeyDown={(event: any) => {
                if (event.target.value.length >= 10) {
                  event.preventDefault();
                }
              }}
            />
          </Form.Item>
          <Form.Item
            label="Message"
            name="message"
            validateStatus={
              formik.errors.message && formik.touched.message ? "error" : ""
            }
            help={
              formik.errors.message && formik.touched.message
                ? formik.errors.message
                : ""
            }>
            <Input.TextArea
              name="message"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.message}
            />
          </Form.Item>

          <Form.Item
            label="Mobile"
            name="mobile"
            validateStatus={
              formik.errors.mobile && formik.touched.mobile ? "error" : ""
            }
            help={
              formik.errors.mobile && formik.touched.mobile
                ? formik.errors.mobile
                : ""
            }>
            <Input
              type="number"
              name="mobile"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.mobile}
              onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
                if ((event.target as HTMLInputElement).value.length >= 10) {
                  event.preventDefault();
                }
              }}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default BidModal;
