import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Col,
  Form,
  Input,
  Row,
  Typography,
  Button,
  TimePicker,
  Divider,
  message,
  Upload,
} from "antd";
import { useState } from "react";
import moment from "moment";
import { addTeacher } from "../api/teacher";
import { addSchedule } from "../api/schedule";
import { flatten } from "../utils/flatten";
import { upLoadFile } from "../utils/uploadFile";
import { getDownloadURL } from "firebase/storage";

const WeekDayProps = [
  {
    label: "Monday",
    value: "Monday",
    events: [
      {
        start: "",
        end: "",
        detail: "",
      },
    ],
  },
  {
    label: "Tuesday",
    value: "Tuesday",
    events: [
      {
        start: "",
        end: "",
        detail: "",
      },
    ],
  },
  {
    label: "Wednesday",
    value: "Wednesday",
    events: [
      {
        start: "",
        end: "",
        detail: "",
      },
    ],
  },
  {
    label: "Thursday",
    value: "Thursday",
    events: [
      {
        start: "",
        end: "",
        detail: "",
      },
    ],
  },
  {
    label: "Friday",
    value: "Friday",
    events: [
      {
        start: "",
        end: "",
        detail: "",
      },
    ],
  },
  {
    label: "Saturday",
    value: "Saturday",
    events: [
      {
        start: "",
        end: "",
        detail: "",
      },
    ],
  },
  {
    label: "Sunday",
    value: "Sunday",
    events: [
      {
        start: "",
        end: "",
        detail: "",
      },
    ],
  },
];

export const AddNewTeacher = () => {
  const [weekDay, setWeekDay] = useState(WeekDayProps);
  const [loading, setLoading] = useState(false);
  const [avatar, setAvatar] = useState({
    fileList: [],
    url: "",
  });
  const [form] = Form.useForm();

  const addEvent = (date) => {
    const index = weekDay.findIndex((item) => item.value === date);
    setWeekDay((prev) => {
      const newWeekDay = [...prev];
      newWeekDay[index].events.push({
        start: "",
        end: "",
        detail: "",
      });
      return newWeekDay;
    });
  };

  const deleteEvent = (date, index) => {
    const weekDayIndex = weekDay.findIndex((item) => item.value === date);
    setWeekDay((prev) => {
      const newWeekDay = [...prev];
      newWeekDay[weekDayIndex].events = newWeekDay[weekDayIndex].events.filter(
        (_, i) => i !== index
      );
      return newWeekDay;
    });
  };

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const { data } = await addTeacher({
        ...values,
        avatar: avatar.url,
      });
      const schedule = {
        schedules: flatten(
          weekDay.map((item, index) => {
            return item.events.map((event) => ({
              name: event.detail,
              from: event.start.slice(0, -3),
              to: event.end.slice(0, -3),
              teacherId: data.data.id,
              day: index !== 6 ? String(index + 1) : "0",
            }));
          })
        ).filter((item) => !!item.from && !!item.to),
      };
      await addSchedule(schedule);
      form.resetFields();
      setAvatar({
        fileList: [],
        url: "",
      });
      setWeekDay(WeekDayProps);
      message.success("Add teacher successfully");
    } catch (e) {
      message.error("Add teacher failed");
    } finally {

      setLoading(false);
    }
  };
console.log(avatar)
  return (
    <Form
      form={form}
      initialValues={{
        name: "",
        email: "",
        calendar: WeekDayProps,
      }}
      onFinish={onSubmit}
      style={{ marginTop: "2rem" }}
    >
      <Row justify="center">
        <Col span={14}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please input teacher name" }]}
          >
            <Input placeholder="Teacher Name" />
          </Form.Item>
        </Col>
        <Col span={14}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input teacher email" }]}
          >
            <Input placeholder="Teacher Email" />
          </Form.Item>
        </Col>
        <Col span={14}>
          <Form.Item>
            <Upload
              listType="picture-card"
              value={avatar.fileList}
              onChange={(e) => {
                const uploadTask = upLoadFile(
                  e.fileList[0]?.originFileObj,
                  `avatar/${e.fileList[0].name}`
                );
                uploadTask.on(
                  "state_changed",
                  null,
                  (error) => {
                    alert(error);
                  },
                  () => {
                    getDownloadURL(uploadTask.snapshot.ref).then(
                      (downloadURL) => {
                        setAvatar({
                          fileList: e.fileList,
                          url: downloadURL,
                        });
                      }
                    );
                  }
                );
              }}
            >
              Upload
            </Upload>
          </Form.Item>
        </Col>
        <Col span={14} style={{ marginBottom: "1rem" }}>
          <Typography.Text strong>Calendar</Typography.Text>
        </Col>
        {weekDay.map((item) => (
          <>
            <Col span={14} style={{ marginBottom: "1rem" }} key={item.value}>
              <Col span={24} key={item.value}>
                <Typography.Text strong>{item.label}</Typography.Text>
                {item.events.map((event, eventIndex) => {
                  const index = weekDay.findIndex(
                    (day) => day.value === item.value
                  );
                  return (
                    <Row
                      key={eventIndex}
                      justify="center"
                      align="middle"
                      gutter={[16, 16]}
                      style={{ marginBottom: "1.5rem" }}
                    >
                      <Col span={22}>
                        <TimePicker.RangePicker
                          value={
                            !!event.start && !!event.end
                              ? [
                                  moment(event.start, "HH:mm:ss"),
                                  moment(event.end, "HH:mm:ss"),
                                ]
                              : []
                          }
                          showSecond={false}
                          style={{ width: "100%", marginBottom: "0.5rem" }}
                          onChange={(_, timeString) => {
                            setWeekDay((prev) => {
                              const newWeekDay = [...prev];
                              newWeekDay[index].events[eventIndex] = {
                                ...newWeekDay[index].events[eventIndex],
                                start: timeString[0],
                                end: timeString[1],
                              };
                              return newWeekDay;
                            });
                          }}
                        />
                        <Input
                          placeholder="Detail"
                          onChange={(e) => {
                            setWeekDay((prev) => {
                              const newWeekDay = [...prev];
                              newWeekDay[index].events[eventIndex] = {
                                ...newWeekDay[index].events[eventIndex],
                                detail: e.target.value,
                              };
                              return newWeekDay;
                            });
                          }}
                        />
                      </Col>
                      <Col span={2}>
                        <Button
                          type="primary"
                          size="large"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => deleteEvent(item.value, eventIndex)}
                        />
                      </Col>
                    </Row>
                  );
                })}

                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  style={{ width: "100%", marginTop: "1rem" }}
                  onClick={() => addEvent(item.value)}
                >
                  Add event
                </Button>
              </Col>
            </Col>
            <Divider />
          </>
        ))}
        <Button
          type="primary"
          htmlType="submit"
          style={{ marginBottom: "1rem" }}
          loading={loading}
        >
          Submit
        </Button>
      </Row>
    </Form>
  );
};
