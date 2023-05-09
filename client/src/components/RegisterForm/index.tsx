import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { Form, Input, Button, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "antd";
import { RegisterUser } from "../../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import Spinner from "../Spinner";
import type { RootState } from "../../redux/store";

interface RegistrationFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isValid: boolean;
}

const validationSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string()
    .min(8, "Password must be at least 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), "Password must match"], "Passwords must match")
    .required("Confirm Password is required"),
});

const RegistrationForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.loaders.loading);
  const formik = useFormik<RegistrationFormValues>({
    initialValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      isValid: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      // Handle form submission
      try {
        dispatch(SetLoader(true));
        const response = await RegisterUser({
          name: values.name,
          email: values.email,
          password: values.password,
        });
        dispatch(SetLoader(false));

        if (response.success === true) {
          message.success(response.message);
          navigate("/login");
        } else {
          throw new Error(response);
        }
      } catch (error) {
        dispatch(SetLoader(false));
        message.error((error as any).message);
      }
    },
  });

  const { errors, touched, handleSubmit, getFieldProps } = formik;
  const { Text } = Typography;

  return (
    <FormikProvider value={formik}>
      <Form
        layout="vertical"
        size="large"
        onFinish={handleSubmit}
        className="max-w-lg border bg-white px-4 py-4">
        <h1 className="text-2xl font-semibold">
          Michał Miłek{" "}
          <span className="bg-gradient-to-bl from-fuchsia-700 via-slate-900 to-fuchsia-300 text-transparent bg-clip-text">
            Marketplace Register
          </span>
        </h1>
        <Form.Item
          label="Name"
          name="name"
          validateStatus={errors.name && touched.name ? "error" : ""}
          help={touched.name && errors.name}>
          <Input {...getFieldProps("name")} />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          validateStatus={errors.email && touched.email ? "error" : ""}
          help={touched.email && errors.email}>
          <Input {...getFieldProps("email")} />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          validateStatus={errors.password && touched.password ? "error" : ""}
          help={touched.password && errors.password}>
          <Input.Password {...getFieldProps("password")} />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          validateStatus={
            errors.confirmPassword && touched.confirmPassword ? "error" : ""
          }
          help={touched.confirmPassword && errors.confirmPassword}>
          <Input.Password {...getFieldProps("confirmPassword")} />
        </Form.Item>

        <Form.Item className="text-center w-full">
          <Button
            disabled={!formik.isValid || formik.isSubmitting}
            className="w-full"
            type="primary"
            htmlType="submit">
            Submit
          </Button>
        </Form.Item>

        <Form.Item className="text-center">
          <Text>
            Do you have an account? <Link to="/login">Please log in</Link>
          </Text>
        </Form.Item>
      </Form>
      {loading && <Spinner />}
    </FormikProvider>
  );
};

export default RegistrationForm;
