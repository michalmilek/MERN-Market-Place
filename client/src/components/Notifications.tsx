import { Badge, Avatar, Dropdown, Menu, Divider, Button } from "antd";
import { IoIosNotifications } from "react-icons/io";
import React from "react";
import { BsEnvelopeOpen, BsEnvelopeFill } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import {
  GetNotifications,
  MarkAllNotificationsAsRead,
  MarkNotificationAsRead,
  MarkNotificationAsUnread,
} from "../apicalls/notifications";

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
      if (updatedNotifications.success) {
        const responseNotifications = await GetNotifications(userId);
        if (responseNotifications.success) {
          setNotifications(responseNotifications.data);
        } else {
          throw new Error(responseNotifications.data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleMarkNotificationAsUnread = async (
    notificationId: string,
    userId: string
  ) => {
    try {
      const updatedNotifications = await MarkNotificationAsUnread(
        notificationId,
        userId
      );
      if (updatedNotifications.success) {
        const responseNotifications = await GetNotifications(userId);
        if (responseNotifications.success) {
          setNotifications(responseNotifications.data);
        } else {
          throw new Error(responseNotifications.data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleAllMarkNotificationAsRead = async (userId: string) => {
    try {
      const updatedNotifications = await MarkAllNotificationsAsRead(userId);
      if (updatedNotifications.success) {
        const responseNotifications = await GetNotifications(userId);
        if (responseNotifications.success) {
          setNotifications(responseNotifications.data);
        } else {
          throw new Error(responseNotifications.data);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  const menu = (
    <Menu>
      <Menu.Item className="cursor-pointer">
        <Button
          onClick={async () => {
            await handleAllMarkNotificationAsRead(notifications[0].user);
          }}
          className="text-center w-full"
          type="primary">
          Mark All as Read
        </Button>
      </Menu.Item>
      {notifications.map((notification, index: number) => (
        <React.Fragment key={notification._id}>
          <Menu.Item
            className={`cursor-auto ${notification.seen && "bg-gray-300"}`}
            key={notification._id}>
            <div className={`p-2 flex items-center gap-6`}>
              <span
                title="Click to redirect on product page"
                onClick={() => navigate(notification.onClick)}>
                {notification.message}
              </span>
              {notification.seen ? (
                <BsEnvelopeOpen
                  onClick={async () => {
                    await handleMarkNotificationAsUnread(
                      notification._id,
                      notification.user
                    );
                  }}
                  title="Mark as unreaded"
                  className="text-xl hover:scale-110 transition-all"
                />
              ) : (
                <BsEnvelopeFill
                  onClick={async () => {
                    await handleMarkNotificationAsRead(
                      notification._id,
                      notification.user
                    );
                  }}
                  title="Mark as readed"
                  className="text-xl hover:scale-110 transition-all"
                />
              )}
            </div>
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
        count={
          notificationCount && notificationCount !== 0 ? notificationCount : 0
        }>
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
