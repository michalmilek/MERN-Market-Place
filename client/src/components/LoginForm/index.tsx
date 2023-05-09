import { FormikProvider, useFormik } from "formik";
import * as Yup from "yup";
import { Form, Input, Button, Checkbox, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { Typography } from "antd";
import { LoginUser } from "../../apicalls/users";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SetLoader } from "../../redux/loadersSlice";
import Spinner from "../Spinner";
import type { RootState } from "../../redux/store";

interface LoginFormValues {
  email: string;
  password: string;
  rememberMe: boolean;
}

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
  password: Yup.string().required("Password is required"),
});

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loading = useSelector((state: RootState) => state.loaders.loading);
  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    validationSchema,
    onSubmit: async (values) => {
      // Handle form submission
      try {
        dispatch(SetLoader(true));
        const response = await LoginUser({
          email: values.email,
          password: values.password,
        });
        dispatch(SetLoader(false));
        if (response.success) {
          message.success(response.message);
          localStorage.setItem("token", response.accessToken);
          window.location.href = "/";
        } else {
          throw new Error(response);
        }
      } catch (error) {
        dispatch(SetLoader(false));
        message.error((error as Error).message);
      }
    },
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

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
            Marketplace Login
          </span>
        </h1>

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
          name="rememberMe"
          valuePropName="checked"
          className="text-center w-full">
          <Checkbox {...getFieldProps("rememberMe")}>Remember me</Checkbox>
        </Form.Item>

        <Form.Item className="text-center w-full">
          <Button
            disabled={!formik.isValid || formik.isSubmitting}
            className="w-full"
            type="primary"
            htmlType="submit">
            Log in
          </Button>
        </Form.Item>

        <Form.Item className="text-center">
          <Text>
            Don't have an account? <Link to="/register">Register now</Link>
          </Text>
        </Form.Item>
      </Form>
      {loading && <Spinner />}
    </FormikProvider>
  );
};

export default LoginForm;
