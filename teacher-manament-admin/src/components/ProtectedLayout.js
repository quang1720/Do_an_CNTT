import { LogoutOutlined } from "@ant-design/icons";
import { Layout, Menu, Button } from "antd";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export const ProtectedLayout = ({ children, routes }) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const initRouteKey =
    routes?.find((route) => route?.path?.includes(pathname))?.key || "0";
  const [collapsed, setCollapsed] = useState(false);
  const [currentKey, setCurrentKey] = useState(initRouteKey);

  const onNavigate = (route) => {
    setCurrentKey(route.key);
    navigate(routes[Number(route.key)].path);
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Layout.Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        style={{
          overflow: "auto",
          height: "100vh",
          position: "sticky",
          left: 0,
          top: 0,
          bottom: 0,
        }}
      >
        <div className="logo" />
        <Menu
          theme="dark"
          defaultSelectedKeys={[currentKey]}
          mode="inline"
          items={routes}
          onClick={onNavigate}
        />
      </Layout.Sider>
      <Layout>
        <Layout.Content style={{ margin: "0 16px" }}>{children}</Layout.Content>
        <Layout.Footer style={{ textAlign: "end" }}>
          <Button
            icon={<LogoutOutlined />}
            type="primary"
            danger
            onClick={logout}
          />
        </Layout.Footer>
      </Layout>
    </Layout>
  );
};
