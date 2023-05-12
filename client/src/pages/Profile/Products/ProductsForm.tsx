import {
  Modal,
  Tabs,
  Form,
  Input,
  Select,
  Checkbox,
  CheckboxProps,
  Button,
  message,
  FormInstance,
} from "antd";
import React, { useMemo, useEffect, useRef, useState, FormEvent } from "react";
import { FormikProps, useFormik } from "formik";
import * as yup from "yup";
import { useDispatch, useSelector } from "react-redux";
import { AddProduct, EditProducts } from "../../../apicalls/products";
import { SetLoader } from "../../../redux/loadersSlice";
import { RootState } from "../../../redux/store";
import Spinner from "../../../components/Spinner";
import { UserState } from "../../../redux/usersSlice";
import Images from "../../../components/Images";

const { Option } = Select;

type Category = "Electronics" | "Clothes" | "Home Appliance" | "Others" | "";

interface Props {
  showProductsForm: boolean;
  setShowProductsForm: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProduct: FormValues | null;
  getData: () => Promise<void>;
  setSelectedProduct: React.Dispatch<React.SetStateAction<FormValues | null>>;
}

export interface FormValues {
  name: string;
  description: string;
  price: string;
  category: string;
  age: string;
  billAvailable: boolean;
  warrantyAvailable: boolean;
  accessoriesAvailable: boolean;
  boxAvailable: boolean;
  seller: string;
  status: string;
  [key: string]: any;
}

const categories = ["Electronics", "Clothes", "Home Appliance", "Others"];
const accessories = [
  "Bill Available",
  "Warranty Available",
  "Accessories Available",
  "Box Available",
];

const validationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  description: yup.string().required("Description is required"),
  price: yup
    .number()
    .required("Price is required")
    .min(0, "Price must be positive"),
  category: yup.string().required("Category is required"),
  age: yup
    .number()
    .required("Number is required")
    .min(0, "Age must be positive"),
});

const ProductsForm = ({
  showProductsForm,
  setShowProductsForm,
  selectedProduct,
  getData,
  setSelectedProduct,
}: Props) => {
  const [selectedTab, setSelectedTab] = useState("1");
  const dispatch = useDispatch();
  const { user } = useSelector(
    (state: { user: RootState }) => (state as any).users
  );
  const formRef =
    useRef<FormInstance<FormEvent<HTMLFormElement> | undefined>>(null);
  /*     const formRef = useRef<FormikProps<FormValues>>(null); */
  const formik = useFormik<FormValues>({
    initialValues: {
      name: "",
      description: "",
      price: "",
      category: "",
      age: "",
      billAvailable: false,
      warrantyAvailable: false,
      accessoriesAvailable: false,
      boxAvailable: false,
      seller: "",
      status: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        dispatch(SetLoader(true));
        let response = null;
        if (selectedProduct) {
          response = await EditProducts(selectedProduct._id, values);
          setSelectedProduct(null);
        } else {
          values.seller = user._id;
          values.status = "pending";
          response = await AddProduct(values);
        }
        dispatch(SetLoader(false));
        if (response.success) {
          console.log(values);
          message.success(response.message);
          getData();
          setShowProductsForm(false);
        } else {
          message.error(response.message);
        }
      } catch (error) {
        console.log(error);
        dispatch(SetLoader(false));
        message.error((error as Error).message);
      }
    },
  });

  /*   useMemo(() => {
    if (selectedProduct) {
      formik.setValues(selectedProduct);
    }
  }, [selectedProduct, formik]); */

  useEffect(
    () => {
      if (selectedProduct) {
        formik.setValues(selectedProduct);
      }
    },
    // eslint-disable-next-line
    [selectedProduct]
  );

  const handleCategoryChange = (value: string) => {
    formik.setFieldValue("category", value);
  };

  return (
    <Modal
      className="z-30"
      title=""
      open={showProductsForm}
      onCancel={() => setShowProductsForm(false)}
      centered
      width={1000}
      onOk={() => {
        if (formRef.current) {
          formRef.current.submit();
        }
      }}
      {...(selectedTab === "2" && { footer: false })}>
      <Tabs
        onChange={(key) => setSelectedTab(key)}
        activeKey={selectedTab}
        defaultActiveKey="1">
        <Tabs.TabPane
          tab="General"
          key="1">
          <h2 className="mb-5">General</h2>
          <Form
            ref={formRef}
            layout="vertical"
            onFinish={formik.handleSubmit}>
            <Form.Item
              label="Name"
              required
              validateStatus={
                formik.touched.name && formik.errors.name ? "error" : ""
              }
              help={
                formik.touched.name && formik.errors.name
                  ? formik.errors.name
                  : ""
              }>
              <Input
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>
            <Form.Item
              label="Description"
              required
              validateStatus={
                formik.touched.description && formik.errors.description
                  ? "error"
                  : ""
              }
              help={
                formik.touched.description && formik.errors.description
                  ? formik.errors.description
                  : ""
              }>
              <Input.TextArea
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>
            <Form.Item
              label="Price"
              required
              validateStatus={
                formik.touched.price && formik.errors.price ? "error" : ""
              }
              help={
                formik.touched.price && formik.errors.price
                  ? formik.errors.price
                  : ""
              }>
              <Input
                name="price"
                type="number"
                value={formik.values.price}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>
            <Form.Item
              label="Category"
              required
              validateStatus={
                formik.touched.category && formik.errors.category ? "error" : ""
              }
              help={
                formik.touched.category && formik.errors.category
                  ? formik.errors.category
                  : ""
              }>
              <Select
                value={formik.values.category}
                onChange={handleCategoryChange}
                onBlur={formik.handleBlur}>
                {categories.map((category) => (
                  <Option
                    key={category}
                    value={category}>
                    {category}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Age"
              required
              validateStatus={
                formik.touched.age && formik.errors.age ? "error" : ""
              }
              help={
                formik.touched.age && formik.errors.age ? formik.errors.age : ""
              }
              /*               help={
                formik.touched.age && formik.errors.age
                  ? formik.errors.age
                  : ""
              } */
            >
              <Input
                name="age"
                type="number"
                value={formik.values.age}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
            </Form.Item>

            <Form.Item label="Accessories">
              {accessories.map((accessory) => (
                <Checkbox
                  key={accessory}
                  name={accessory
                    .toLowerCase()
                    .replace(/\s+(.)/g, (_match, chr) => chr.toUpperCase())
                    .replace(/\s/g, "")}
                  checked={
                    formik.values[
                      accessory
                        .toLowerCase()
                        .replace(/\s+(.)/g, (_match, chr) => chr.toUpperCase())
                        .replace(/\s/g, "")
                    ]
                  }
                  onChange={(e) =>
                    formik.setFieldValue(
                      accessory
                        .toLowerCase()
                        .replace(/\s+(.)/g, (match, chr) => chr.toUpperCase())
                        .replace(/\s/g, ""),
                      e.target.checked
                    )
                  }>
                  {accessory}
                </Checkbox>
              ))}
            </Form.Item>
          </Form>
        </Tabs.TabPane>
        <Tabs.TabPane
          disabled={!selectedProduct}
          tab="Images"
          key="2">
          <h2>Images</h2>
          <Images
            setShowProductsForm={setShowProductsForm}
            getData={getData}
            selectedProduct={selectedProduct}
          />
        </Tabs.TabPane>
      </Tabs>
    </Modal>
  );
};

export default ProductsForm;
