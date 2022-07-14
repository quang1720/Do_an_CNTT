import { ProtectedLayout } from "../components/ProtectedLayout";
import { Routes, Route, Navigate } from "react-router-dom";
import {
  DashboardOutlined,
  UserAddOutlined,
  ScheduleOutlined,
} from "@ant-design/icons";
import { AddNewTeacher } from "../pages/AddNewTeacher";
import { TeachersList } from "../pages/TeachersList";
import { Schedule } from "../pages/Schedule";
import { EditTeacher } from "../pages/EditTeacher";

const routes = [
  {
    path: "/",
    label: "Dashboard",
    element: <TeachersList />,
    icon: <DashboardOutlined />,
  },
  {
    path: "/add-new-teacher",
    label: "Add new teacher",
    element: <AddNewTeacher />,
    icon: <UserAddOutlined />,
  },
  {
    path: "/schedule",
    label: "Schedules",
    element: <Schedule />,
    icon: <ScheduleOutlined />,
  },
  {
    path: "/edit-teacher/:id",
    label: "Edit teacher",
    element: <EditTeacher />,
    icon: <UserAddOutlined />,
    hidden: true,
  },
].map((item, index) => ({
  ...item,
  key: String(index),
}));

export const PrivateRoute = () => {
  return (
    <ProtectedLayout routes={routes.filter((item) => !item.hidden)}>
      <Routes>
        {routes.map((route, index) => {
          return (
            <Route key={index} path={route.path} element={route.element} />
          );
        })}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ProtectedLayout>
  );
};
