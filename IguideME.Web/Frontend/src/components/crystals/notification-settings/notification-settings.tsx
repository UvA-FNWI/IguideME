import { getNotificationSettings, postNotificationSettings } from '@/api/course_settings';
import QueryError from '@/components/particles/QueryError';
import QueryLoading from '@/components/particles/QueryLoading';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button, Checkbox, DatePicker, Divider, Form, Radio } from 'antd';
import { type CheckboxChangeEvent } from 'antd/es/checkbox';
import { type CheckboxValueType } from 'antd/es/checkbox/Group';
import { useForm } from 'antd/es/form/Form';
import dayjs from 'dayjs';
import { memo, useCallback, useEffect, useMemo, useState, type FC, type ReactElement } from 'react';
import { type DateObject } from 'react-multi-date-picker';
import { toast } from 'sonner';

export interface NotificationAdminSettings {
  isRange: boolean;
  selectedDays: string | null;
  selectedDates: string | null;
}

const NotificationSettings: FC = (): ReactElement => {
  const { data, isError, isLoading } = useQuery({
    queryKey: ['notification-settings'],
    queryFn: getNotificationSettings,
  });

  const { range, selectedDays, selectedDates } = useMemo(() => {
    if (data) {
      const range = data.isRange;
      const selectedDays = data.selectedDays ? data.selectedDays.split(', ') : null;
      const selectedDates = data.selectedDates ? data.selectedDates.split(', ').map((date) => dayjs(date)) : [];

      return { range, selectedDays, selectedDates };
    }
    return { range: false, selectedDays: null, selectedDates: [] };
  }, [data]);

  if (isError || isLoading || data === undefined) {
    return (
      <QueryLoading isLoading={isLoading}>
        <div className='h-20 bg-surface1'>
          {(isError || (data === undefined && !isLoading)) && (
            <QueryError className='top-[-30px]' title='Failed to load notification settings' />
          )}
        </div>
      </QueryLoading>
    );
  }

  return (
    <NotificationSettingsForm isRange={range ?? false} selectedDays={selectedDays} selectedDates={selectedDates} />
  );
};

interface Data {
  selectedDates: DateObject[] | [DateObject, DateObject];
}

const NotificationSettingsForm: FC<{
  isRange: boolean;
  selectedDays: string[] | null;
  // ! If you change the type of selectedDates to the correct type (DayJS[]), the form will not work
  selectedDates: any;
}> = memo(({ isRange, selectedDays, selectedDates }): ReactElement => {
  const [form] = useForm<Data>();
  const [range, setRange] = useState<boolean>(isRange);

  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>(selectedDays ?? ['Tue', 'Thu']);

  const rangeChangeHandler = useCallback(() => {
    form.resetFields();
    setRange((prev) => !prev);
  }, [form]);

  const queryClient = useQueryClient();
  const { mutate, status } = useMutation({
    mutationFn: postNotificationSettings,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
    },
  });

  useEffect(() => {
    if (status === 'success') {
      toast.success('Notification settings saved successfully', {
        closeButton: true,
      });
    } else if (status === 'error') {
      toast.error('Failed to save notification settings', {
        closeButton: true,
      });
    }
  }, [status]);

  const submit = useCallback(
    (data: Data): void => {
      const notificationSettingsData = {
        isRange: range,
        selectedDays: checkedList.length === 0 ? null : checkedList.map((day) => day.toString()).join(', '),
        selectedDates: data.selectedDates.map((date) => date.format('YYYY-MM-DD')).join(', '),
      };

      mutate(notificationSettingsData);
    },
    [checkedList, range, mutate],
  );

  return (
    <Form<Data>
      className='flex flex-col gap-2'
      initialValues={{ ['selectedDates']: selectedDates }}
      form={form}
      name='notification_settings_form'
      onFinish={submit}
    >
      <p className='mb-2 text-sm'>
        Select the dates or the range of dates that the students will receive notifications.
      </p>
      <Radio.Group buttonStyle='solid' defaultValue={range} onChange={rangeChangeHandler}>
        <Radio.Button
          disabled={!range}
          value={false}
        >
          Select Dates
        </Radio.Button>
        <Radio.Button
          disabled={range}
          value={true}
        >
          Select Range
        </Radio.Button>
      </Radio.Group>
      <DatePickers isRange={range} checkedList={checkedList} setCheckedList={setCheckedList} />
      <div className='flex justify-end'>
        <Button
          className='right-0 min-w-20 !border-none bg-overlay1 hover:!border-none hover:!bg-overlay2 [&_span]:text-text'
          htmlType='submit'
        >
          Save
        </Button>
      </div>
    </Form>
  );
});
NotificationSettingsForm.displayName = 'NotificationSettingsForm';
export default NotificationSettings;

interface DatePickersProps {
  isRange: boolean;
  checkedList: CheckboxValueType[];
  setCheckedList: (list: CheckboxValueType[]) => void;
}

const DatePickers: FC<DatePickersProps> = memo(({ isRange, checkedList, setCheckedList }): ReactElement => {
  const checkBoxOptions = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const [error, setError] = useState<string | null>(null);

  const onGroupChange = useCallback((list: CheckboxValueType[]) => {
    setCheckedList(list);

    if (list.length === 0) {
      setError('Please select at least one day');
    } else {
      setError(null);
    }
  }, []);

  const onCheckAllChange = useCallback((e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? checkBoxOptions : []);
  }, []);

  const Range = (
    <>
      <Form.Item
        className='m-0'
        name='selectedDates'
        rules={[{ required: true, message: 'Please select a date range' }]}
      >
        <DatePicker.RangePicker
          className='!w-72 [&_input]:!text-text'
          disabledDate={(current) => current && current.toDate() < new Date()}
          format='YYYY-MM-DD'
          picker='week'
        />
      </Form.Item>
      <Divider />
      <p className='text-sm'>On which days of the week do you want to send notifications?</p>
      <div className='flex h-14 align-top'>
        <Checkbox
          className='h-fit text-text'
          indeterminate={checkedList.length > 0 && checkedList.length < checkBoxOptions.length}
          onChange={onCheckAllChange}
          checked={checkBoxOptions.length === checkedList.length}
        >
          Check all
        </Checkbox>
        <Divider type='vertical' className='h-6' />
        <Form.Item className='m-0 [&_div]:!min-h-0' validateStatus={error ? 'error' : ''} help={error}>
          <Checkbox.Group
            className='[&_span]:!text-text'
            options={checkBoxOptions}
            value={checkedList}
            onChange={onGroupChange}
          />
        </Form.Item>
      </div>
    </>
  );

  const Single = (
    <Form.Item className='m-0' name='selectedDates' rules={[{ required: true, message: 'Please select a date' }]}>
      <DatePicker
        className='!w-72'
        disabledDate={(current) => current.toDate() < new Date()}
        format='YYYY-MM-DD'
        multiple
        maxTagCount='responsive'
      />
    </Form.Item>
  );

  return isRange ? Range : Single;
});
DatePickers.displayName = 'DatePickers';
