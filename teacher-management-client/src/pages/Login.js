import { Button, Form, Input, Row, Col, message, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const Login = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        values
      );
      localStorage.setItem("token", data.token);
      navigate("/", { replace: true });
      message.success("Login Successful");
    } catch (e) {
      message.error("Login Failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="basic"
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
      style={{ marginTop: "4rem" }}
    >
      <Row justify="center" align="middle">
        <Col span={14}>
          <Form.Item
            label="Email"
            name="email"
            rules={[{ required: true, message: "Please input your email!" }]}
          >
            <Input size="large" />
          </Form.Item>
        </Col>
        <Col span={14}>
          <Form.Item
            label="Password"
            name="password"
            rules={[{ required: true, message: "Please input your password!" }]}
          >
            <Input.Password size="large" />
          </Form.Item>
        </Col>
        <Col span={14}>
          <Form.Item>
            <Button
              style={{ marginRight: "1rem" }}
              type="primary"
              htmlType="submit"
              loading={loading}
            >
              Submit
            </Button>
            <Typography.Link onClick={() => navigate("/register")}>
              Register
            </Typography.Link>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};
