import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GetCurrentUser } from "../apicalls/users";
import { ImUser } from "react-icons/im";
import { RiLogoutBoxLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { SetUser, UserState } from "../redux/usersSlice";
import { RootState } from "../redux/store";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { user } = useSelector(
    (state: { user: UserState }) => (state as any).users
  );
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");

  useEffect(() => {
    const validateToken = async () => {
      if (!token) {
        message.error("Please login to continue");
        navigate("/login");
        return;
      }

      try {
        const response = await GetCurrentUser();
        if (response.success) {
          dispatch(SetUser(response.data));
        } else {
          navigate("/login");
        }
      } catch (error) {
        navigate("/login");
      }
    };

    validateToken();
  }, [navigate, token, dispatch]);

  return (
    <>
      {user && (
        <div>
          <div className="flex justify-between items-center bg-primary p-5">
            <h1
              onClick={() => navigate("/")}
              className="text-white cursor-pointer">
              MM Market Place
            </h1>

            <div className="bg-white py-2 px-5 flex items-center gap-5 justify-center">
              <div
                onClick={() => {
                  if (user.role === "user") {
                    navigate("/profile");
                  } else {
                    navigate("/admin");
                  }
                }}
                className="flex items-center gap-1 cursor-pointer group">
                <ImUser className="group-hover:opacity-70 transition-all" />
                <span className="group-hover:opacity-70 transition-all font-semibold underline">
                  {user.name}
                </span>
              </div>
              <RiLogoutBoxLine
                onClick={() => {
                  localStorage.removeItem("token");
                  window.location.reload();
                }}
                className="cursor-pointer hover:opacity-70 transition-all"
              />
            </div>
          </div>

          <div className="p-5">{children}</div>
        </div>
      )}
    </>
  );
};

export default ProtectedRoute;
