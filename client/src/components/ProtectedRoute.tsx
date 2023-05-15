import { Anchor, Avatar, Badge, message } from "antd";
import React, { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GetCurrentUser } from "../apicalls/users";
import { ImUser } from "react-icons/im";
import { RiLogoutBoxLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { SetUser, UserState } from "../redux/usersSlice";
import { RootState } from "../redux/store";
import { MdAdminPanelSettings } from "react-icons/md";
import AppFooter from "./AppFooter";
import { IoIosNotifications } from "react-icons/io";
import Notifications, { Notification } from "./Notifications";
import { GetNotifications } from "../apicalls/notifications";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { user } = useSelector(
    (state: { user: UserState }) => (state as any).users
  );
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  console.log(notifications);

  const validateToken = useCallback(async () => {
    if (!token) {
      message.error("Please login to continue");
      navigate("/login");
      return;
    }

    try {
      const response = await GetCurrentUser();
      if (response.success) {
        dispatch(SetUser(response.data));
        const responseNotifications = await GetNotifications(response.data._id);
        if (responseNotifications.success) {
          setNotifications(responseNotifications.data);
        } else {
          throw new Error(responseNotifications.data);
        }
      } else {
        navigate("/login");
      }
    } catch (error) {
      navigate("/login");
    }
  }, [navigate, token, dispatch]);

  useEffect(() => {
    validateToken();
  }, [validateToken]);

  return (
    <div className="flex flex-col min-h-[100vh] justify-between">
      {user && (
        <div>
          <div className="flex justify-between items-center bg-primary p-5">
            <h1
              onClick={() => navigate("/")}
              className="text-white cursor-pointer">
              MM Market Place
            </h1>

            <div className="bg-white py-2 px-5 flex flex-col md:flex-row whitespace-nowrap items-center gap-5 justify-center">
              {user.role === "admin" && (
                <Link
                  className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-all underline text-black font-semibold text-[15px]"
                  to={"/admin"}>
                  <MdAdminPanelSettings className="text-lg" />
                  ADMIN PANEL
                </Link>
              )}
              <div
                onClick={() => {
                  navigate("/profile");
                }}
                className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-all underline text-black font-semibold text-[15px]">
                <ImUser />
                <span>{user.name}</span>
              </div>
              <Notifications
                notifications={notifications}
                setNotifications={setNotifications}
              />
              <div
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.reload();
                }}
                className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-all underline text-black font-semibold text-[15px]">
                <RiLogoutBoxLine />
                LOGOUT
              </div>
            </div>
          </div>
          <div className="p-5">{children}</div>
        </div>
      )}
      <AppFooter />
    </div>
  );
};

export default ProtectedRoute;
