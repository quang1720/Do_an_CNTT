import { Table, Image, Button } from "antd";
import { useEffect, useState } from "react";
import { getTeachers } from "../api/teacher";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

export const TeachersList = () => {
  const navigate = useNavigate();
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
    },
    {
      title: "Avatar",
      key: "avatar",
      render: (teacher) => {
        return (
          <Image
            src={teacher.avatar}
            width={200}
            title="Preview"
            alt="preview"
          />
        );
      },
    },
    {
      title: "Action",
      key: "action",
      render: (teacher) => {
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-evenly",
            }}
          >
            <Button onClick={() => navigate(`/edit-teacher/${teacher.id}`)}>
              <EditOutlined />
            </Button>
          </div>
        );
      },
    },
  ];
  useEffect(() => {
    setLoading(true);
    getTeachers()
      .then(({ data }) => setTeachers(data.teachers))
      .finally(() => setLoading(false));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <Table
        pagination={{
          defaultCurrent: 1,
          pageSize: 10,
        }}
        dataSource={teachers}
        columns={columns}
        loading={loading}
      />
    </>
  );
};
