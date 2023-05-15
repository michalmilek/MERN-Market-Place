import { Badge, Avatar, Dropdown, Menu, Divider } from "antd";
import { IoIosNotifications } from "react-icons/io";
import React from "react";
import { BsEnvelopeOpen, BsEnvelopeFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { MarkNotificationAsRead } from "../apicalls/notifications";

export interface Notification {
  _id: string;
  title: string;
  message: string;
  onClick: string;
  user: string;
  seen: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

const NotificationsDropdown = ({
  notifications,
  setNotifications,
}: {
  notifications: Notification[];
  setNotifications: any;
}) => {
  const navigate = useNavigate();
  const notificationCount = notifications.filter(
    (notification) => !notification.seen
  ).length;

  const handleMarkNotificationAsRead = async (
    notificationId: string,
    userId: string
  ) => {
    try {
      const updatedNotifications = await MarkNotificationAsRead(
        notificationId,
        userId
      );
      setNotifications(updatedNotifications);
    } catch (error) {
      console.error(error);
    }
  };

  const menu = (
    <Menu>
      {notifications.map((notification, index: number) => (
        <React.Fragment key={notification._id}>
          <Menu.Item
            className="cursor-pointer"
            onClick={async () => {
              navigate(notification.onClick);
              await handleMarkNotificationAsRead(
                notification._id,
                notification.user
              );
            }}
            key={notification._id}>
            <span
              className={`flex items-center gap-6 ${
                notification.seen && "bg-gray-200"
              }`}>
              {notification.message}{" "}
              {notification.seen ? (
                <BsEnvelopeOpen
                  onClick={async () => {}}
                  title="Mark as unreaded"
                  className="text-xl"
                />
              ) : (
                <BsEnvelopeFill
                  title="Mark as readed"
                  className="text-xl"
                />
              )}
            </span>
          </Menu.Item>
          {index !== notifications.length - 1 ? (
            <Menu.Divider className="text-gray-300 border-solid border" />
          ) : null}
        </React.Fragment>
      ))}
    </Menu>
  );

  return (
    <Dropdown
      overlay={menu}
      trigger={["click"]}>
      <Badge
        className="cursor-pointer"
        style={{ transform: "translate(20%, -50%)" }}
        size="default"
        count={notificationCount}>
        <Avatar
          className="bg-transparent hover:bg-gray-300 transition-all duration-200 cursor-pointer"
          shape="circle"
          size="large"
          icon={<IoIosNotifications className="text-black" />}
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationsDropdown;
