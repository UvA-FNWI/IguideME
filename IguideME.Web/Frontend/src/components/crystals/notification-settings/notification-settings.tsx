import {
  getNotificationSettings,
  postNotificationSettings,
} from "@/api/course_settings";
import Loading from "@/components/particles/loading";
import { Button, Checkbox, Col, Form, Row } from "antd";
import { useForm } from "antd/es/form/Form";
import { useState, type FC, type ReactElement } from "react";
import DatePicker from "react-multi-date-picker";
import { useMutation, useQuery, useQueryClient } from "react-query";

const { Item } = Form;

const NotificationSettings: FC = (): ReactElement => {
  const { data } = useQuery("notification-settings", getNotificationSettings);
  if (data === undefined) {
    return <Loading />;
  }
  const isRange = data[0].includes("-");
  const dates = data.map((element) =>
    isRange
      ? element.split("-").map((v) => new Date(Date.parse(v)))
      : new Date(Date.parse(element)),
  );
  console.log("test", data);
  console.log("test1", dates);
  // dates.map((value) => Date.parse(value)),
  return <NotificationSettingsForm dates={dates} isRange={isRange} />;
};

interface Data {
  dates: Array<Date | Date[]>;
}

const NotificationSettingsForm: FC<{
  dates: Array<Date | Date[]>;
  isRange: boolean;
}> = ({ dates, isRange }): ReactElement => {
  const [form] = useForm<Data>();
  const [range, setRange] = useState<boolean>(isRange);
  const queryClient = useQueryClient();
  const { mutate: saveDates } = useMutation({
    mutationFn: postNotificationSettings,
    onSuccess: async () => {
      await queryClient.invalidateQueries("notification-settings");
    },
  });

  const submit = (data: Data): void => {
    const dates = data.dates;
    if (range) {
      const datelist = dates
        .toString()
        .split(",")
        .reduce(
          (acc, val, idx) =>
            idx % 2 === 0
              ? acc.length !== 0
                ? `${acc},${val}`
                : `${val}`
              : `${acc}-${val}`,
          "",
        );

      console.log("test", datelist);
      saveDates(datelist);
    } else {
      saveDates(dates.toString());
    }
  };
  return (
    <Form<Data>
      form={form}
      name="notification_settings_form"
      initialValues={{ dates }}
      onFinish={submit}
    >
      <Row align="middle" style={{ paddingTop: 10, paddingBottom: 10 }}>
        <Col span={6}>
          <Item name="dates" label="Dates" style={{ margin: 0 }}>
            <DatePicker multiple={true} range={range} />
          </Item>
        </Col>
        <Col span={4}>
          <Item label="Range" style={{ margin: 0 }}>
            <Checkbox
              checked={range}
              onChange={(e) => {
                setRange(e.target.checked);
              }}
            />
          </Item>
        </Col>
        <Col
          span={2}
          offset={12}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            paddingRight: 10,
          }}
        >
          <Item style={{ margin: "0px 10px 5px 0px" }} noStyle>
            <Button htmlType="submit">Save</Button>
          </Item>
        </Col>
      </Row>
    </Form>
  );
};

export default NotificationSettings;
