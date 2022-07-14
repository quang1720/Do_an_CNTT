import { Button, Calendar, Typography, Modal, Spin } from "antd";
import { useNavigate } from "react-router-dom";
import { getMySchedules } from "../api/schedule";
import { useState, useEffect } from "react";

export const Main = () => {
  const navigate = useNavigate();
  const [schedules, setSchedules] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(false);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  useEffect(() => {
    setLoading(true);
    getMySchedules()
      .then(({ data }) => {
        setSchedules(data.schedules);
      })
      .finally(() => setLoading(false));
  }, []);

  const dateCellRender = (value) => {
    return (
      <ul className="events">
        {schedules.map((item, index) => {
          if (item.day === value.day()) {
            return (
              <li key={index}>
                <Typography.Link
                  onClick={() => setSelectedItem(item)}
                >{`${item.name} -- ${item.from} to ${item.to}`}</Typography.Link>
              </li>
            );
          }
          // eslint-disable-next-line array-callback-return
          return;
        })}
      </ul>
    );
  };

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Spin size="large" />;
      </div>
    );

  return (
    <>
      <div style={{ textAlign: "end" }}>
        <Calendar dateCellRender={dateCellRender} mode="month" />
        <Button
          onClick={logout}
          type="primary"
          danger
          style={{ position: "fixed", bottom: "1rem", right: "1rem" }}
        >
          Logout
        </Button>
      </div>
      {!!selectedItem && (
        <Modal
          visible={!!selectedItem}
          onOk={() => setSelectedItem(null)}
          cancelButtonProps={{ style: { display: "none" } }}
          closable={false}
        >
          <Typography.Title level={3}>{selectedItem.name}</Typography.Title>
          <Typography.Paragraph>{`${selectedItem.from} to ${selectedItem.to}`}</Typography.Paragraph>
        </Modal>
      )}
    </>
  );
};
