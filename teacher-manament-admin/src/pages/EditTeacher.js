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
  Spin,
} from "antd";
import { useState, useEffect, useMemo } from "react";
import moment from "moment";
import { patchSchedules, deleteSchedules } from "../api/teacher";
import { addSchedule, getScheduleById } from "../api/schedule";
import { flatten } from "../utils/flatten";
import { useParams } from "react-router-dom";

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

export const EditTeacher = () => {
  const { id: teacherId } = useParams();

  const [weekDay, setWeekDay] = useState(WeekDayProps);
  const [loading, setLoading] = useState(false);
  const [initLoading, setInitLoading] = useState(false);
  const [teacher, setTeacher] = useState({});

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

  const deleteEvent = async (date, index, id) => {
    try {
      if (!!id) await deleteSchedules(id);
      const weekDayIndex = weekDay.findIndex((item) => item.value === date);
      setWeekDay((prev) => {
        const newWeekDay = [...prev];
        newWeekDay[weekDayIndex].events = newWeekDay[
          weekDayIndex
        ].events.filter((_, i) => i !== index);
        return newWeekDay;
      });
    } catch (e) {}
  };

  useEffect(() => {
    setInitLoading(true);
    getScheduleById(teacherId)
      .then(({ data }) => {
        setTeacher({
          id: data.teacher.id,
          email: data.teacher.email,
          name: data.teacher.name,
        });
        const initWeekDay = data.schedules.map((item) => {
          return {
            label: item.day !== 0 ? WeekDayProps[item.day - 1].label : "Sunday",
            value: item.day !== 0 ? WeekDayProps[item.day - 1].value : "Sunday",
            events: data.schedules
              .map((schedule) => {
                if (schedule.day === item.day) {
                  return {
                    id: schedule.id,
                    start: `${schedule.from}:00`,
                    end: `${schedule.to}:00`,
                    detail: schedule.name,
                  };
                }
                return null;
              })
              .filter((item) => !!item),
          };
        });

        setWeekDay(
          WeekDayProps.map((item) => {
            const index = initWeekDay.findIndex((i) => i.value === item.value);
            return {
              ...item,
              events: initWeekDay[index]?.events || [
                {
                  start: "",
                  end: "",
                  detail: "",
                },
              ],
            };
          })
        );
      })
      .finally(() => setInitLoading(false));
  }, [teacherId]);

  const onSubmit = async (values) => {
    setLoading(true);
    try {
      const schedule = flatten(
        weekDay.map((item, index) => {
          return item.events.map((event) => ({
            name: event.detail,
            from: event.start.slice(0, -3),
            to: event.end.slice(0, -3),
            teacherId: Number(teacherId),
            day: index !== 6 ? String(index + 1) : "0",
            id: event.id,
          }));
        })
      ).filter((item) => !!item.from && !!item.to);

      await Promise.all(
        schedule.map(async (item, index) => {
          if (item.id) {
            return await patchSchedules(item, item.id);
          }
          return await addSchedule({
            schedules: [item],
          });
        })
      );
      message.success("Add teacher successfully");
    } catch (e) {
      message.error("Add teacher failed");
    } finally {
      setLoading(false);
    }
  };

  const initValue = useMemo(
    () => ({
      name: teacher?.name || "",
      email: teacher?.email || "",
      phone: "",
      address: "",
      calendar: WeekDayProps,
    }),
    [teacher]
  );

  useEffect(() => {
    form.setFieldsValue(initValue);
  }, [form, initValue]);

  if (initLoading)
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Spin size="large" />
      </div>
    );

  return (
    <Form
      form={form}
      initialValues={initValue}
      onFinish={onSubmit}
      style={{ marginTop: "2rem" }}
    >
      <Row justify="center">
        <Col span={14}>
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please input teacher name" }]}
          >
            <Input placeholder="Teacher Name" value={teacher.name} readOnly />
          </Form.Item>
        </Col>
        <Col span={14}>
          <Form.Item
            name="email"
            rules={[{ required: true, message: "Please input teacher email" }]}
          >
            <Input placeholder="Teacher Email" readOnly value={teacher.email} />
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
                          value={event.detail}
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
                          onClick={() => {
                            console.log(item);
                            deleteEvent(
                              item.value,
                              eventIndex,
                              item.events[0].id
                            );
                          }}
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
