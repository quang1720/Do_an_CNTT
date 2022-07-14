import { Table } from "antd";
import { useEffect, useState } from "react";
import { getSchedules } from "../api/teacher";

const WeekDayProps = [
  {
    label: "Monday",
    value: "Monday",
  },
  {
    label: "Tuesday",
    value: "Tuesday",
  },
  {
    label: "Wednesday",
    value: "Wednesday",
  },
  {
    label: "Thursday",
    value: "Thursday",
  },
  {
    label: "Friday",
    value: "Friday",
  },
  {
    label: "Saturday",
    value: "Saturday",
  },
  {
    label: "Sunday",
    value: "Sunday",
  },
];

export const Schedule = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);

  const columns = [
    {
      title: "Teacher",
      key: "teacher",
      render: (schedule) => {
        return `${schedule.teacher.name} - ${schedule.teacher.email}`;
      },
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "From",
      key: "from",
      dataIndex: "from",
    },
    {
      title: "To",
      key: "to",
      dataIndex: "to",
    },
    {
      title: "Weekday",
      key: "weekday",
      render: (schedule) => {
        if (schedule.day === 0) return "Sunday";

        return WeekDayProps[schedule.day - 1].label;
      },
    },
  ];
  useEffect(() => {
    setLoading(true);
    getSchedules()
      .then(({ data }) => {
        setSchedules(
          data.schedules.sort((a, b) =>
            a.teacher.name < b.teacher.name ? -1 : 1
          )
        );
      })
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
        dataSource={schedules}
        columns={columns}
        loading={loading}
      />
    </>
  );
};
