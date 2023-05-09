import React, { useEffect } from "react";
import { Tabs } from "antd";
import Products from "./Products";
import Users from "./Users";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { useNavigate } from "react-router-dom";

const { TabPane } = Tabs;

const Admin = () => {
  const { user } = useSelector((state: RootState) => (state as any).users);
  const navigate = useNavigate();
  useEffect(() => {
    if (user.role !== "admin") {
      navigate("/");
    }
  }, [navigate, user.role]);

  return (
    <div>
      <Tabs>
        <TabPane
          tab="Product"
          key="1">
          <Products />
        </TabPane>
        <TabPane
          tab="Users"
          key="2">
          <Users />
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Admin;
