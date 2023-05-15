import { Breakpoint, message, Table } from "antd";
import React, { useState, useCallback, useEffect } from "react";
import { useDispatch } from "react-redux";
import { GetAllUsers, UpdateUserStatus } from "../../apicalls/users";
import { SetLoader } from "../../redux/loadersSlice";

const Users = () => {
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();

  const getData = useCallback(async () => {
    try {
      dispatch(SetLoader(true));
      const response = await GetAllUsers();
      if (response.success) {
        console.log(response);
        setUsers(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      message.error((error as Error).message);
    } finally {
      dispatch(SetLoader(false));
    }
  }, [dispatch]);

  const onUserStatusUpdate = async (id: string, status: string) => {
    try {
      dispatch(SetLoader(true));
      const response = await UpdateUserStatus(id, status);
      if (response.success) {
        console.log(response);
        message.success(response.message);
        getData();
      }
    } catch (error) {
      message.error("Some error happened during updating");
    } finally {
      dispatch(SetLoader(false));
    }
  };

  useEffect(() => {
    getData();
  }, [getData]);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      responsive: ["xs", "sm", "md", "lg"] as Breakpoint[],
    },
    {
      title: "Email",
      dataIndex: "email",
      responsive: ["sm", "md", "lg"] as Breakpoint[],
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (text: any, record: any) => record.role.toUpperCase(),
      responsive: ["xs", "sm", "md", "lg"] as Breakpoint[],
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text: any, record: any) => record.status.toUpperCase(),
      responsive: ["xs", "sm", "md", "lg"] as Breakpoint[],
    },
    {
      title: "Created on",
      dataIndex: "createdAt",
      render: (date: string) => {
        const formattedDate = new Date(date).toLocaleString("pl-PL", {
          day: "numeric",
          month: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
          hour12: false,
        });
        return formattedDate;
      },
      responsive: ["sm", "md", "lg"] as Breakpoint[],
    },
    {
      title: "Action",
      render: (text: any, record: any) => {
        const { _id } = record;
        return (
          <div>
            {record.status === "active" && (
              <span
                onClick={() => onUserStatusUpdate(_id, "blocked")}
                className="underline cursor-pointer">
                BLOCK
              </span>
            )}
            {record.status === "blocked" && (
              <span
                onClick={() => onUserStatusUpdate(_id, "active")}
                className="underline cursor-pointer">
                UNBLOCK
              </span>
            )}
          </div>
        );
      },
      responsive: ["xs", "sm", "md", "lg"] as Breakpoint[],
    },
  ];

  return (
    <div className="pr-4 md:pr-0">
      <Table
        className="text-[10px] md:text-[16px]"
        columns={columns}
        dataSource={users}
      />
    </div>
  );
};

export default Users;
